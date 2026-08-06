function Sidebar() {
  const items = [
    { label: "Mission Overview" },
    { label: "Ice Detection" },
    { label: "Landing Site" },
    { label: "Rover Path" },
    { label: "Analytics" },
  ];

  return (
    <aside className="sidebar">
      {items.map((item, index) => (
        <button key={item.label} className={index === 1 ? "active" : ""}>
          {item.label}
        </button>
      ))}
    </aside>
  );
}

export default Sidebar;