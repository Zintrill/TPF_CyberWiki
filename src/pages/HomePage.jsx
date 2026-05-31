import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./HomePage.css";

const osintTools = ["Maltego", "Shodan", "SpiderFoot", "Recon-ng"];

export default function HomePage() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/offense?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="page-wrapper">
      <title>Home Page</title>
      <Navbar />
      <main className="home-main">
        <section className="home-hero">
          <h1 className="hero-title">Central Command</h1>
          <p className="hero-subtitle">Secure knowledge base for cybersecurity terminology, tools, and tactics.</p>
          <form className="hero-search" onSubmit={handleSearch}>
            <span className="hs-icon">🔍</span>
            <input
              type="text"
              placeholder="Search terminology (e.g., Ransomware, SOC)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <span className="hs-shortcut">⌘ K</span>
          </form>
        </section>

        <section className="home-cards">
          <Link to="/offense" className="home-category-card offense-card">
            <div className="card-header">
              <span className="card-icon">⚔</span>
              <span className="card-arrow">→</span>
            </div>
            <h2 className="card-title offense-title">Offense (Attacks)</h2>
            <p className="card-desc">Explore attack vectors, exploit frameworks, and red team methodologies.</p>
            <div className="card-tags">
              <span className="chip">#redteam</span>
              <span className="chip">#exploits</span>
            </div>
          </Link>

          <Link to="/defense" className="home-category-card defense-card">
            <div className="card-header">
              <span className="card-icon">🛡</span>
              <span className="card-arrow">→</span>
            </div>
            <h2 className="card-title defense-title">Defense (Protection)</h2>
            <p className="card-desc">Access incident response playbooks, SOC guidelines, and blue team tactics.</p>
            <div className="card-tags">
              <span className="chip">#blueteam</span>
              <span className="chip">#soc</span>
            </div>
          </Link>
        </section>

        <section className="home-bottom">
          <div className="term-of-day">
            <div className="tod-label">
              <span className="star-icon">★</span>
              TERMINOLOGY OF THE DAY
            </div>
            <h2 className="tod-title">Zero-Day Vulnerability</h2>
            <p className="tod-body">
              A software vulnerability that is discovered by attackers before the vendor has become aware of it.
              Because the developers have had "zero days" to fix the exploits pose a severe and immediate threat to systems.
            </p>
            <Link to="/article/zero-day" className="tod-btn">Read More →</Link>
          </div>

          <div className="osint-trending">
            <div className="osint-label">
              <span className="osint-icon">📡</span>
              TRENDING OSINT
            </div>
            <ul className="osint-list">
              {osintTools.map((tool) => (
                <li key={tool} className="osint-item">
                  <span>{tool}</span>
                  <span className="osint-ext">↗</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
