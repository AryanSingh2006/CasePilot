export function Hero() {
  return (
    <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden", paddingTop: 68 }}>
      <div className="grid-lines" />
      <div className="glow-orb" style={{ width: 600, height: 600, background: "rgba(201,168,76,0.06)", top: "10%", left: "-10%" }} />
      <div className="glow-orb" style={{ width: 400, height: 400, background: "rgba(201,168,76,0.04)", bottom: "10%", right: "-5%" }} />

      <div style={{ position: "absolute", right: "5%", top: "50%", transform: "translateY(-50%)", opacity: 0.04, pointerEvents: "none" }}>
        <svg width="500" height="500" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="0.5">
          <path d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" />
        </svg>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 40px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 680 }}>
          <div className="section-label" style={{ animationDelay: "0.1s" }}>
            AI-Powered Legal Intelligence
          </div>

          <h1 className="serif" style={{
            fontSize: "clamp(2.6rem, 5vw, 4.2rem)",
            lineHeight: 1.08,
            letterSpacing: "-0.02em",
            color: "#e8e6e1",
            marginBottom: 28,
            opacity: 0,
            animation: "fadeUp 0.8s ease 0.2s forwards"
          }}>
            Legal Clarity,<br />
            <span style={{ color: "#c9a84c", fontStyle: "italic" }}>Intelligently</span> Delivered.
          </h1>

          <p style={{
            fontSize: "1.05rem",
            lineHeight: 1.7,
            color: "#7a7d8c",
            maxWidth: 520,
            marginBottom: 44,
            opacity: 0,
            animation: "fadeUp 0.8s ease 0.4s forwards"
          }}>
            Navigate complex legal landscapes with confidence. AI Legal Advisor transforms intricate legal documents, questions, and case research into clear, actionable intelligence — available 24/7.
          </p>

          <div className="hero-btns" style={{ display: "flex", gap: 16, opacity: 0, animation: "fadeUp 0.8s ease 0.6s forwards" }}>
            <button className="btn-primary">Start Free Analysis</button>
            <button className="btn-ghost">See How It Works</button>
          </div>

          <div style={{ display: "flex", gap: 40, marginTop: 56, opacity: 0, animation: "fadeUp 0.8s ease 0.8s forwards" }}>
            {[["10K+", "Documents Analyzed"], ["98%", "Accuracy Rate"], ["50+", "Jurisdictions"]].map(([num, label]) => (
              <div key={label}>
                <div className="serif" style={{ fontSize: "1.6rem", color: "#c9a84c", letterSpacing: "-0.02em" }}>{num}</div>
                <div style={{ fontSize: "0.75rem", color: "#7a7d8c", letterSpacing: "0.05em", textTransform: "uppercase", marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
