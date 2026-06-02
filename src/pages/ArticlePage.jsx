import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Comments from "../components/Comments";
import { articles } from "../data/articles";
import { toast } from "../components/Toast";
import { useAuth } from "../context/AuthContext";
import "./ArticlePage.css";

export default function ArticlePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const article = articles.find((a) => a.slug === slug);
  const [bookmarked, setBookmarked] = useState(false);

  const toggleBookmark = () => {
    if (!user) { toast("Zaloguj się aby zapisać artykuł", "warn"); return; }
    setBookmarked(b => {
      const next = !b;
      toast(next ? "Artykuł zapisany ★" : "Usunięto z zapisanych", next ? "success" : "info");
      return next;
    });
  };

  if (!article) {
    return (
      <div className="page-wrapper">
        <Navbar />
        <main className="not-found-main">
          <h1>Article not found</h1>
          <button onClick={() => navigate(-1)} className="back-btn">← Go back</button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <title>Article Page</title>
      <Navbar />
      <main className="article-main">
        <div className="article-content">
          <div className="article-header">
            <div className="article-tags">
              {article.tags.map((tag) => (
                <span key={tag} className={`tag tag-${tag.toLowerCase().replace(/[\s()]+/g, "-")}`}>{tag}</span>
              ))}
              <button
                className={`bookmark-btn ${bookmarked ? "active" : ""}`}
                title={bookmarked ? "Usuń z zapisanych" : "Zapisz artykuł"}
                onClick={toggleBookmark}
              >
                {bookmarked ? "★" : "☆"}
              </button>
            </div>
            <h1 className="article-title">{article.title}</h1>
            <div className="article-meta">
              Last updated: {article.lastUpdated} • Contributor: <span className="contributor">{article.contributor}</span>
            </div>
            <p className="article-summary">{article.summary}</p>
            {article.body && <p className="article-body">{article.body}</p>}
          </div>

          {article.practicalExample && (
            <div className="practical-example">
              <h2 className="section-title">
                <span className="section-icon">🖥</span> Practical Example
              </h2>
              <p className="example-desc">{article.practicalExample.description}</p>
              <div className="code-block">
                <span className="code-accent" />
                <code>{article.practicalExample.codeVulnerable}</code>
              </div>
              <p className="example-desc">{article.practicalExample.explanation}</p>
              <div className="code-block code-exploited">
                <span className="code-accent" />
                <code>{article.practicalExample.codeExploited}</code>
              </div>
              <p className="example-desc">{article.practicalExample.result}</p>
            </div>
          )}

          <Comments articleSlug={article.slug} />
        </div>

        <aside className="article-sidebar">
          {article.relatedVectors?.length > 0 && (
            <div className="sidebar-card">
              <h3 className="sidebar-title"><span>🔗</span> Related Vectors</h3>
              <ul className="sidebar-list">
                {article.relatedVectors.map((v) => {
                  const related = articles.find((a) => a.title === v);
                  return (
                    <li key={v} className="sidebar-item">
                      {related ? (
                        <Link to={`/article/${related.slug}`} className="sidebar-link">
                          {v} <span>→</span>
                        </Link>
                      ) : (
                        <span className="sidebar-link sidebar-link-plain">{v} <span>→</span></span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {article.analysisTools?.length > 0 && (
            <div className="sidebar-card">
              <h3 className="sidebar-title"><span>🔧</span> Analysis Tools</h3>
              <ul className="sidebar-tools">
                {article.analysisTools.map((tool) => (
                  <li key={tool.name} className="tool-item">
                    <div className="tool-icon">⚙</div>
                    <div>
                      <div className="tool-name">{tool.name}</div>
                      <div className="tool-desc">{tool.description}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="sidebar-card">
            <h3 className="sidebar-title"><span>⚡</span> Quick Actions</h3>
            <div className="quick-actions">
              <button className="qa-btn" onClick={() => { navigator.clipboard?.writeText(window.location.href); toast("Link skopiowany!", "success"); }}>
                🔗 Kopiuj link
              </button>
              <button className="qa-btn" onClick={() => { window.print(); }}>
                🖨 Drukuj artykuł
              </button>
              <button className="qa-btn" onClick={() => { toast("Zgłoszenie wysłane. Dziękujemy!", "success"); }}>
                ⚠ Zgłoś błąd
              </button>
            </div>
          </div>
        </aside>
      </main>
      <Footer />
    </div>
  );
}
