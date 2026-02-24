import { FadeIn } from "./FadeIn";
import { useCases } from "../data/content";

export function UseCases() {
  return (
    <section id="use-cases" style={{ padding: "120px 40px", background: "var(--navy-2)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 64, flexWrap: "wrap", gap: 24 }}>
            <div>
              <div className="section-label">Who It's For</div>
              <h2 className="serif" style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)", letterSpacing: "-0.02em", maxWidth: 400 }}>
                Built for every legal need.
              </h2>
            </div>
            <p style={{ color: "#7a7d8c", maxWidth: 360, fontSize: "0.9rem", lineHeight: 1.7 }}>
              From first-year students to seasoned researchers — AI Legal Advisor adapts to your context and expertise.
            </p>
          </div>
        </FadeIn>

        <div className="use-cases-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {useCases.map((u, i) => (
            <FadeIn key={u.label} delay={i * 0.1}>
              <div className="use-case-card">
                <div style={{ fontSize: "1.8rem", marginBottom: 20 }}>{u.icon}</div>
                <h3 className="serif" style={{ fontSize: "1.1rem", marginBottom: 12, color: "#e8e6e1" }}>{u.label}</h3>
                <p style={{ color: "#7a7d8c", fontSize: "0.85rem", lineHeight: 1.75 }}>{u.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
