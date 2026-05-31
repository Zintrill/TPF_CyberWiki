import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./NotFoundPage.css";

export default function NotFoundPage() {
  return (
    <div className="page-wrapper">
      <title>404 - Not Found</title>
      <Navbar />
      <main className="nf-main">
        <div className="nf-code">404</div>
        <h1 className="nf-title">Access Denied</h1>
        <p className="nf-subtitle">The resource you requested does not exist in our knowledge base.</p>
        <Link to="/" className="nf-btn">← Return to Central Command</Link>
      </main>
      <Footer />
    </div>
  );
}
