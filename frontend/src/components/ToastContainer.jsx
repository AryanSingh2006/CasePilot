const typeStyles = {
  success: { bg: "#1a2e1a", border: "#4a9a5a", icon: "✓", color: "#6dbf7a" },
  error:   { bg: "#2e1a1a", border: "#9a4a4a", icon: "✕", color: "#cf6679" },
  warning: { bg: "#2e261a", border: "#9a7a4a", icon: "⚠", color: "#d4a853" },
  info:    { bg: "#1a1e2e", border: "#4a5a9a", icon: "i", color: "#6a8adf" },
};

export function ToastContainer({ toasts, onRemove }) {
  if (!toasts.length) return null;

  return (
    <div style={{
      position: "fixed", top: 24, right: 24, zIndex: 9999,
      display: "flex", flexDirection: "column", gap: 10,
      maxWidth: 360,
    }}>
      {toasts.map((t) => {
        const s = typeStyles[t.type] || typeStyles.info;
        return (
          <div key={t.id} style={{
            background: s.bg,
            border: `1px solid ${s.border}`,
            borderRadius: 8,
            padding: "12px 16px",
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            animation: "fadeUp 0.3s ease",
            fontFamily: "'DM Sans', sans-serif",
            backdropFilter: "blur(12px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}>
            <span style={{
              width: 20, height: 20, borderRadius: "50%",
              background: s.color, color: "#07080f",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.7rem", fontWeight: 700, flexShrink: 0,
            }}>{s.icon}</span>
            <span style={{ color: "#e8e6e1", fontSize: "0.85rem", lineHeight: 1.5, flex: 1 }}>
              {t.message}
            </span>
            <button onClick={() => onRemove(t.id)} style={{
              background: "none", border: "none", color: "#7a7d8c",
              cursor: "pointer", fontSize: "1rem", padding: 0, flexShrink: 0,
              lineHeight: 1,
            }}>✕</button>
          </div>
        );
      })}
    </div>
  );
}
