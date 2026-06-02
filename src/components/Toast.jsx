import { useState, useCallback } from "react";
import "./Toast.css";

let _push = null;

export function useToastController() {
  const [toasts, setToasts] = useState([]);

  _push = useCallback((msg, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3200);
  }, []);

  return toasts;
}

export function toast(msg, type = "info") {
  _push?.(msg, type);
}

export function ToastContainer({ toasts }) {
  return (
    <div className="toast-wrap">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span className="toast-icon">
            {t.type === "success" ? "✓" : t.type === "error" ? "✕" : t.type === "warn" ? "⚠" : "ℹ"}
          </span>
          {t.msg}
        </div>
      ))}
    </div>
  );
}
