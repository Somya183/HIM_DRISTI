function MoonScene() {
  return (
    <section style={{ padding: '1rem', background: '#1f2937', borderRadius: '12px', color: 'white' }}>
      <h3>Moon Observation Scene</h3>
      <div style={{ height: '180px', borderRadius: '12px', background: 'linear-gradient(135deg, #334155, #020617)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: '#f8fafc', boxShadow: '0 0 30px rgba(255,255,255,0.4)' }}></div>
      </div>
    </section>
  );
}

export default MoonScene;
