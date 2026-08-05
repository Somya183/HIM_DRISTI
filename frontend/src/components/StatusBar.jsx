function StatusBar({ status, message }) {
  return (
    <footer className="status-bar">
      <span className="status-pill">{status}</span>
      <p>{message}</p>
    </footer>
  );
}

export default StatusBar;