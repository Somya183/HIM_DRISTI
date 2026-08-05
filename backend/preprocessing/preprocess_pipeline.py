import os
import json
import numpy as np
import cv2
from scipy.ndimage import median_filter
from PIL import Image

class LunarPreprocessor:
    """
    Phase 2 - Preprocessing Pipeline for Lunar Water Ice Detection.
    
    Processing Steps per Modality:
    --------------------------------
    1. Radar:
       - Noise Removal: Bilateral Filtering & Median Filtering to remove SAR multiplicative speckle
       - Normalization: Range clipping and Min-Max scaling [0.0, 1.0]
       
    2. Optical:
       - Resize: Interpolation to target spatial dimensions (512, 512)
       - Contrast Enhancement: Contrast Limited Adaptive Histogram Equalization (CLAHE)
       
    3. DEM (Terrain):
       - Normalize Elevation: Scaling relative to reference lunar datum and min/max bounds [0.0, 1.0]
       
    4. Shadow (PSR):
       - Binary Mask: Strict thresholding (1 = Permanent Shadow Region, 0 = Sunlit) with morphological noise cleanup
    """

    def __init__(self, dataset_dir=None, output_dir=None, target_shape=(512, 512)):
        if dataset_dir is None:
            base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
            dataset_dir = os.path.join(base_dir, "dataset")
        if output_dir is None:
            output_dir = os.path.join(dataset_dir, "preprocessed")
            
        self.dataset_dir = dataset_dir
        self.output_dir = output_dir
        self.target_shape = target_shape
        os.makedirs(self.output_dir, exist_ok=True)

    # ----------------------------------------------------
    # 1. RADAR PREPROCESSING
    # ----------------------------------------------------
    def process_radar(self, raw_radar):
        """
        Radar: Noise Removal (Speckle Filter) -> Normalization
        """
        print("[1/4] Preprocessing Radar (Speckle Noise Removal & Normalization)...")
        # Step A: Filter out invalid non-physical negative values or extreme outliers
        clean_radar = np.copy(raw_radar)
        clean_radar = np.nan_to_num(clean_radar, nan=0.35)
        clean_radar = np.clip(clean_radar, 0.0, 3.5)

        # Step B: Speckle Noise Removal using Median + Bilateral Filter
        # Convert to 8-bit temporary for OpenCV bilateral filter
        radar_8u = cv2.normalize(clean_radar, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)
        denoised_8u = cv2.bilateralFilter(radar_8u, d=5, sigmaColor=50, sigmaSpace=50)
        
        # Combine with median filter for impusive noise
        denoised_med = median_filter(denoised_8u, size=3)
        
        # Step C: Normalization back to [0.0, 1.0] float32
        norm_radar = denoised_med.astype(np.float32) / 255.0

        return norm_radar

    # ----------------------------------------------------
    # 2. OPTICAL PREPROCESSING
    # ----------------------------------------------------
    def process_optical(self, raw_optical):
        """
        Optical: Resize -> Contrast Enhancement (CLAHE)
        """
        print("[2/4] Preprocessing Optical (Resize & CLAHE Contrast Enhancement)...")
        # Step A: Resize to target shape if needed
        if raw_optical.shape != self.target_shape:
            resized = cv2.resize(raw_optical, self.target_shape, interpolation=cv2.INTER_CUBIC)
        else:
            resized = np.copy(raw_optical)

        # Step B: Normalize to 8-bit image for CLAHE
        optical_8u = cv2.normalize(resized, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)

        # Step C: Contrast Limited Adaptive Histogram Equalization (CLAHE)
        clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
        enhanced_8u = clahe.apply(optical_8u)

        # Step D: Float32 Normalization [0.0, 1.0]
        enhanced_optical = enhanced_8u.astype(np.float32) / 255.0

        return enhanced_optical

    # ----------------------------------------------------
    # 3. DEM PREPROCESSING
    # ----------------------------------------------------
    def process_dem(self, raw_dem):
        """
        DEM: Elevation Normalization & Slope Calculation
        """
        print("[3/4] Preprocessing DEM (Elevation Normalization)...")
        # Step A: Clean NaNs and extreme elevation outliers
        clean_dem = np.nan_to_num(raw_dem, nan=np.nanmean(raw_dem))

        # Step B: Min-Max Normalization to [0.0, 1.0]
        min_elev = np.min(clean_dem)
        max_elev = np.max(clean_dem)
        
        if max_elev > min_elev:
            norm_dem = (clean_dem - min_elev) / (max_elev - min_elev)
        else:
            norm_dem = np.zeros_like(clean_dem, dtype=np.float32)

        return norm_dem.astype(np.float32), float(min_elev), float(max_elev)

    # ----------------------------------------------------
    # 4. SHADOW PREPROCESSING
    # ----------------------------------------------------
    def process_shadow(self, raw_shadow):
        """
        Shadow: Binary Masking & Morphological Cleaning
        """
        print("[4/4] Preprocessing Shadow (Binary Masking & Morphological Cleanup)...")
        # Step A: Strict Binary Thresholding (1 = Permanent Shadow Region, 0 = Sunlit)
        binary_mask = (raw_shadow > 0.5).astype(np.uint8)

        # Step B: Morphological Closing to remove isolated single-pixel noise
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
        cleaned_mask = cv2.morphologyEx(binary_mask, cv2.MORPH_CLOSE, kernel)

        return cleaned_mask.astype(np.float32)

    # ----------------------------------------------------
    # RUN PIPELINE FOR ALL MODALITIES
    # ----------------------------------------------------
    def run_pipeline(self):
        """Run Phase 2 Preprocessing on raw dataset folders and save cleaned matrices."""
        radar_raw_path = os.path.join(self.dataset_dir, "radar", "dfsar_cpr_shackleton.npy")
        optical_raw_path = os.path.join(self.dataset_dir, "optical", "lroc_optical_shackleton.npy")
        dem_raw_path = os.path.join(self.dataset_dir, "dem", "lola_dem_shackleton.npy")
        shadow_raw_path = os.path.join(self.dataset_dir, "shadow", "psr_shadow_shackleton.npy")

        if not all(os.path.exists(p) for p in [radar_raw_path, optical_raw_path, dem_raw_path, shadow_raw_path]):
            raise FileNotFoundError("Raw Phase 1 datasets not found. Please ensure Phase 1 datasets are present.")

        raw_radar = np.load(radar_raw_path)
        raw_optical = np.load(optical_raw_path)
        raw_dem = np.load(dem_raw_path)
        raw_shadow = np.load(shadow_raw_path)

        # Process each modality
        clean_radar = self.process_radar(raw_radar)
        clean_optical = self.process_optical(raw_optical)
        clean_dem, min_elev, max_elev = self.process_dem(raw_dem)
        clean_shadow = self.process_shadow(raw_shadow)

        # Stack cleaned modalities into shape (512, 512, 4)
        stacked_cleaned = np.stack([clean_radar, clean_optical, clean_dem, clean_shadow], axis=-1)

        # Save preprocessed matrices & images
        np.save(os.path.join(self.output_dir, "radar_cleaned.npy"), clean_radar)
        Image.fromarray((clean_radar * 255).astype(np.uint8)).save(os.path.join(self.output_dir, "radar_cleaned.png"))

        np.save(os.path.join(self.output_dir, "optical_cleaned.npy"), clean_optical)
        Image.fromarray((clean_optical * 255).astype(np.uint8)).save(os.path.join(self.output_dir, "optical_cleaned.png"))

        np.save(os.path.join(self.output_dir, "dem_cleaned.npy"), clean_dem)
        Image.fromarray((clean_dem * 255).astype(np.uint8)).save(os.path.join(self.output_dir, "dem_cleaned.png"))

        np.save(os.path.join(self.output_dir, "shadow_cleaned.npy"), clean_shadow)
        Image.fromarray((clean_shadow * 255).astype(np.uint8)).save(os.path.join(self.output_dir, "shadow_cleaned.png"))

        np.save(os.path.join(self.output_dir, "preprocessed_stacked_features.npy"), stacked_cleaned)

        # Save metadata summary
        meta_summary = {
            "phase": "Phase 2 - Preprocessing",
            "status": "Complete",
            "output_tensor_shape": list(stacked_cleaned.shape),
            "channels": [
                "0: Denoised & Normalized Radar CPR",
                "1: Resized & CLAHE Enhanced Optical Reflectance",
                "2: Min-Max Normalized DEM Elevation",
                "3: Binary Morphologically Cleaned Shadow Mask"
            ],
            "dem_stats": {"min_elevation_m": min_elev, "max_elevation_m": max_elev},
            "psr_coverage_percent": float(np.mean(clean_shadow) * 100.0)
        }
        with open(os.path.join(self.output_dir, "preprocessing_manifest.json"), "w") as f:
            json.dump(meta_summary, f, indent=2)

        print("==================================================")
        print("[SUCCESS] Phase 2 Preprocessing Pipeline Complete!")
        print(f"Preprocessed Stacked Feature Matrix Shape: {stacked_cleaned.shape}")
        print(f"Saved preprocessed outputs -> {self.output_dir}")
        print("==================================================")

        return stacked_cleaned, meta_summary

if __name__ == "__main__":
    preprocessor = LunarPreprocessor()
    preprocessor.run_pipeline()
