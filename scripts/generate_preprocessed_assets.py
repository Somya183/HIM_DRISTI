import os
import sys
import json
import base64
import numpy as np
import cv2
from PIL import Image

base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, os.path.join(base_dir, "backend"))

from preprocessing.preprocess_pipeline import LunarPreprocessor

dataset_dir = os.path.join(base_dir, "dataset")
craters = ["shackleton", "haworth", "shoemaker"]

preprocessor = LunarPreprocessor(dataset_dir=dataset_dir)

def matrix_to_base64_png(arr, colormap=None):
    norm_8u = cv2.normalize(arr, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)
    if colormap is not None:
        colored = cv2.applyColorMap(norm_8u, colormap)
        colored_rgb = cv2.cvtColor(colored, cv2.COLOR_BGR2RGB)
        pil_img = Image.fromarray(colored_rgb)
    else:
        pil_img = Image.fromarray(norm_8u)
        
    import io
    buf = io.BytesIO()
    pil_img.save(buf, format="PNG")
    return f"data:image/png;base64,{base64.b64encode(buf.getvalue()).decode('utf-8')}"

data = {}

for c in craters:
    radar_file = os.path.join(dataset_dir, "radar", f"dfsar_cpr_{c}.npy")
    optical_file = os.path.join(dataset_dir, "optical", f"lroc_optical_{c}.npy")
    dem_file = os.path.join(dataset_dir, "dem", f"lola_dem_{c}.npy")
    shadow_file = os.path.join(dataset_dir, "shadow", f"psr_shadow_{c}.npy")

    raw_radar = np.load(radar_file)
    raw_optical = np.load(optical_file)
    raw_dem = np.load(dem_file)
    raw_shadow = np.load(shadow_file)

    clean_radar = preprocessor.process_radar(raw_radar)
    clean_optical = preprocessor.process_optical(raw_optical)
    clean_dem, _, _ = preprocessor.process_dem(raw_dem)
    clean_shadow = preprocessor.process_shadow(raw_shadow)

    data[c] = {
        "optical": matrix_to_base64_png(clean_optical),
        "radar": matrix_to_base64_png(clean_radar, cv2.COLORMAP_INFERNO),
        "dem": matrix_to_base64_png(clean_dem, cv2.COLORMAP_TURBO),
        "shadow": matrix_to_base64_png(clean_shadow, cv2.COLORMAP_BONE)
    }

data["faustini"] = data["haworth"]
data["cabeus"] = data["shoemaker"]

out_file = os.path.join(base_dir, "frontend", "src", "assets", "realLunarDatasets.js")
js_content = f"export const REAL_LUNAR_DATASETS = {json.dumps(data, indent=2)};\n"

with open(out_file, "w") as f:
    f.write(js_content)

print(f"[+] Successfully generated & embedded preprocessed satellite imagery -> {out_file}")
