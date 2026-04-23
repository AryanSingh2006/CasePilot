import { useState, useRef, useEffect } from "react";
import { useAdvisor } from "../hooks/useAdvisor";
import { AdvisorNavbar } from "./AdvisorNavbar";
import { WelcomeScreen } from "./WelcomeScreen";
import { UserMessage, AdvisorMessage, TypingIndicator } from "../suggestions/MessageBubble";
import { QueryInput } from "../TypingIndicator/QueryInput";
import { ErrorBanner } from "../TypingIndicator/ErrorBanner";

export function AdvisorPage() {
  const { messages, loading, error, sendQuery, clearHistory } = useAdvisor();
  const [prefill, setPrefill] = useState(null);
  const [localError, setLocalError] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (error) setLocalError(error);
  }, [error]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div style={{
      height: "100vh",
      background: "#07080f",
      color: "#e8e6e1",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    }}>
      <AdvisorNavbar onClear={clearHistory} hasMessages={messages.length > 0} />

      {/* Background orb */}
      <div style={{
        position: "fixed", top: "20%", left: "50%",
        transform: "translateX(-50%)",
        width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* Scrollable area — full viewport width so scrollbar appears at edge */}
      <main style={{
        flex: 1,
        overflowY: "auto",
        overflowX: "hidden",
        width: "100%",
        position: "relative",
        zIndex: 1,
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(201,168,76,0.15) transparent",
      }}>
        {/* Inner content constrained to readable width */}
        <div style={{
          maxWidth: 760,
          width: "100%",
          margin: "0 auto",
          padding: "88px 24px 32px",
        }}>
          {messages.length === 0 ? (
            <WelcomeScreen onSuggest={(q) => setPrefill(q)} />
          ) : (
            <div>
              {messages.map((msg) =>
                msg.role === "user"
                  ? <UserMessage key={msg.id} message={msg} />
                  : <AdvisorMessage key={msg.id} message={msg} />
              )}
              {loading && <TypingIndicator />}
              <div ref={bottomRef} />
            </div>
          )}
        </div>
      </main>

      {/* Fixed input — anchored to bottom, never moves */}
      <div style={{
        flexShrink: 0,
        position: "relative",
        zIndex: 10,
        background: "linear-gradient(to top, #07080f 85%, transparent)",
        borderTop: "1px solid rgba(201,168,76,0.07)",
      }}>
        <ErrorBanner message={localError} onDismiss={() => setLocalError(null)} />
        <QueryInput
          onSend={sendQuery}
          loading={loading}
          prefill={prefill}
          onPrefillConsumed={() => setPrefill(null)}
        />
      </div>
    </div>
  );
}
