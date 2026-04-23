import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useToast } from "../hooks/useToast";
import { ToastContainer } from "../components/ToastContainer";
import { askQuestion } from "../services/chatApi";

function formatAnswer(text) {
  if (!text) return [];
  return text.split("\n").filter(Boolean);
}

export function ChatPage() {
  const location = useLocation();
  const initialCategory = location.state?.category || null;

  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState(initialCategory);
  const [sessionId, setSessionId] = useState(null);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const { toasts, toast, removeToast } = useToast();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Reset session when category changes
  const clearChat = () => {
    setMessages([]);
    setSessionId(null);
  };

  const handleSend = async () => {
    const q = query.trim();
    if (!q || loading) return;
    setQuery("");

    const userMsg = { id: Date.now(), role: "user", text: q };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const data = await askQuestion({
        query: q,
        categoryId: category?.id || null,
        sessionId,
      });
      setSessionId(data.sessionId);
      const aiMsg = {
        id: Date.now() + 1,
        role: "ai",
        text: data.answer,
        categoryName: data.categoryName,
        demoMode: data.demoMode,
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      toast.error(err.message || "Failed to get a response.");
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{
      height: "calc(100vh - 64px)",
      display: "flex", flexDirection: "column",
      background: "#07080f", color: "#e8e6e1",
      position: "relative",
    }}>
      {/* Background orb */}
      <div style={{
        position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)",
        width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* Category context bar */}
      {category && (
        <div style={{
          zIndex: 2, flexShrink: 0,
          background: "rgba(201,168,76,0.06)",
          borderBottom: "1px solid rgba(201,168,76,0.12)",
          padding: "10px 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          fontSize: "0.82rem",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#c9a84c" }}>
            <span>{category.icon}</span>
            <span>Consulting on: <strong>{category.name}</strong></span>
          </div>
          <button onClick={() => { setCategory(null); clearChat(); }} style={{
            background: "none", border: "none", color: "#7a7d8c", cursor: "pointer",
            fontSize: "0.78rem", padding: "2px 8px",
          }}>
            ✕ Clear category
          </button>
        </div>
      )}

      {/* Messages area */}
      <div style={{
        flex: 1, overflowY: "auto", overflowX: "hidden",
        padding: "24px 0", zIndex: 1,
        scrollbarWidth: "thin", scrollbarColor: "rgba(201,168,76,0.15) transparent",
      }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px" }}>
          {messages.length === 0 && (
            <EmptyState category={category} onSuggest={q => { setQuery(q); textareaRef.current?.focus(); }} />
          )}
          {messages.map(msg => (
            msg.role === "user"
              ? <UserBubble key={msg.id} text={msg.text} />
              : <AIBubble key={msg.id} text={msg.text} demoMode={msg.demoMode} categoryName={msg.categoryName} />
          ))}
          {loading && <TypingDots />}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input area */}
      <div style={{
        flexShrink: 0, zIndex: 10,
        background: "linear-gradient(to top, #07080f 85%, transparent)",
        borderTop: "1px solid rgba(201,168,76,0.07)",
        padding: "16px 24px 20px",
      }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{
            display: "flex", gap: 10, alignItems: "flex-end",
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(201,168,76,0.18)",
            borderRadius: 12, padding: "10px 12px",
            transition: "border-color 0.2s",
          }}
            onFocusCapture={e => e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)"}
            onBlurCapture={e => e.currentTarget.style.borderColor = "rgba(201,168,76,0.18)"}
          >
            <textarea
              ref={textareaRef}
              id="chat-input"
              rows={1}
              value={query}
              onChange={e => {
                setQuery(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 140) + "px";
              }}
              onKeyDown={handleKey}
              placeholder={category ? `Ask about ${category.name}…` : "Ask any legal question…"}
              style={{
                flex: 1, background: "none", border: "none", outline: "none",
                color: "#e8e6e1", fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.9rem", lineHeight: 1.55, resize: "none",
                padding: "4px 6px", overflowY: "hidden",
                scrollbarWidth: "none",
              }}
            />
            <button
              id="chat-send-btn"
              onClick={handleSend}
              disabled={loading || !query.trim()}
              style={{
                width: 38, height: 38, borderRadius: 8, flexShrink: 0,
                background: loading || !query.trim()
                  ? "rgba(201,168,76,0.2)"
                  : "linear-gradient(135deg, #c9a84c, #e8c96f)",
                border: "none", cursor: loading || !query.trim() ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s ease",
              }}
            >
              {loading
                ? <div style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(201,168,76,0.3)", borderTopColor: "#c9a84c", animation: "spin 0.8s linear infinite" }} />
                : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#07080f" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
              }
            </button>
          </div>
          <p style={{ textAlign: "center", fontSize: "0.7rem", color: "#4a4d5c", marginTop: 8 }}>
            AI responses are informational only · Not legal advice · Consult a licensed attorney
          </p>
        </div>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

function UserBubble({ text }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20, animation: "msgIn 0.3s ease" }}>
      <div style={{
        maxWidth: "78%", background: "rgba(201,168,76,0.12)",
        border: "1px solid rgba(201,168,76,0.2)",
        borderRadius: "14px 14px 2px 14px",
        padding: "12px 16px", fontSize: "0.88rem",
        color: "#e8e6e1", lineHeight: 1.6,
        whiteSpace: "pre-wrap",
      }}>{text}</div>
    </div>
  );
}

function AIBubble({ text, demoMode, categoryName }) {
  const lines = formatAnswer(text);
  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 24, animation: "msgIn 0.3s ease" }}>
      {/* Avatar */}
      <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, marginTop: 2, background: "linear-gradient(135deg, #c9a84c, #e8c96f)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#07080f" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" />
        </svg>
      </div>
      <div style={{ flex: 1 }}>
        {demoMode && (
          <div style={{ fontSize: "0.74rem", color: "#d4a853", background: "rgba(212,168,83,0.08)", border: "1px solid rgba(212,168,83,0.2)", borderRadius: 6, padding: "4px 10px", display: "inline-block", marginBottom: 8 }}>
            ⚠ Demo Mode — Add GEMINI_API_KEY for real responses
          </div>
        )}
        {categoryName && (
          <div style={{ fontSize: "0.74rem", color: "#7a7d8c", marginBottom: 6 }}>
            📂 {categoryName}
          </div>
        )}
        <div style={{
          background: "rgba(255,255,255,0.025)", border: "1px solid rgba(201,168,76,0.1)",
          borderRadius: "2px 14px 14px 14px", padding: "14px 16px",
          fontSize: "0.88rem", color: "#d8d5cc", lineHeight: 1.75,
        }}>
          {lines.map((line, i) => {
            if (line.startsWith("•") || line.startsWith("-") || line.startsWith("*")) {
              return <div key={i} style={{ paddingLeft: 14, position: "relative", marginBottom: 4 }}>
                <span style={{ position: "absolute", left: 0, color: "#c9a84c" }}>•</span>
                {line.replace(/^[•\-*]\s*/, "")}
              </div>;
            }
            if (line.match(/^\d+\./)) {
              return <div key={i} style={{ marginBottom: 4 }}>{line}</div>;
            }
            return <p key={i} style={{ marginBottom: i < lines.length - 1 ? 8 : 0 }}>{line}</p>;
          })}
        </div>
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 24, animation: "msgIn 0.3s ease" }}>
      <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, background: "rgba(201,168,76,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: "0.7rem", color: "#c9a84c" }}>⚖</span>
      </div>
      <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(201,168,76,0.1)", borderRadius: "2px 14px 14px 14px", padding: "14px 20px", display: "flex", gap: 6, alignItems: "center" }}>
        {[0, 0.15, 0.3].map((delay, i) => (
          <div key={i} style={{
            width: 7, height: 7, borderRadius: "50%", background: "#c9a84c",
            animation: `typingDot 1.2s ease ${delay}s infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}

const SUGGESTIONS = [
  "What are my rights if I face wrongful termination?",
  "How do I file an FIR for online fraud?",
  "What documents do I need for a property purchase?",
  "How does child custody work after divorce?",
];

function EmptyState({ category, onSuggest }) {
  return (
    <div style={{ textAlign: "center", padding: "40px 0 30px", animation: "fadeUp 0.6s ease" }}>
      <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>{category?.icon || "⚖️"}</div>
      <h2 className="serif" style={{ fontSize: "1.4rem", color: "#e8e6e1", marginBottom: 8 }}>
        {category ? `${category.name} Advisor` : "AI Legal Advisor"}
      </h2>
      <p style={{ color: "#7a7d8c", fontSize: "0.85rem", maxWidth: 400, margin: "0 auto 28px" }}>
        {category ? category.description : "Ask any legal question and I'll provide clear, actionable guidance."}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
        {SUGGESTIONS.map(s => (
          <button key={s} onClick={() => onSuggest(s)} style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.14)",
            borderRadius: 20, padding: "8px 16px", fontSize: "0.8rem",
            color: "#9a9dac", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.35)"; e.currentTarget.style.color = "#c9a84c"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.14)"; e.currentTarget.style.color = "#9a9dac"; }}
          >{s}</button>
        ))}
      </div>
    </div>
  );
}
