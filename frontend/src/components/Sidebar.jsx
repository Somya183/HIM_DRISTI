function Sidebar() {
  const items = [
    { label: "Mission Overview", icon: "◉" },
    { label: "Ice Detection", icon: "❄" },
    { label: "Landing Site", icon: "🛰" },
    { label: "Rover Path", icon: "🚜" },
    { label: "Analytics", icon: "📈" },
  ];

  return (
    <aside className="sidebar">
      {items.map((item, index) => (
        <button key={item.label} className={index === 1 ? "active" : ""}>
          <span>{item.icon}</span>
          {item.label}
        </button>
      ))}
    </aside>
  );
}

export default Sidebar;