import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  const isArticlePage = location.pathname.startsWith("/article");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/offense?q=${encodeURIComponent(searchVal.trim())}`);
      setSearchVal("");
      setSearchOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">
          <span className="brand-cyber">Cyber</span>
          <span className="brand-wiki">Wiki</span>
        </Link>
        <div className="navbar-links">
          <Link to="/offense" className={`nav-link ${location.pathname === "/offense" ? "active" : ""}`}>Offense</Link>
          <Link to="/defense" className={`nav-link ${location.pathname === "/defense" ? "active" : ""}`}>Defense</Link>
          <Link to="/tools" className={`nav-link ${location.pathname === "/tools" ? "active" : ""}`}>Tools</Link>
        </div>
      </div>

      <div className="navbar-right">
        {isArticlePage && (
          <form className="navbar-search" onSubmit={handleSearch}>
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search knowledge base..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
            />
          </form>
        )}
        {user ? (
          <>
            {user.email?.includes("admin") && (
              <Link to="/admin" className="nav-btn nav-btn-outline">Admin</Link>
            )}
            <button className="nav-btn nav-btn-outline" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/login?tab=register" className="nav-btn nav-btn-primary">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
