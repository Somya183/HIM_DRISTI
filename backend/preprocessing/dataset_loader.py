import os
import json
import numpy as np

class LunarDatasetLoader:
    """
    Data Loader and Preprocessor for Lunar Ice Detection multi-modal datasets.
    Modalities:
      - Radar: Chandrayaan-2 DFSAR CPR (Circular Polarization Ratio)
      - Optical: LRO LROC Surface Albedo
      - DEM: LOLA Digital Elevation Model (Meters)
      - Shadow: Permanent Shadow Region (PSR) Binary Mask
    """
    def __init__(self, dataset_dir=None):
        if dataset_dir is None:
            base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
            dataset_dir = os.path.join(base_dir, "dataset")
        
        self.dataset_dir = dataset_dir
        self.radar_dir = os.path.join(dataset_dir, "radar")
        self.optical_dir = os.path.join(dataset_dir, "optical")
        self.dem_dir = os.path.join(dataset_dir, "dem")
        self.shadow_dir = os.path.join(dataset_dir, "shadow")

    def verify_dataset_structure(self):
        """Checks if all required dataset folders and files exist."""
        required_files = {
            "radar": [os.path.join(self.radar_dir, "dfsar_cpr_shackleton.npy"), os.path.join(self.radar_dir, "metadata.json")],
            "optical": [os.path.join(self.optical_dir, "lroc_optical_shackleton.npy"), os.path.join(self.optical_dir, "metadata.json")],
            "dem": [os.path.join(self.dem_dir, "lola_dem_shackleton.npy"), os.path.join(self.dem_dir, "metadata.json")],
            "shadow": [os.path.join(self.shadow_dir, "psr_shadow_shackleton.npy"), os.path.join(self.shadow_dir, "metadata.json")],
        }
        
        status = {}
        all_ok = True
        for name, files in required_files.items():
            missing = [f for f in files if not os.path.exists(f)]
            if missing:
                status[name] = f"MISSING: {missing}"
                all_ok = False
            else:
                status[name] = "OK"
                
        return all_ok, status

    def load_all_modalities(self):
        """Loads numpy arrays for all 4 modalities and validates shape alignment."""
        all_ok, status = self.verify_dataset_structure()
        if not all_ok:
            raise FileNotFoundError(f"Dataset verification failed: {status}")

        radar = np.load(os.path.join(self.radar_dir, "dfsar_cpr_shackleton.npy"))
        optical = np.load(os.path.join(self.optical_dir, "lroc_optical_shackleton.npy"))
        dem = np.load(os.path.join(self.dem_dir, "lola_dem_shackleton.npy"))
        shadow = np.load(os.path.join(self.shadow_dir, "psr_shadow_shackleton.npy"))

        # Verify spatial dimension alignment
        assert radar.shape == optical.shape == dem.shape == shadow.shape, \
            f"Shape mismatch! Radar: {radar.shape}, Optical: {optical.shape}, DEM: {dem.shape}, Shadow: {shadow.shape}"

        # Load metadata
        metadata = {}
        for modal in ["radar", "optical", "dem", "shadow"]:
            meta_path = os.path.join(getattr(self, f"{modal}_dir"), "metadata.json")
            with open(meta_path, "r") as f:
                metadata[modal] = json.load(f)

        return {
            "radar": radar,
            "optical": optical,
            "dem": dem,
            "shadow": shadow,
            "metadata": metadata,
            "shape": radar.shape
        }

    def get_stacked_features(self, normalize=True):
        """
        Stack all 4 modalities into a (H, W, 4) feature tensor for AI model processing.
        Channels:
          0: Chandrayaan-2 DFSAR Radar CPR
          1: LROC Optical Albedo
          2: Normalized DEM Elevation
          3: PSR Shadow Mask (0 or 1)
        """
        data = self.load_all_modalities()
        radar = data["radar"]
        optical = data["optical"]
        dem = data["dem"]
        shadow = data["shadow"]

        if normalize:
            # Min-Max normalize DEM elevation
            dem_norm = (dem - dem.min()) / (dem.max() - dem.min() + 1e-8)
            # Clip optical
            optical_norm = np.clip(optical, 0.0, 1.0)
            # Clip radar CPR to reasonable range [0, 2.5]
            radar_norm = np.clip(radar / 2.5, 0.0, 1.0)
            stacked = np.stack([radar_norm, optical_norm, dem_norm, shadow], axis=-1)
        else:
            stacked = np.stack([radar, optical, dem, shadow], axis=-1)

        return stacked, data["metadata"]

if __name__ == "__main__":
    loader = LunarDatasetLoader()
    ok, status = loader.verify_dataset_structure()
    print("Dataset Status:", status)
    if ok:
        features, meta = loader.get_stacked_features()
        print(f"[OK] Successfully loaded and stacked multi-modal lunar dataset! Feature shape: {features.shape}")
