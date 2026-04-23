import { useState, useEffect, useCallback } from "react";
import { useToast } from "../hooks/useToast";
import { ToastContainer } from "../components/ToastContainer";
import { getHistory, deleteQuery } from "../services/chatApi";

export function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [expanded, setExpanded] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const { toasts, toast, removeToast } = useToast();

  const load = useCallback((p = 0) => {
    setLoading(true);
    setError(null);
    getHistory(p, 15)
      .then(data => {
        setHistory(data.content ?? []);
        setTotalPages(data.totalPages ?? 0);
        setTotalElements(data.totalElements ?? 0);
        setPage(data.number ?? 0);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(0); }, [load]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this query from your history?")) return;
    setDeletingId(id);
    try {
      await deleteQuery(id);
      setHistory(prev => prev.filter(q => q.id !== id));
      setTotalElements(prev => prev - 1);
      toast.success("Query removed from history.");
    } catch (err) {
      toast.error(err.message || "Failed to delete query.");
    } finally {
      setDeletingId(null);
    }
  };

  const toggleExpand = (id) => {
    setExpanded(prev => prev === id ? null : id);
  };

  return (
    <div style={{ padding: "36px 32px", maxWidth: 860, margin: "0 auto" }}>
      <div style={{ marginBottom: 32, animation: "fadeUp 0.6s ease forwards", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div>
          <div className="section-label">Consultation Records</div>
          <h1 className="serif" style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: "#e8e6e1", letterSpacing: "-0.02em" }}>
            Query History
          </h1>
        </div>
        {totalElements > 0 && (
          <div style={{ fontSize: "0.8rem", color: "#7a7d8c" }}>
            {totalElements} total {totalElements === 1 ? "query" : "queries"}
          </div>
        )}
      </div>

      {/* Loading skeletons */}
      {loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, animation: "fadeUp 0.4s ease" }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.015)", border: "1px solid rgba(201,168,76,0.08)",
              borderRadius: 10, padding: "18px 20px",
              animation: "pulse 1.5s ease infinite",
            }}>
              <div style={{ width: "55%", height: 14, background: "rgba(255,255,255,0.06)", borderRadius: 4, marginBottom: 8 }} />
              <div style={{ width: "30%", height: 10, background: "rgba(255,255,255,0.04)", borderRadius: 4 }} />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div style={{ background: "rgba(207,102,121,0.08)", border: "1px solid rgba(207,102,121,0.25)", borderRadius: 10, padding: "16px 20px", color: "#cf6679", fontSize: "0.88rem" }}>
          ⚠ {error}
        </div>
      )}

      {!loading && !error && history.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#7a7d8c" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>📋</div>
          <div className="serif" style={{ fontSize: "1.2rem", color: "#9a9dac", marginBottom: 8 }}>No history yet</div>
          <p style={{ fontSize: "0.85rem" }}>Your past AI consultations will appear here once you start chatting.</p>
        </div>
      )}

      {!loading && !error && history.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, animation: "fadeUp 0.5s ease 0.1s both" }}>
          {history.map(item => (
            <div
              key={item.id}
              style={{
                background: expanded === item.id ? "rgba(201,168,76,0.05)" : "rgba(255,255,255,0.018)",
                border: `1px solid ${expanded === item.id ? "rgba(201,168,76,0.2)" : "rgba(201,168,76,0.1)"}`,
                borderRadius: 10,
                overflow: "hidden",
                transition: "border-color 0.2s, background 0.2s",
              }}
            >
              {/* Row header — always visible */}
              <div
                onClick={() => toggleExpand(item.id)}
                style={{
                  padding: "16px 18px",
                  cursor: "pointer",
                  display: "flex", alignItems: "flex-start", gap: 12,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: "0.88rem", fontWeight: 500, color: "#d8d5cc",
                    marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis",
                    whiteSpace: expanded === item.id ? "normal" : "nowrap",
                  }}>
                    {item.query}
                  </div>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                    {item.categoryName && (
                      <span style={{ fontSize: "0.73rem", color: "#c9a84c", background: "rgba(201,168,76,0.1)", borderRadius: 4, padding: "2px 7px" }}>
                        {item.categoryName}
                      </span>
                    )}
                    <span style={{ fontSize: "0.73rem", color: "#7a7d8c" }}>
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : ""}
                    </span>
                    {item.demoMode && (
                      <span style={{ fontSize: "0.7rem", color: "#d4a853", background: "rgba(212,168,83,0.08)", borderRadius: 4, padding: "2px 7px" }}>
                        Demo
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0, alignItems: "center" }}>
                  <button
                    onClick={(e) => handleDelete(item.id, e)}
                    disabled={deletingId === item.id}
                    title="Delete"
                    style={{
                      background: "none", border: "1px solid rgba(207,102,121,0.2)",
                      borderRadius: 6, color: "#cf6679", cursor: "pointer",
                      padding: "4px 8px", fontSize: "0.75rem",
                      transition: "all 0.2s",
                      opacity: deletingId === item.id ? 0.4 : 1,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(207,102,121,0.1)"; e.currentTarget.style.borderColor = "rgba(207,102,121,0.4)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.borderColor = "rgba(207,102,121,0.2)"; }}
                  >
                    🗑
                  </button>
                  <span style={{ color: "#7a7d8c", fontSize: "0.8rem", transform: expanded === item.id ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>▾</span>
                </div>
              </div>

              {/* Expanded answer */}
              {expanded === item.id && (
                <div style={{
                  borderTop: "1px solid rgba(201,168,76,0.08)",
                  padding: "16px 18px",
                  background: "rgba(0,0,0,0.15)",
                  animation: "fadeUp 0.25s ease",
                }}>
                  <div style={{ fontSize: "0.74rem", color: "#c9a84c", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 10 }}>
                    AI Response
                  </div>
                  <div style={{ fontSize: "0.86rem", color: "#b8b5ad", lineHeight: 1.75, whiteSpace: "pre-wrap" }}>
                    {item.answer}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 28, animation: "fadeUp 0.5s ease 0.2s both" }}>
          <button
            disabled={page === 0}
            onClick={() => load(page - 1)}
            style={pagerBtn(page === 0)}
          >← Prev</button>
          <span style={{ display: "flex", alignItems: "center", fontSize: "0.8rem", color: "#7a7d8c", padding: "0 12px" }}>
            {page + 1} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => load(page + 1)}
            style={pagerBtn(page >= totalPages - 1)}
          >Next →</button>
        </div>
      )}

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

const pagerBtn = (disabled) => ({
  background: "rgba(255,255,255,0.02)",
  border: "1px solid rgba(201,168,76,0.15)",
  borderRadius: 8, padding: "8px 18px",
  color: disabled ? "#4a4d5c" : "#9a9dac",
  cursor: disabled ? "not-allowed" : "pointer",
  fontSize: "0.82rem", fontFamily: "'DM Sans', sans-serif",
  transition: "all 0.2s",
  opacity: disabled ? 0.5 : 1,
});
