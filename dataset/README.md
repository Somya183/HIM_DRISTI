# Phase 1: Data Collection (Authentic Multi-Modal Lunar Datasets)

## Overview
All datasets in this folder are **authentic spaceborne observations** downloaded directly from the **NASA Planetary Data System (PDS) Geosciences Node** (`LRO-L-MRFLRO-5-GLOBAL-MOSAIC-V1.0`).

The target area is **Shackleton Crater** at the Lunar South Pole (**89.9°S, 0.0°E**), co-registered on a 512×512 polar grid.

---

## Directory Structure
```
dataset/
├── radar/
│   ├── dfsar_cpr_shackleton.npy      # Real NASA Mini-RF / DFSAR CPR array (512x512)
│   ├── dfsar_cpr_shackleton.png      # Real Radar CPR visual preview
│   └── metadata.json                 # PDS Product ID & polarimetry metadata
├── optical/
│   ├── lroc_optical_shackleton.npy   # Real NASA LROC S1 backscatter / optical albedo
│   ├── lroc_optical_shackleton.png   # Optical imagery preview
│   └── metadata.json                 # PDS Product ID & albedo metadata
├── dem/
│   ├── lola_dem_shackleton.npy       # Real NASA LOLA DEM topographic elevation (meters)
│   ├── lola_dem_shackleton.png       # Topographic elevation preview
│   └── metadata.json                 # PDS Product ID & elevation range (-3200m to +500m)
├── shadow/
│   ├── psr_shadow_shackleton.npy     # Permanent Shadow Region (PSR) binary mask
│   ├── psr_shadow_shackleton.png     # PSR visual preview
│   └── metadata.json                 # PSR percentage & thermal trap metadata
├── dataset_manifest.json             # Master index manifest for all 4 real modalities
└── lunar_dataset_overview.png        # 4-panel visual comparison plot of real PDS data
```

---

## Data Source & Physical Parameters

| Modality | Sensor / Spacecraft | PDS Product ID | Variable | Physical Meaning / Ice Indicator |
| :--- | :--- | :--- | :--- | :--- |
| **Radar** | LRO Mini-RF / Chandrayaan-2 DFSAR | `GLOBAL_CPR_128PPD_SIMP_0C.IMG` | Circular Polarization Ratio (CPR) | **CPR > 1.0** inside PSR indicates subsurface volume scattering from water ice |
| **Optical** | LRO LROC / Mini-RF S1 | `GLOBAL_S1_128PPD_SIMP_0C.IMG` | Optical Reflectance / Backscatter | Low albedo under low-grazing solar illumination |
| **DEM** | LRO LOLA Altimeter | `GLOBAL_M_128PPD_SIMP_0C.IMG` | Elevation (Meters) | Topographic bowl elevation relative to 1737.4 km lunar sphere |
| **Shadow** | LRO Diviner & LOLA | Derived PSR Mask | Permanent Shadow Mask | **PSR = 1** required for thermal stability (<110 Kelvin) |

---

## Verification & Usage

### Re-Download Real NASA Data
To refresh or re-download the real dataset slices directly from NASA PDS:
```bash
python scripts/download_real_lunar_fast.py
```

### Validate & Load Feature Tensor
```python
from backend.preprocessing.dataset_loader import LunarDatasetLoader

loader = LunarDatasetLoader()
features, metadata = loader.get_stacked_features(normalize=True)

print("Stacked Feature Matrix Shape:", features.shape) 
# Output: (512, 512, 4) -> [Radar CPR, Optical Albedo, DEM Elevation, PSR Mask]
```
