import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";
import Button from "../components/Button";
import "./LoginPage.css";

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get("tab") === "register" ? "register" : "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (tab === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate("/");
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      navigate("/");
    } catch (err) {
      setError(friendlyError(err.code));
    }
  };

  const handleGithub = async () => {
    setError("");
    try {
      await signInWithPopup(auth, new GithubAuthProvider());
      navigate("/");
    } catch (err) {
      setError(friendlyError(err.code));
    }
  };

  return (
    <div className="login-page">
      <title>Login Page</title>
      <nav className="login-nav">
        <Link to="/" className="navbar-brand">
          <span className="brand-cyber">Cyber</span>
          <span className="brand-wiki">Wiki</span>
        </Link>
        <div className="login-nav-links">
          <Link to="/offense" className="nav-link-plain">Offense</Link>
          <Link to="/defense" className="nav-link-plain">Defense</Link>
          <Link to="/tools" className="nav-link-plain">Tools</Link>
        </div>
        <div className="login-nav-right">
          <Link to="/login" className="nav-link-plain active">Login</Link>
          <Link to="/login?tab=register" className="nav-btn-outline-sm">Register</Link>
        </div>
      </nav>

      <main className="login-main">
        <div className="login-card">
          <div className="login-tabs">
            <button
              className={`login-tab ${tab === "login" ? "active" : ""}`}
              onClick={() => setTab("login")}
            >
              Login
            </button>
            <button
              className={`login-tab ${tab === "register" ? "active" : ""}`}
              onClick={() => setTab("register")}
            >
              Register
            </button>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">OPERATOR ID</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  type="email"
                  placeholder="username_or_email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <div className="form-label-row">
                <label className="form-label">ACCESS KEY</label>
                {tab === "login" && <button type="button" className="forgot-link">Forgot?</button>}
              </div>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
            </div>

            {tab === "login" && (
              <label className="remember-row">
                <input type="checkbox" className="remember-check" />
                <span>Remember this device</span>
              </label>
            )}

            {error && <div className="form-error">{error}</div>}

            <Button type="submit" fullWidth disabled={loading}>
              {loading ? "Processing..." : tab === "login" ? "Initialize Session" : "Create Account"}
            </Button>
          </form>

          <div className="divider">
            <span>OR AUTHORIZE WITH</span>
          </div>

          <div className="social-btns">
            <button className="social-btn" onClick={handleGoogle}>GOOGLE</button>
            <button className="social-btn" onClick={handleGithub}>GITHUB</button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function friendlyError(code) {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
      return "Invalid credentials. Please try again.";
    case "auth/user-not-found":
      return "No account found with this email.";
    case "auth/email-already-in-use":
      return "An account already exists with this email.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/popup-closed-by-user":
      return "Sign-in popup was closed.";
    default:
      return "Authentication failed. Please try again.";
  }
}
