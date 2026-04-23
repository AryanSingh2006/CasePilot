import { SUGGESTED_QUERIES } from "../data/advisorContent";

export function WelcomeScreen({ onSuggest }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "60vh",
      textAlign: "center",
      padding: "0 24px",
    }}>
      {/* Scales of justice icon */}
      <div style={{
        width: 72,
        height: 72,
        borderRadius: "50%",
        border: "1px solid rgba(201,168,76,0.25)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 28,
        background: "rgba(201,168,76,0.05)",
        boxShadow: "0 0 40px rgba(201,168,76,0.08)",
      }}>
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
          <path d="M12 3v18M5 6h14M8 9l-3 6h6L8 9zM16 9l-3 6h6l-3-6z"
            stroke="#c9a84c" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 21h8" stroke="#c9a84c" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
      </div>

      <h1 style={{
        fontFamily: "'DM Serif Display', serif",
        fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
        color: "#e8e6e1",
        letterSpacing: "-0.02em",
        marginBottom: 12,
        lineHeight: 1.2,
      }}>
        How can I assist you today?
      </h1>

      <p style={{
        color: "#6a6d7c",
        fontSize: "0.9rem",
        maxWidth: 420,
        lineHeight: 1.7,
        marginBottom: 52,
        fontFamily: "'DM Sans', sans-serif",
      }}>
        Ask a legal question, upload a clause for review, or explore your rights.
        CasePilot provides AI-powered insights grounded in legal context.
      </p>

      {/* Suggested queries */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 12,
        width: "100%",
        maxWidth: 760,
      }}>
        {SUGGESTED_QUERIES.map((q, i) => (
          <button
            key={i}
            onClick={() => onSuggest(q)}
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(201,168,76,0.1)",
              borderRadius: 8,
              padding: "14px 18px",
              textAlign: "left",
              color: "#9a9dac",
              fontSize: "0.82rem",
              fontFamily: "'DM Sans', sans-serif",
              lineHeight: 1.55,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "rgba(201,168,76,0.35)";
              e.currentTarget.style.color = "#c8c6bf";
              e.currentTarget.style.background = "rgba(201,168,76,0.04)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "rgba(201,168,76,0.1)";
              e.currentTarget.style.color = "#9a9dac";
              e.currentTarget.style.background = "rgba(255,255,255,0.02)";
            }}
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}