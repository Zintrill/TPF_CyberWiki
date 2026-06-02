import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { mockComments } from "../data/articles";
import "./Comments.css";

function timeAgo(isoString) {
  const diff = (Date.now() - new Date(isoString).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function getInitials(name) {
  return name ? name[0].toUpperCase() : "?";
}

function getStorageKey(slug) {
  return `cw_comments_${slug}`;
}

export default function Comments({ articleSlug }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(getStorageKey(articleSlug));
    const userComments = stored ? JSON.parse(stored) : [];
    const seed = mockComments.filter((c) => c.articleSlug === articleSlug);
    const merged = [...seed, ...userComments].sort(
      (a, b) => new Date(a.time) - new Date(b.time)
    );
    setComments(merged);
  }, [articleSlug]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);

    const displayName = user.displayName || user.email?.split("@")[0] || "anonymous";
    const newComment = {
      id: Date.now(),
      articleSlug,
      user: displayName,
      initials: getInitials(displayName),
      text: text.trim(),
      time: new Date().toISOString(),
      likes: 0,
    };

    const stored = localStorage.getItem(getStorageKey(articleSlug));
    const userComments = stored ? JSON.parse(stored) : [];
    userComments.push(newComment);
    localStorage.setItem(getStorageKey(articleSlug), JSON.stringify(userComments));

    setComments((prev) => [...prev, newComment]);
    setText("");
    setSubmitting(false);
  };

  return (
    <section className="comments-section">
      <h2 className="comments-title">
        <span className="comments-icon">💬</span>
        Discussion
        <span className="comments-count">{comments.length}</span>
      </h2>

      <div className="comments-list">
        {comments.length === 0 && (
          <div className="comments-empty">No comments yet. Be the first to add one!</div>
        )}
        {comments.map((c) => (
          <div key={c.id} className="comment-card">
            <div className="comment-avatar-wrap">
              <span className="comment-avatar-letter">{c.initials}</span>
            </div>
            <div className="comment-content">
              <div className="comment-header">
                <span className="comment-username">{c.user}</span>
                <span className="comment-dot">·</span>
                <span className="comment-time">{timeAgo(c.time)}</span>
              </div>
              <p className="comment-text">{c.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="comment-form-area">
        {user ? (
          <form className="comment-form" onSubmit={handleSubmit}>
            <div className="comment-form-avatar">
              {getInitials(user.displayName || user.email)}
            </div>
            <div className="comment-input-wrap">
              <textarea
                className="comment-textarea"
                placeholder="Add a comment... (markdown supported)"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={3}
                maxLength={1000}
              />
              <div className="comment-form-footer">
                <span className="comment-char-count">{text.length}/1000</span>
                <button
                  type="submit"
                  className="comment-submit-btn"
                  disabled={submitting || !text.trim()}
                >
                  {submitting ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="comment-login-prompt">
            <span className="lock-icon">🔒</span>
            <span>
              <Link to="/login" className="comment-login-link">Log in</Link>
              {" "}to join the discussion
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
