import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";
import "./AdminPage.css";

const stats = [
  { label: "GLOBAL TRAFFIC", value: "1.2M", change: "+14.2%", icon: "📈" },
  { label: "THREATS BLOCKED", value: "4,092", badge: "Crit", icon: "🛡" },
  { label: "CONTRIBUTORS", value: "184", badge: "New", icon: "👥" },
  { label: "API LATENCY", value: "24ms", badge: "Optimal", icon: "⚡" },
];

const pendingComments = [
  {
    id: 1,
    user: "konopcia",
    initials: "A",
    time: "2 mins ago",
    tag: "Advanced Persistent Threats",
    tagColor: "orange",
    text: "\"The section on lateral movement via Kerberos is slightly outdated. Windows 11 23H2 introduced new credential guard features that mitigate this...\"",
  },
  {
    id: 2,
    user: "oskiś",
    initials: "S",
    time: "15 mins ago",
    tag: "Zero Trust Architecture",
    tagColor: "blue",
    text: "\"Great overview, but could we add more documentation on the NIST 800-207 standards? Specifically for federal deployment models.\"",
  },
];

const operators = [
  { name: "alice_sec", role: "Admin" },
  { name: "bob_analyst", role: "Editor" },
  { name: "charlie_v", role: "Viewer" },
];

const navItems = ["Overview", "Analytics", "Moderation Panel", "Content Management", "User Management"];

export default function AdminPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("Overview");

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="admin-page">
      <title>Admin Page</title>
      <nav className="admin-topnav">
        <Link to="/" className="navbar-brand">
          <span className="brand-cyber">Cyber</span>
          <span className="brand-wiki">Wiki</span>
        </Link>
        <div className="admin-nav-links">
          <Link to="/offense">Offense</Link>
          <Link to="/defense">Defense</Link>
          <Link to="/tools">Tools</Link>
        </div>
        <div className="admin-topnav-search">
          <span>🔍</span>
          <input type="text" placeholder="Scan protocols..." />
        </div>
        <div className="admin-topnav-right">
          <button className="nav-link-btn" onClick={handleLogout}>Login</button>
          <button className="nav-btn-register">Register</button>
        </div>
      </nav>

      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="sidebar-label">SYSTEM CONSOLE</div>
          <ul className="sidebar-nav">
            {navItems.map((item) => (
              <li key={item}>
                <button
                  className={`sidebar-nav-item ${activeNav === item ? "active" : ""}`}
                  onClick={() => setActiveNav(item)}
                >
                  <span className="sidebar-nav-icon">
                    {item === "Overview" && "⊞"}
                    {item === "Analytics" && "📊"}
                    {item === "Moderation Panel" && "🔔"}
                    {item === "Content Management" && "📄"}
                    {item === "User Management" && "👤"}
                  </span>
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="admin-main">
          <div className="admin-header">
            <div>
              <h1 className="admin-title">Command Center Overview</h1>
              <p className="admin-subtitle">
                Real-time surveillance of the CyberWiki ecosystem. Monitor traffic, moderate threats, and manage user permissions from a single interface.
              </p>
            </div>
            <div className="live-badge">
              <span className="live-dot" />
              LIVE SYSTEM ACTIVE
            </div>
          </div>

          <div className="stats-grid">
            {stats.map((s) => (
              <div key={s.label} className="stat-card">
                <div className="stat-label">{s.label}</div>
                <div className="stat-row">
                  <span className="stat-value">{s.value}</span>
                  {s.change && <span className="stat-change">{s.change}</span>}
                  {s.badge && <span className="stat-badge">{s.badge}</span>}
                </div>
              </div>
            ))}
          </div>

          <div className="admin-bottom">
            <div className="moderation-panel">
              <div className="panel-header">
                <span className="panel-icon">🔔</span>
                <span className="panel-title">Pending Moderation</span>
                <span className="pending-badge">8 Pending</span>
              </div>
              <div className="comments-list">
                {pendingComments.map((c) => (
                  <div key={c.id} className="comment-item">
                    <div className={`comment-avatar avatar-${c.tagColor}`}>{c.initials}</div>
                    <div className="comment-body">
                      <div className="comment-meta">
                        <span className="comment-user">{c.user}</span>
                        <span className="comment-time">{c.time}</span>
                        <span className={`comment-tag tag-${c.tagColor}`}>{c.tag}</span>
                      </div>
                      <p className="comment-text">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="view-all-btn">View All Comments</button>
            </div>

            <div className="access-panel">
              <div className="panel-header">
                <span className="panel-icon">🔑</span>
                <span className="panel-title">Access Control</span>
              </div>
              <div className="access-table">
                <div className="access-row access-row-header">
                  <span>Operator</span>
                  <span>Privilege</span>
                  <span>Action</span>
                </div>
                {operators.map((op) => (
                  <div key={op.name} className="access-row">
                    <div className="access-user">
                      <span className="user-avatar-sm">
                        {op.role === "Admin" ? "👤" : op.role === "Editor" ? "✏" : "👁"}
                      </span>
                      <span className="access-name">{op.name}</span>
                    </div>
                    <span className={`role-badge role-${op.role.toLowerCase()}`}>{op.role}</span>
                    <button className="settings-btn">⚙</button>
                  </div>
                ))}
              </div>
              <button className="grant-btn">Grant New Access</button>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
