import { FadeIn } from "./FadeIn";

export function FinalCTA() {
  return (
    <section className="final-cta" style={{ padding: "120px 40px" }}>
      <div className="grid-lines" />
      <div className="glow-orb" style={{ width: 500, height: 500, background: "rgba(201,168,76,0.05)", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
      <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <FadeIn>
          <div className="section-label" style={{ justifyContent: "center" }}>Get Started Today</div>
          <h2 className="serif" style={{
            fontSize: "clamp(2rem, 4vw, 3.4rem)",
            letterSpacing: "-0.02em",
            marginBottom: 24,
            lineHeight: 1.1
          }}>
            Legal intelligence,<br />
            <span style={{ color: "#c9a84c", fontStyle: "italic" }}>at your fingertips.</span>
          </h2>
          <p style={{ color: "#7a7d8c", maxWidth: 440, margin: "0 auto 48px", fontSize: "0.95rem", lineHeight: 1.7 }}>
            Join thousands of professionals who trust AI Legal Advisor to decode complexity and deliver clarity.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-primary" style={{ padding: "16px 40px", fontSize: "0.95rem" }}>Start Free — No Credit Card</button>
            <button className="btn-ghost" style={{ padding: "16px 40px", fontSize: "0.95rem" }}>Schedule a Demo</button>
          </div>
          <p style={{ color: "#4a4d5c", fontSize: "0.78rem", marginTop: 28, letterSpacing: "0.04em" }}>
            Free tier includes 5 document analyses per month · No commitment required
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
