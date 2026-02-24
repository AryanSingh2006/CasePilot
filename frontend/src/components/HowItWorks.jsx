import { FadeIn } from "./FadeIn";
import { steps } from "../data/content";

export function HowItWorks() {
  return (
    <section id="how-it-works" style={{ padding: "120px 40px", background: "var(--navy)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <div className="section-label" style={{ justifyContent: "center" }}>Process</div>
            <h2 className="serif" style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)", letterSpacing: "-0.02em" }}>
              Three steps to legal clarity.
            </h2>
          </div>
        </FadeIn>

        <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0 }}>
          {steps.map((s, i) => (
            <FadeIn key={s.num} delay={i * 0.15}>
              <div style={{ padding: "48px 40px", borderTop: "1px solid var(--border)", position: "relative" }}>
                <div style={{
                  fontSize: "3.5rem", fontFamily: "'DM Serif Display', serif",
                  color: "rgba(201,168,76,0.12)", letterSpacing: "-0.04em", lineHeight: 1,
                  marginBottom: 24
                }}>{s.num}</div>
                <h3 className="serif" style={{ fontSize: "1.3rem", marginBottom: 14, color: "#e8e6e1" }}>{s.title}</h3>
                <p style={{ color: "#7a7d8c", fontSize: "0.88rem", lineHeight: 1.75 }}>{s.desc}</p>
                {i < 2 && (
                  <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 1, background: "linear-gradient(180deg, var(--border), transparent)" }} />
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
