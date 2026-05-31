import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ArticleCard from "../components/ArticleCard";
import { offenseArticles, articles } from "../data/articles";
import "./ListPage.css";

export default function OffensePage() {
  const [searchParams] = useSearchParams();
  const qParam = searchParams.get("q") || "";
  const [query, setQuery] = useState(qParam);

  const filtered = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.summary.toLowerCase().includes(query.toLowerCase()) ||
      a.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
  );

  const displayed = query ? filtered : offenseArticles;

  return (
    <div className="page-wrapper">
      <title>Offense</title>
      <Navbar />
      <main className="list-main">
        <div className="list-header">
          <div className="list-header-icon offense-icon">⚔</div>
          <div>
            <h1 className="list-title offense-color">Offense (Attacks)</h1>
            <p className="list-subtitle">Explore attack vectors, exploit frameworks, and red team methodologies.</p>
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
            <div className="no-results">No articles found for "{query}"</div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
