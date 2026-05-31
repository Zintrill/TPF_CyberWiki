import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ArticleCard from "../components/ArticleCard";
import { defenseArticles } from "../data/articles";
import "./ListPage.css";

export default function DefensePage() {
  const [query, setQuery] = useState("");

  const displayed = defenseArticles.filter(
    (a) =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.summary.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="page-wrapper">
      <title>Defense</title>
      <Navbar />
      <main className="list-main">
        <div className="list-header">
          <div className="list-header-icon defense-icon">🛡</div>
          <div>
            <h1 className="list-title defense-color">Defense (Protection)</h1>
            <p className="list-subtitle">Access incident response playbooks, SOC guidelines, and blue team tactics.</p>
          </div>
        </div>

        <div className="list-search">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Filter articles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="article-grid">
          {displayed.length > 0 ? (
            displayed.map((article) => <ArticleCard key={article.id} article={article} />)
          ) : (
            <div className="no-results">No defense articles found.</div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
