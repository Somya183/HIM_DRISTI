#  HimDristi Lunar Water Ice AI Detection & Traversal Platform

> 
##  Overview

**HImDristi** is an end-to-end AI mission control platform designed to identify, quantify, and map permanently shadowed water ice deposits at the Lunar South Pole (Shackleton, Haworth, and Shoemaker craters). 

By combining multi-modal satellite remote sensing datasets—including **LROC Optical Albedo**, **DFSAR Circular Polarization Ratio (CPR) Radar**, **LOLA Elevation (DEM)**, and **PSR Shadow Maps**—HImDristi utilizes a custom **PyTorch UNet Fusion Model** to predict subsurface ice presence and compute optimal, safe autonomous rover traversal routes.

---

##  Key Features

-  Multi-Modal PyTorch UNet Model**: Sensor fusion model trained on multi-spectral lunar polar data delivering pixel-level ice probability maps ($93.7\%$ F1 Score, $88.2\%$ IoU).
-  Sensor Preprocessing Pipeline**: Real-time interactive controls for speckle noise reduction, CLAHE contrast enhancement, and PSR binary shadow masking.
-  3D Interactive Lunar Globe**: Real-time 3D rendered lunar surface with interactive crater pins, sun lighting angles, and landing site targeting.
- Sub-Metric 2D Tactical Lunar GPS**: Tactical map with layer switching (Satellite, Topography DEM, SAR Radar, Hybrid Slope), waypoint navigation, and ice deposit inventory.
-  Executive Telemetry & Confusion Matrix**: Real-time KPI cards tracking estimated ice mass (million tonnes), peak confidence, slope safety, and confusion matrix metrics.
-  One-Click Mission Exports**: Instant PDF Mission Assessment Reports, GeoJSON Rover Traversal Routes, and CSV Telemetry Data.

---

## Architecture & Stack

```
HImDristi/
├── backend/                  # Python Flask API & PyTorch AI Engine
│   ├── ai/                   # UNet Fusion model architecture & training
│   ├── preprocessing/        # Multi-modal dataset normalization & CLAHE
│   ├── services/             # Rover path planning & report generators
│   └── app.py                # REST API Server (Port 5000)
├── frontend/                 # Vite + React Space HUD Mission Control UI
│   ├── src/
│   │   ├── components/       # 3D Viewer, Lunar GPS Map, Preprocessing, Telemetry
│   │   ├── styles/           # Cyberpunk & Glassmorphic Space Tokens
│   │   └── App.jsx           # Mission Control Sequential Dashboard
│   └── vite.config.js
├── dataset/                  # Lunar Polar Multi-Modal Dataset Tensors
└── models/                   # PyTorch Model Weights (.pth) & Evaluation Metrics
```

| Component | Technology |
| :--- | :--- |
| **Frontend Framework** | React 18, Vite |
| **3D Rendering** | Three.js / Canvas 3D |
| **UI Design System** | Custom Vanilla CSS Glassmorphism + Lucide Icons |
| **AI / Machine Learning** | PyTorch, UNet Architecture, NumPy, OpenCV |
| **Backend API** | Python 3, Flask, SciPy, ReportLab |

---

##  Quick Start

### 1. Prerequisites
- **Python 3.9+**
- **Node.js 18+** & `npm`

### 2. Backend Setup
```bash
# Navigate to backend directory and install dependencies
cd backend
pip install -r requirements.txt   # or torch flask opencv-python numpy reportlab

# Start the Flask API Server
python app.py
```
*Backend runs at `http://127.0.0.1:5000`*

### 3. Frontend Setup
```bash
# Open a new terminal in project root
cd frontend

# Install packages
npm install

# Start Vite Dev Server
npm run dev
```
*Frontend runs at `http://localhost:5173`*

---

##  AI Model Benchmarks

| Metric | Benchmark Score |
| :--- | :--- |
| **Model Architecture** | Multi-Modal UNet Fusion |
| **F1-Score** | **93.7%** |
| **IoU (Intersection over Union)** | **88.2%** |
| **Precision** | **94.8%** |
| **Recall** | **92.6%** |

---

##  License

Distributed under the **MIT License**. See `LICENSE` for more information.
