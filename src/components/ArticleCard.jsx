import { Link } from "react-router-dom";
import "./ArticleCard.css";

export default function ArticleCard({ article }) {
  return (
    <Link to={`/article/${article.slug}`} className="article-card">
      <div className="article-card-tags">
        {article.tags.slice(0, 3).map((tag) => (
          <span key={tag} className={`tag tag-${tag.toLowerCase().replace(/\s+/g, "-")}`}>{tag}</span>
        ))}
      </div>
      <h3 className="article-card-title">{article.title}</h3>
      <p className="article-card-summary">{article.summary.substring(0, 120)}...</p>
      <div className="article-card-meta">
        <span>Updated: {article.lastUpdated}</span>
        <span>→</span>
      </div>
    </Link>
  );
}
