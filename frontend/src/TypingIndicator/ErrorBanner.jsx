export function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div style={{
      maxWidth: 760,
      margin: "0 auto 16px",
      padding: "0 24px",
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 16px",
        background: "rgba(207,102,121,0.08)",
        border: "1px solid rgba(207,102,121,0.25)",
        borderRadius: 8,
        animation: "msgIn 0.3s ease",
      }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
          <circle cx="12" cy="12" r="10" stroke="#cf6679" strokeWidth="1.5"/>
          <path d="M12 8v4M12 16h.01" stroke="#cf6679" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span style={{
          flex: 1,
          fontSize: "0.82rem",
          color: "#cf8090",
          fontFamily: "'DM Sans', sans-serif",
        }}>
          {message}
        </span>
        <button
          onClick={onDismiss}
          style={{
            background: "none",
            border: "none",
            color: "#cf6679",
            cursor: "pointer",
            padding: "2px 4px",
            fontSize: "1rem",
            lineHeight: 1,
            opacity: 0.6,
          }}
        >×</button>
      </div>
    </div>
  );
}