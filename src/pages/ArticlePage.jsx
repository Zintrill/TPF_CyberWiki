import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { articles } from "../data/articles";
import "./ArticlePage.css";

export default function ArticlePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const article = articles.find((a) => a.slug === slug);

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
              <button className="bookmark-btn" title="Bookmark">☆</button>
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
        </div>

        <aside className="article-sidebar">
          {article.relatedVectors?.length > 0 && (
            <div className="sidebar-card">
              <h3 className="sidebar-title">
                <span>🔗</span> Related Vectors
              </h3>
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
              <h3 className="sidebar-title">
                <span>🔧</span> Analysis Tools
              </h3>
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
        </aside>
      </main>
      <Footer />
    </div>
  );
}
