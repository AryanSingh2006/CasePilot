import { FadeIn } from "./FadeIn";
import { features } from "../data/content";

export function Features() {
  return (
    <section id="features" style={{ padding: "120px 40px", background: "var(--navy-2)", position: "relative" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <FadeIn>
          <div className="section-label">Core Capabilities</div>
          <h2 className="serif" style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)", letterSpacing: "-0.02em", marginBottom: 16, maxWidth: 480 }}>
            Every legal tool you need, unified.
          </h2>
          <p style={{ color: "#7a7d8c", maxWidth: 480, lineHeight: 1.7, marginBottom: 64, fontSize: "0.95rem" }}>
            A complete AI legal intelligence suite built for accuracy, speed, and absolute confidentiality.
          </p>
        </FadeIn>

        <div className="features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "rgba(201,168,76,0.08)" }}>
          {features.map((f, i) => (
            <FadeIn key={f.title} delay={i * 0.1}>
              <div className="feature-card" style={{ height: "100%" }}>
                <div style={{ color: "#c9a84c", marginBottom: 20 }}>{f.icon}</div>
                <div className="divider" />
                <h3 className="serif" style={{ fontSize: "1.2rem", marginBottom: 14, color: "#e8e6e1", letterSpacing: "-0.01em" }}>{f.title}</h3>
                <p style={{ color: "#7a7d8c", fontSize: "0.88rem", lineHeight: 1.75 }}>{f.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
