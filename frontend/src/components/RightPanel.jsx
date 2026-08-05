export default function RightPanel({ confidenceScore, estimatedArea, iceProbability, landingScore }) {
  return (
    <aside className="right-panel">
      <div className="panel-card">
        <p className="eyebrow">MISSION OUTPUT</p>
        <h3>AI Analysis</h3>
        <div className="metric-row">
          <span>Ice Probability</span>
          <strong>{iceProbability}%</strong>
        </div>
        <div className="metric-row">
          <span>Estimated Ice Area</span>
          <strong>{estimatedArea}</strong>
        </div>
        <div className="metric-row">
          <span>Confidence</span>
          <strong>{confidenceScore}%</strong>
        </div>
        <div className="metric-row">
          <span>Landing Score</span>
          <strong>{landingScore}</strong>
        </div>
      </div>

      <div className="panel-card accent">
        <p className="eyebrow">RECOMMENDED SITE</p>
        <h3>Shackleton Rim</h3>
        <p>High-probability ice retention zone with favorable shadow stability.</p>
      </div>
    </aside>
  );
}