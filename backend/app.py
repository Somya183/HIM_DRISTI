import os
import io
import json
import base64
import numpy as np
from PIL import Image
import cv2
from flask import Flask, request, jsonify, send_file, Response
from flask_cors import CORS

from preprocessing.preprocess_pipeline import LunarPreprocessor
from ai.ice_detector import LunarIceDetector
from services.rover_planner import RoverPathPlanner
from services.report_generator import MissionReportGenerator

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DATASET_DIR = os.path.join(BASE_DIR, "dataset")

preprocessor = LunarPreprocessor(dataset_dir=DATASET_DIR)
ice_detector = LunarIceDetector()
rover_planner = RoverPathPlanner()
report_generator = MissionReportGenerator()

def matrix_to_base64_image(arr, colormap=None, norm=True):
    if norm:
        if colormap is None:
            img_arr = cv2.normalize(arr, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)
        else:
            norm_8u = cv2.normalize(arr, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)
            img_arr = cv2.applyColorMap(norm_8u, colormap)
            img_arr = cv2.cvtColor(img_arr, cv2.COLOR_BGR2RGB)
    else:
        img_arr = (arr * 255).astype(np.uint8)
        
    pil_img = Image.fromarray(img_arr)
    buffer = io.BytesIO()
    pil_img.save(buffer, format="PNG")
    b64_str = base64.b64encode(buffer.getvalue()).decode("utf-8")
    return f"data:image/png;base64,{b64_str}"

TARGET_CRATERS = {
    "shackleton": {
        "id": "shackleton",
        "name": "Shackleton Crater",
        "coordinates": {"lat": -89.9, "lon": 0.0},
        "diameter_km": 21.0,
        "depth_km": 4.2,
        "description": "Lunar South Pole prime landing region with massive PSR cold traps."
    },
    "haworth": {
        "id": "haworth",
        "name": "Haworth Crater",
        "coordinates": {"lat": -87.5, "lon": -5.0},
        "diameter_km": 35.0,
        "depth_km": 3.8,
        "description": "Deeply shadowed crater with high CPR radar backscatter anomaly."
    },
    "shoemaker": {
        "id": "shoemaker",
        "name": "Shoemaker Crater",
        "coordinates": {"lat": -88.1, "lon": 45.0},
        "diameter_km": 50.0,
        "depth_km": 4.5,
        "description": "Large south polar impact structure holding extensive volatile deposits."
    }
}

@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy", "service": "HImDristi Backend API", "version": "2.0.0"})

@app.route("/api/dataset/targets", methods=["GET"])
def get_targets():
    return jsonify({"targets": list(TARGET_CRATERS.values())})

@app.route("/api/analyze", methods=["POST"])
def analyze_lunar_data():
    try:
        req_data = request.json or {}
        target_id = req_data.get("target", "shackleton").lower()
        if target_id not in TARGET_CRATERS:
            target_id = "shackleton"

        target_info = TARGET_CRATERS[target_id]
        center_coords = (target_info["coordinates"]["lat"], target_info["coordinates"]["lon"])
        extent_km = float(target_info.get("diameter_km", 21.0)) * 1.2

        radar_file = os.path.join(DATASET_DIR, "radar", f"dfsar_cpr_{target_id}.npy")
        optical_file = os.path.join(DATASET_DIR, "optical", f"lroc_optical_{target_id}.npy")
        dem_file = os.path.join(DATASET_DIR, "dem", f"lola_dem_{target_id}.npy")
        shadow_file = os.path.join(DATASET_DIR, "shadow", f"psr_shadow_{target_id}.npy")

        if not os.path.exists(radar_file):
            radar_file = os.path.join(DATASET_DIR, "radar", "dfsar_cpr_shackleton.npy")
            optical_file = os.path.join(DATASET_DIR, "optical", "lroc_optical_shackleton.npy")
            dem_file = os.path.join(DATASET_DIR, "dem", "lola_dem_shackleton.npy")
            shadow_file = os.path.join(DATASET_DIR, "shadow", "psr_shadow_shackleton.npy")

        raw_radar = np.load(radar_file)
        raw_optical = np.load(optical_file)
        raw_dem = np.load(dem_file)
        raw_shadow = np.load(shadow_file)

        clean_radar = preprocessor.process_radar(raw_radar)
        clean_optical = preprocessor.process_optical(raw_optical)
        clean_dem, min_elev, max_elev = preprocessor.process_dem(raw_dem)
        clean_shadow = preprocessor.process_shadow(raw_shadow)

        stacked_features = np.stack([clean_radar, clean_optical, clean_dem, clean_shadow], axis=-1)

        confidence_map, ice_metrics = ice_detector.predict_ice_confidence(
            stacked_features, center_coords=center_coords, extent_km=extent_km
        )

        suitability_score, slopes, landing_info = rover_planner.evaluate_landing_sites(
            raw_dem, clean_shadow, confidence_map,
            ice_deposits=ice_metrics.get("ice_deposits"),
            center_coords=center_coords, extent_km=extent_km
        )
        
        path_result = rover_planner.plan_rover_path(
            raw_dem, slopes, landing_info["landing_coords_pixel"], landing_info["target_coords_pixel"]
        )

        images_b64 = {
            "raw": {
                "radar": matrix_to_base64_image(raw_radar, cv2.COLORMAP_INFERNO),
                "optical": matrix_to_base64_image(raw_optical),
                "dem": matrix_to_base64_image(raw_dem, cv2.COLORMAP_TURBO),
                "shadow": matrix_to_base64_image(raw_shadow, cv2.COLORMAP_BONE)
            },
            "preprocessed": {
                "radar": matrix_to_base64_image(clean_radar, cv2.COLORMAP_INFERNO),
                "optical": matrix_to_base64_image(clean_optical),
                "dem": matrix_to_base64_image(clean_dem, cv2.COLORMAP_TURBO),
                "shadow": matrix_to_base64_image(clean_shadow, cv2.COLORMAP_BONE)
            },
            "results": {
                "ice_confidence": matrix_to_base64_image(confidence_map, cv2.COLORMAP_JET),
                "landing_suitability": matrix_to_base64_image(suitability_score, cv2.COLORMAP_VIRIDIS),
                "slope_map": matrix_to_base64_image(slopes, cv2.COLORMAP_MAGMA)
            }
        }

        payload = {
            "status": "success",
            "target": target_info,
            "images": images_b64,
            "metrics": ice_metrics,
            "ice_deposits": ice_metrics.get("ice_deposits", []),
            "landing_site": landing_info,
            "rover_path": path_result,
            "heightmap_grid": clean_dem[::4, ::4].tolist(),
            "ice_grid": confidence_map[::4, ::4].tolist()
        }

        return jsonify(payload)

    except Exception as e:
        print(f"Error analyzing lunar data: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route("/api/upload", methods=["POST"])
def upload_and_process():
    try:
        if "file" not in request.files:
            return jsonify({"status": "error", "message": "No file uploaded in request"}), 400

        file = request.files["file"]
        if file.filename == "":
            return jsonify({"status": "error", "message": "Selected file is empty"}), 400

        img_bytes = file.read()
        pil_img = Image.open(io.BytesIO(img_bytes)).convert("L")
        uploaded_arr = np.array(pil_img, dtype=np.float32)

        if uploaded_arr.shape != (512, 512):
            uploaded_arr = cv2.resize(uploaded_arr, (512, 512), interpolation=cv2.INTER_CUBIC)

        raw_upload_norm = cv2.normalize(uploaded_arr, None, 0.0, 1.0, cv2.NORM_MINMAX)

        clean_radar = preprocessor.process_radar(raw_upload_norm)
        clean_optical = preprocessor.process_optical(raw_upload_norm)
        clean_dem, min_elev, max_elev = preprocessor.process_dem(raw_upload_norm)
        clean_shadow = preprocessor.process_shadow(raw_upload_norm)

        stacked_features = np.stack([clean_radar, clean_optical, clean_dem, clean_shadow], axis=-1)

        center_coords = (-89.9, 0.0)
        extent_km = 25.0

        confidence_map, ice_metrics = ice_detector.predict_ice_confidence(
            stacked_features, center_coords=center_coords, extent_km=extent_km
        )

        suitability_score, slopes, landing_info = rover_planner.evaluate_landing_sites(
            raw_upload_norm, clean_shadow, confidence_map,
            ice_deposits=ice_metrics.get("ice_deposits"),
            center_coords=center_coords, extent_km=extent_km
        )
        path_result = rover_planner.plan_rover_path(
            raw_upload_norm, slopes, landing_info["landing_coords_pixel"], landing_info["target_coords_pixel"]
        )

        images_b64 = {
            "raw": {
                "radar": matrix_to_base64_image(raw_upload_norm, cv2.COLORMAP_INFERNO),
                "optical": matrix_to_base64_image(raw_upload_norm),
                "dem": matrix_to_base64_image(raw_upload_norm, cv2.COLORMAP_TURBO),
                "shadow": matrix_to_base64_image(raw_upload_norm, cv2.COLORMAP_BONE)
            },
            "preprocessed": {
                "radar": matrix_to_base64_image(clean_radar, cv2.COLORMAP_INFERNO),
                "optical": matrix_to_base64_image(clean_optical),
                "dem": matrix_to_base64_image(clean_dem, cv2.COLORMAP_TURBO),
                "shadow": matrix_to_base64_image(clean_shadow, cv2.COLORMAP_BONE)
            },
            "results": {
                "ice_confidence": matrix_to_base64_image(confidence_map, cv2.COLORMAP_JET),
                "landing_suitability": matrix_to_base64_image(suitability_score, cv2.COLORMAP_VIRIDIS),
                "slope_map": matrix_to_base64_image(slopes, cv2.COLORMAP_MAGMA)
            }
        }

        payload = {
            "status": "success",
            "is_custom_upload": True,
            "filename": file.filename,
            "target": {
                "id": "custom_upload",
                "name": f"Custom Upload ({file.filename})",
                "coordinates": {"lat": -89.9, "lon": 0.0},
                "diameter_km": 25.0,
                "depth_km": 4.0,
                "description": "User Custom Uploaded Lunar Terrain Dataset"
            },
            "images": images_b64,
            "metrics": ice_metrics,
            "ice_deposits": ice_metrics.get("ice_deposits", []),
            "landing_site": landing_info,
            "rover_path": path_result,
            "heightmap_grid": clean_dem[::4, ::4].tolist(),
            "ice_grid": confidence_map[::4, ::4].tolist()
        }

        return jsonify(payload)

    except Exception as e:
        print(f"Error processing custom upload: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

# --- PHASE 5 EXPORT ENDPOINTS ---
@app.route("/api/export/pdf", methods=["POST"])
def export_pdf():
    try:
        data = request.json or {}
        metrics = data.get("metrics", {})
        landing_site = data.get("landing_site", {})
        rover_path = data.get("rover_path", {})

        pdf_bytes = report_generator.generate_pdf_report(metrics, landing_site, rover_path)
        return send_file(
            io.BytesIO(pdf_bytes),
            mimetype="application/pdf",
            as_attachment=True,
            download_name="HImDristi_Lunar_Mission_Assessment_Report.pdf"
        )
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route("/api/export/geojson", methods=["POST"])
def export_geojson():
    try:
        data = request.json or {}
        rover_path = data.get("rover_path", {})
        landing_site = data.get("landing_site", {})
        geojson_data = report_generator.generate_geojson_path(rover_path, landing_site)

        return jsonify(geojson_data)
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route("/api/export/csv", methods=["POST"])
def export_csv():
    try:
        data = request.json or {}
        metrics = data.get("metrics", {})
        landing_site = data.get("landing_site", {})
        rover_path = data.get("rover_path", {})

        csv_str = report_generator.generate_csv_telemetry(metrics, landing_site, rover_path)
        return Response(
            csv_str,
            mimetype="text/csv",
            headers={"Content-disposition": "attachment; filename=HImDristi_Rover_Telemetry.csv"}
        )
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
