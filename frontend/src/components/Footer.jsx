export function Footer() {
  return (
    <footer style={{ padding: "48px 40px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 22, height: 22, background: "linear-gradient(135deg, #c9a84c, #e8c96f)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#07080f" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" />
            </svg>
          </div>
          <span className="serif" style={{ fontSize: "0.95rem", color: "#e8e6e1" }}>AI Legal<span style={{ color: "#c9a84c" }}>.</span></span>
        </div>
        <div style={{ display: "flex", gap: 32 }}>
          {["Privacy Policy", "Terms of Service", "Contact"].map(l => (
            <a key={l} href="#" style={{ color: "#4a4d5c", fontSize: "0.78rem", textDecoration: "none", letterSpacing: "0.04em", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = "#c9a84c"}
              onMouseLeave={e => e.target.style.color = "#4a4d5c"}>{l}</a>
          ))}
        </div>
        <p style={{ color: "#4a4d5c", fontSize: "0.75rem" }}>© 2025 AI Legal Advisor. All rights reserved.</p>
      </div>
    </footer>
  );
}
