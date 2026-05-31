import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-left">
        <span className="footer-brand">
          <span className="brand-cyber">Cyber</span>
          <span className="brand-wiki">Wiki</span>
        </span>
        <span className="footer-copy">© 2026 &nbsp; Secure Command Center.</span>
      </div>
      <div className="footer-links">
        <Link to="/tools" className="footer-link">Technical Resources</Link>
        <Link to="/tools" className="footer-link">OSINT Tools</Link>
        <Link to="/" className="footer-link">API</Link>
        <Link to="/" className="footer-link">Privacy Policy</Link>
      </div>
    </footer>
  );
}
