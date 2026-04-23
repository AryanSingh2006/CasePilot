import { useState, useRef, useEffect } from "react";

export function QueryInput({ onSend, loading, prefill, onPrefillConsumed }) {
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);

  // Handle suggested query prefill from WelcomeScreen
  useEffect(() => {
    if (prefill) {
      setValue(prefill);
      onPrefillConsumed();
      textareaRef.current?.focus();
    }
  }, [prefill, onPrefillConsumed]);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 180) + "px";
  }, [value]);

  function handleSubmit() {
    const trimmed = value.trim();
    if (!trimmed || loading) return;
    onSend(trimmed);
    setValue("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div style={{
      padding: "14px 0 22px",
    }}>
      <div style={{
        maxWidth: 760,
        margin: "0 auto",
        padding: "0 24px",
      }}>
        <div style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 12,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(201,168,76,0.18)",
          borderRadius: 12,
          padding: "12px 14px",
          transition: "border-color 0.2s",
        }}
          onFocus={(e) => {
            if (e.currentTarget.contains(e.target)) {
              e.currentTarget.style.borderColor = "rgba(201,168,76,0.45)";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(201,168,76,0.06)";
            }
          }}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              e.currentTarget.style.borderColor = "rgba(201,168,76,0.18)";
              e.currentTarget.style.boxShadow = "none";
            }
          }}
        >
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a legal question… (Shift+Enter for new line)"
            disabled={loading}
            rows={1}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              resize: "none",
              color: "#e0ddd5",
              fontSize: "0.9rem",
              fontFamily: "'DM Sans', sans-serif",
              lineHeight: 1.6,
              caretColor: "#c9a84c",
              minHeight: 26,
              maxHeight: 180,
              overflowY: "auto",
              scrollbarWidth: "none",
            }}
          />

          <button
            onClick={handleSubmit}
            disabled={!value.trim() || loading}
            style={{
              flexShrink: 0,
              width: 38,
              height: 38,
              borderRadius: 8,
              border: "none",
              background: !value.trim() || loading
                ? "rgba(201,168,76,0.1)"
                : "rgba(201,168,76,0.85)",
              cursor: !value.trim() || loading ? "default" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
              transform: "none",
            }}
            onMouseEnter={e => {
              if (value.trim() && !loading) {
                e.currentTarget.style.background = "#c9a84c";
                e.currentTarget.style.transform = "scale(1.05)";
              }
            }}
            onMouseLeave={e => {
              if (value.trim() && !loading) {
                e.currentTarget.style.background = "rgba(201,168,76,0.85)";
                e.currentTarget.style.transform = "none";
              }
            }}
          >
            {loading ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 1s linear infinite" }}>
                <circle cx="12" cy="12" r="9" stroke="#c9a84c" strokeWidth="2" strokeDasharray="28" strokeDashoffset="10"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 19V5M5 12l7-7 7 7" stroke={!value.trim() ? "#c9a84c55" : "#07080f"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </div>

        <p style={{
          textAlign: "center",
          marginTop: 10,
          fontSize: "0.7rem",
          color: "#353843",
          fontFamily: "'DM Sans', sans-serif",
          letterSpacing: "0.02em",
        }}>
          CasePilot provides legal information, not legal advice. Consult a licensed attorney for your specific situation.
        </p>
      </div>
    </div>
  );
}