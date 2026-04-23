function formatTime(date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

// Converts markdown text to styled React elements
function MarkdownText({ text }) {
  const lines = text.split("\n");
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Blank line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Numbered list item: "1. " or "1.  "
    if (/^\d+\.\s+/.test(line)) {
      const listItems = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        const content = lines[i].replace(/^\d+\.\s+/, "");
        listItems.push(<li key={i} style={{ marginBottom: 6 }}><InlineMarkdown text={content} /></li>);
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} style={{ paddingLeft: 20, margin: "8px 0" }}>
          {listItems}
        </ol>
      );
      continue;
    }

    // Bullet list item: "* " or "- "
    if (/^[\*\-]\s+/.test(line)) {
      const listItems = [];
      while (i < lines.length && /^[\*\-]\s+/.test(lines[i])) {
        const content = lines[i].replace(/^[\*\-]\s+/, "");
        listItems.push(<li key={i} style={{ marginBottom: 4 }}><InlineMarkdown text={content} /></li>);
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} style={{ paddingLeft: 20, margin: "8px 0", listStyleType: "disc" }}>
          {listItems}
        </ul>
      );
      continue;
    }

    // Heading: "## " or "### "
    if (/^#{1,3}\s+/.test(line)) {
      const content = line.replace(/^#{1,3}\s+/, "");
      elements.push(
        <p key={i} style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "0.95rem",
          color: "#e0ddd5",
          marginTop: 14,
          marginBottom: 4,
        }}>
          <InlineMarkdown text={content} />
        </p>
      );
      i++;
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={i} style={{ margin: "4px 0 8px" }}>
        <InlineMarkdown text={line} />
      </p>
    );
    i++;
  }

  return <div style={{ lineHeight: 1.8 }}>{elements}</div>;
}

// Handles inline **bold** and *italic* within a line
function InlineMarkdown({ text }) {
  const parts = [];
  // Split on **bold** or *italic*
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
  let last = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index));
    }
    if (match[0].startsWith("**")) {
      parts.push(<strong key={match.index} style={{ color: "#e8e4d8", fontWeight: 600 }}>{match[2]}</strong>);
    } else {
      parts.push(<em key={match.index} style={{ color: "#c9a84c", fontStyle: "italic" }}>{match[3]}</em>);
    }
    last = match.index + match[0].length;
  }

  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

export function UserMessage({ message }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "flex-end",
      marginBottom: 24,
      animation: "msgIn 0.3s ease",
    }}>
      <div style={{ maxWidth: "70%", minWidth: 120 }}>
        <div style={{
          background: "rgba(201,168,76,0.12)",
          border: "1px solid rgba(201,168,76,0.22)",
          borderRadius: "16px 16px 4px 16px",
          padding: "14px 18px",
          color: "#e8e4d8",
          fontSize: "0.9rem",
          lineHeight: 1.65,
          fontFamily: "'DM Sans', sans-serif",
          wordBreak: "break-word",
        }}>
          {message.text}
        </div>
        <div style={{
          textAlign: "right", marginTop: 5,
          fontSize: "0.72rem", color: "#454854",
          fontFamily: "'DM Sans', sans-serif",
        }}>
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
}

export function AdvisorMessage({ message }) {
  return (
    <div style={{
      display: "flex",
      gap: 14,
      marginBottom: 28,
      animation: "msgIn 0.35s ease",
    }}>
      {/* Avatar */}
      <div style={{
        flexShrink: 0, width: 36, height: 36, borderRadius: "50%",
        border: "1px solid rgba(201,168,76,0.3)",
        background: "rgba(201,168,76,0.06)",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginTop: 2,
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M12 3v18M5 6h14M8 9l-3 6h6L8 9zM16 9l-3 6h6l-3-6z"
            stroke="#c9a84c" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Header row */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <span style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "0.85rem", color: "#c9a84c", letterSpacing: "0.01em",
          }}>CasePilot</span>
          {message.demoMode && (
            <span style={{
              fontSize: "0.68rem", color: "#6a6d7c",
              border: "1px solid rgba(106,109,124,0.3)",
              borderRadius: 3, padding: "1px 7px",
              fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.04em",
            }}>DEMO</span>
          )}
          <span style={{
            fontSize: "0.72rem", color: "#454854",
            fontFamily: "'DM Sans', sans-serif",
          }}>{formatTime(message.timestamp)}</span>
        </div>

        {/* Response bubble — no height cap, expands fully */}
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "4px 16px 16px 16px",
          padding: "18px 22px",
          color: "#c8c5bc",
          fontSize: "0.88rem",
          fontFamily: "'DM Sans', sans-serif",
          wordBreak: "break-word",
          overflowWrap: "break-word",
          width: "100%",
        }}>
          <MarkdownText text={message.text} />
        </div>

        {/* Disclaimer */}
        {message.disclaimer && (
          <div style={{
            marginTop: 10, display: "flex", alignItems: "flex-start", gap: 7,
            padding: "9px 13px",
            background: "rgba(201,168,76,0.04)",
            border: "1px solid rgba(201,168,76,0.1)",
            borderRadius: 6,
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
              <circle cx="12" cy="12" r="10" stroke="#c9a84c" strokeWidth="1.5" opacity="0.6"/>
              <path d="M12 8v4M12 16h.01" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span style={{
              fontSize: "0.72rem", color: "#6a6570",
              fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5,
            }}>
              {message.disclaimer}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div style={{ display: "flex", gap: 14, marginBottom: 24 }}>
      <div style={{
        flexShrink: 0, width: 36, height: 36, borderRadius: "50%",
        border: "1px solid rgba(201,168,76,0.3)",
        background: "rgba(201,168,76,0.06)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M12 3v18M5 6h14M8 9l-3 6h6L8 9zM16 9l-3 6h6l-3-6z"
            stroke="#c9a84c" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "4px 16px 16px 16px",
        padding: "16px 22px",
        display: "flex", alignItems: "center", gap: 5,
      }}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "#c9a84c", opacity: 0.5, display: "inline-block",
            animation: `typingDot 1.2s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}
