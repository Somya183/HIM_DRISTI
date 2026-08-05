export default function MoonViewer() {
  return (
    <div className="moon-viewer">
      <div className="moon-orbit" />
      <div className="moon-surface">
        <div className="moon-core" />
        <div className="moon-hotspot hotspot-a" />
        <div className="moon-hotspot hotspot-b" />
        <div className="moon-hotspot hotspot-c" />
      </div>
      <div className="viewer-caption">Surface model with highlighted ice-retention zones</div>
    </div>
  );
}