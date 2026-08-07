# HImDristi: Lunar Water Ice AI Detection and Autonomous Traversal Platform

## Abstract

HImDristi is an advanced multi-modal artificial intelligence and 3D mission control platform engineered for the identification, quantification, and spatial mapping of permanently shadowed water ice deposits at the Lunar South Pole. 

By integrating multi-sensor lunar remote sensing datasets—specifically NASA Lunar Reconnaissance Orbiter Camera (LROC) Optical Albedo, ISRO Chandrayaan-2 Dual Frequency Synthetic Aperture Radar (DFSAR) Circular Polarization Ratio (CPR), NASA Lunar Orbiter Laser Altimeter (LOLA) Digital Elevation Models (DEM), and Permanently Shadowed Region (PSR) Thermal Boundary Maps—HImDristi employs a deep semantic segmentation architecture (`LunarIceUNet`) with physics-informed multi-channel fusion to evaluate ice presence, delineate safe landing sites, and compute optimal autonomous rover traversal paths.

---

## Technical Overview

### Multi-Modal Data Ingestion

The platform ingests and fuses four distinct spatial data channels at a resolution of up to 0.5 meters per pixel:

1. **Optical Reflectance (NASA LROC NAC)**: High-resolution surface albedo imagery capturing surface texture, regolith composition, and fine micro-impact morphology.
2. **Radar Backscatter (ISRO DFSAR CPR)**: S-band and L-band Dual Frequency Synthetic Aperture Radar measuring the Circular Polarization Ratio (CPR). High CPR values indicate surface and subsurface volumetric ice scattering.
3. **Topographic Elevation (NASA LOLA DEM)**: Digital Elevation Models providing absolute surface relief, slope gradients, and macro-topographic basin geometries relative to the 1737.4 km lunar sphere datum.
4. **Thermal Shadow Maps (PSR)**: Binary thermal constraint masks identifying permanently shadowed cold traps maintaining surface temperatures strictly below 100 Kelvin over multi-year diurnal cycles.

### Physics-Informed Surface Constraints

To eliminate false positive detections caused by blocky impact ejecta, candidate ice deposits are subjected to three non-linear physical validation constraints:

1. **Radar Volumetric Scattering**:
   $$\text{CPR} = \frac{\sigma^\circ_{\text{same}}}{\sigma^\circ_{\text{opp}}} > 1.2$$
2. **Thermal Cold Trap Stability**:
   $$T_{\text{max}} < 110\text{ K}$$
3. **Rover Traversal Slope Boundary**:
   $$\theta = \arctan\left(\sqrt{\left(\frac{\partial z}{\partial x}\right)^2 + \left(\frac{\partial z}{\partial y}\right)^2}\right) < 15^\circ$$

---

## System Architecture

```
HImDristi/
├── backend/
│   ├── ai/
│   │   ├── unet_fusion_model.py     # PyTorch LunarIceUNet neural network definition
│   │   └── ice_detector.py          # Model inference and connected component analysis
│   ├── preprocessing/
│   │   └── preprocess_pipeline.py   # Multi-modal noise removal, CLAHE, and normalization
│   ├── services/
│   │   ├── path_planner.py          # A* heuristic grid pathfinding algorithm
│   │   └── report_generator.py      # Automated PDF assessment and CSV report generator
│   └── app.py                       # RESTful Flask application entry point
├── frontend/
│   ├── public/
│   │   └── datasets/                # Static lunar dataset assets
│   ├── src/
│   │   ├── assets/                  # Preprocessed satellite imagery modules
│   │   ├── components/              # 3D Moon Viewer, GPS Map, Telemetry Dashboard
│   │   ├── pages/                   # LandingPage, HomePage, LoginPage
│   │   └── config.js                # API base endpoint configuration
│   └── vite.config.js
├── dataset/                         # Raw and preprocessed dataset tensors (.npy, .png)
├── models/                          # PyTorch model weights (.pth) & benchmark metrics
├── Procfile                         # Gunicorn web deployment definition
└── render.yaml                      # Render cloud infrastructure specification
```

---

## Pipeline Stages

### Stage 1: Data Acquisition and Sensor Ingestion
Multi-source satellite channels are loaded and aligned into a unified 4-channel spatial tensor of shape `(512, 512, 4)`.

### Stage 2: Radiometric and Spatial Preprocessing
- **Radar**: Bilateral filtering combined with 3x3 median noise reduction to suppress multiplicative SAR speckle.
- **Optical**: Contrast Limited Adaptive Histogram Equalization (CLAHE) with a clip limit of 3.0 over an 8x8 tile grid.
- **DEM**: Min-Max scaling to range `[0.0, 1.0]` relative to local min/max elevation bounds.
- **Shadow**: Binary thresholding and morphological closing using an elliptical structuring element.

### Stage 3: Feature Extraction and Fusion
- Computation of local slope gradients, aspect angles, and surface roughness indices.
- Tensor concatenation feeding into the `LunarIceUNet` encoder backbone.

### Stage 4: AI Semantic Segmentation and Decision Analysis
- Pixel-level inference generating an ice probability heatmap.
- Extraction of connected deposit clusters, deposit volume ($m^3$), total ice mass (metric tonnes), and candidate landing sites.

### Stage 5: Autonomous Traversal Path Planning
- Implementation of the A* pathfinding algorithm on terrain cost maps derived from slope gradients and surface obstacle penalties.
- Generation of tactical waypoints and total path length metrics.

---

## Evaluated Lunar South Pole Target Craters

| Target Name | Latitude | Longitude | Diameter | Floor Depth | Geomorphological Characteristics |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Shackleton Crater** | -89.9°S | 0.0°E | 21.0 km | 4.2 km | Circular impact bowl with steep interior walls (>25°) and deep PSR floor. |
| **Haworth Crater** | -87.5°S | -5.0°E | 35.0 km | 3.8 km | Polygonal terraced crater walls with an offset central peak ridge structure. |
| **Shoemaker Crater** | -88.1°S | 45.0°E | 50.0 km | 4.5 km | Broad impact basin featuring secondary micro-impact chains on crater floor. |
| **Faustini Crater** | -87.3°S | 87.0°E | 39.0 km | 3.4 km | Highland crater structure with overlapping eastern impact rim boundaries. |
| **Cabeus Crater** | -84.9°S | -35.5°E | 100.0 km | 4.0 km | Massive broad flat-bottomed basin (NASA LCROSS impact confirmation site). |

---

## Quantitative Model Benchmarks

Evaluation metrics computed across 1,000 synthetic and validated lunar polar test tiles:

| Benchmark Metric | Quantitative Score | Standard Deviation |
| :--- | :---: | :---: |
| **Pixel Accuracy** | **98.4%** | ± 0.4% |
| **Precision** | **94.8%** | ± 0.6% |
| **Recall** | **92.6%** | ± 0.8% |
| **F1-Score** | **93.7%** | ± 0.5% |
| **IoU (Intersection over Union)** | **88.2%** | ± 0.9% |

---

## Local Installation and Setup

### Prerequisites
- Python 3.9, 3.10, or 3.11
- Node.js 18+ and `npm`

### 1. Repository Clone
```bash
git clone https://github.com/Somya183/HIM_DRISTI.git
cd HIM_DRISTI
```

### 2. Backend Environment Setup
```bash
# Install required Python packages
pip install -r requirements.txt

# Launch Flask API Server
python backend/app.py
```
The API server listens on `http://127.0.0.1:5000`.

### 3. Frontend Environment Setup
```bash
# Open a new terminal window in project root
cd frontend

# Install Node dependencies
npm install

# Start Vite Development Server
npm run dev
```
The web application will open at `http://localhost:5173`.

---

## Cloud Production Deployment

HImDristi is configured for single-service cloud deployment on Render, Heroku, or Railway.

### Build Command
```bash
npm install --legacy-peer-deps && cd frontend && npm install --legacy-peer-deps && npm run build && cd .. && pip install -r requirements.txt
```

### Start Command
```bash
python backend/app.py
```

---

## License

This project is open-source software licensed under the **MIT License**.
