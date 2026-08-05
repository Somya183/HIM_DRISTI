import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MoonViewer from "../components/MoonViewer";
import RightPanel from "../components/RightPanel";
import StatusBar from "../components/StatusBar";

const datasetFields = [
  { key: "optical", label: "Optical image", description: "Visible imagery for crater and terrain inspection" },
  { key: "radar", label: "Radar image (SAR)", description: "Subsurface structure and roughness analysis" },
  { key: "dem", label: "DEM terrain map", description: "Topography and slope classification" },
  { key: "shadow", label: "Shadow map", description: "Shadow persistence and cold trap identification" },
];

export default function Dashboard() {
  const [files, setFiles] = useState({
    optical: "LRO_Optical_01.tif",
    radar: "SAR_Polar_02.tif",
    dem: "DEM_Shackleton_03.tif",
    shadow: "Shadow_Map_04.png",
  });
  const [status, setStatus] = useState("READY");
  const [message, setMessage] = useState("Mission systems online and awaiting lunar dataset ingest.");
  const [results, setResults] = useState({
    iceProbability: 87,
    estimatedArea: "4.8 km²",
    confidenceScore: 91,
    landingScore: "9.2/10",
  });

  const handleFileChange = (key, event) => {
    const file = event.target.files?.[0];
    if (file) {
      setFiles((prev) => ({ ...prev, [key]: file.name }));
      setStatus("DATA INGESTED");
      setMessage(`${file.name} has been queued for analysis.`);
    }
  };

  const handleAnalyze = () => {
    setStatus("PROCESSING");
    setMessage("Preprocessing, feature extraction, and ice probability estimation are running.");

    window.setTimeout(() => {
      setResults({
        iceProbability: 93,
        estimatedArea: "6.1 km²",
        confidenceScore: 95,
        landingScore: "9.6/10",
      });
      setStatus("ANALYSIS COMPLETE");
      setMessage("The model identified a high-confidence ice-retention corridor near the crater rim.");
    }, 1400);
  };

  return (
    <div className="app-shell">
      <Navbar />

      <div className="workspace-grid">
        <Sidebar />

        <main className="main-panel">
          <section className="hero-card">
            <div>
              <p className="eyebrow">MISSION CONTROL</p>
              <h2>Advanced lunar ice assessment platform</h2>
              <p>
                Upload optical, radar, DEM, and shadow datasets to generate a heatmap, a 3D moon surface view,
                and a confidence-based landing recommendation.
              </p>
            </div>
            <div className="hero-actions">
              <button className="primary-btn" onClick={handleAnalyze}>Run Analysis</button>
              <button className="secondary-btn">Export Report</button>
            </div>
          </section>

          <section className="upload-card">
            <div className="section-heading">
              <div>
                <p className="eyebrow">DATA INTAKE</p>
                <h3>Upload lunar datasets</h3>
              </div>
            </div>
            <div className="upload-grid">
              {datasetFields.map((field) => (
                <label key={field.key} className="upload-item">
                  <div>
                    <strong>{field.label}</strong>
                    <p>{field.description}</p>
                  </div>
                  <span>{files[field.key]}</span>
                  <input type="file" onChange={(event) => handleFileChange(field.key, event)} />
                </label>
              ))}
            </div>
          </section>

          <section className="pipeline-grid">
            <div className="panel-card">
              <p className="eyebrow">AI PIPELINE</p>
              <h3>Processing workflow</h3>
              <div className="pipeline-steps">
                <div>Preprocess images</div>
                <div>Extract features</div>
                <div>Predict ice probability</div>
              </div>
            </div>

            <div className="panel-card stats-card">
              <p className="eyebrow">LIVE METRICS</p>
              <div className="metric-stack">
                <div>
                  <span>Ice Probability</span>
                  <strong>{results.iceProbability}%</strong>
                </div>
                <div>
                  <span>Confidence Score</span>
                  <strong>{results.confidenceScore}%</strong>
                </div>
                <div>
                  <span>Estimated Area</span>
                  <strong>{results.estimatedArea}</strong>
                </div>
              </div>
            </div>
          </section>

          <section className="results-grid">
            <div className="panel-card visual-card">
              <MoonViewer />
            </div>

            <div className="panel-card output-card">
              <p className="eyebrow">ON-BOARD OUTPUT</p>
              <h3>Heatmap and site recommendation</h3>
              <div className="heatmap">
                <div className="heatmap-core" />
              </div>
              <div className="legend">
                <span><i className="low" /> Lower confidence</span>
                <span><i className="high" /> High confidence</span>
              </div>
            </div>
          </section>
        </main>

        <RightPanel {...results} />
      </div>

      <StatusBar status={status} message={message} />
    </div>
  );
}