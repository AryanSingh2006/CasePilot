import { useState, useEffect } from "react";
import { checkHealth } from "../services/legalApi";

export function AdvisorNavbar({ onClear, hasMessages }) {
  const [online, setOnline] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    checkHealth()
      .then(setOnline)
      .catch(() => setOnline(false));
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      padding: "0 40px",
      height: 64,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: scrolled ? "rgba(7,8,15,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(201,168,76,0.12)" : "1px solid transparent",
      transition: "all 0.3s ease",
    }}>
      <a href="/" style={{
        fontFamily: "'DM Serif Display', serif",
        fontSize: "1.1rem",
        color: "#c9a84c",
        textDecoration: "none",
        letterSpacing: "-0.01em",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7l-9-5z"
            stroke="#c9a84c" strokeWidth="1.5" fill="none"/>
          <path d="M9 12l2 2 4-4" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        CasePilot
      </a>

      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {/* Backend status indicator */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          fontSize: "0.75rem",
          color: online === null ? "#555" : online ? "#6dbf7a" : "#cf6679",
          fontFamily: "'DM Sans', sans-serif",
        }}>
          <span style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: online === null ? "#555" : online ? "#6dbf7a" : "#cf6679",
            boxShadow: online ? "0 0 8px #6dbf7a88" : "none",
            display: "inline-block",
          }} />
          {online === null ? "Connecting..." : online ? "API Online" : "API Offline"}
        </div>

        {hasMessages && (
          <button
            onClick={onClear}
            style={{
              background: "transparent",
              border: "1px solid rgba(201,168,76,0.3)",
              color: "#c9a84c",
              padding: "6px 16px",
              borderRadius: 4,
              fontSize: "0.78rem",
              fontFamily: "'DM Sans', sans-serif",
              cursor: "pointer",
              transition: "all 0.2s",
              letterSpacing: "0.04em",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(201,168,76,0.1)";
              e.currentTarget.style.borderColor = "rgba(201,168,76,0.6)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)";
            }}
          >
            Clear Session
          </button>
        )}
      </div>
    </nav>
  );
}