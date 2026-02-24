import { FadeIn } from "./FadeIn";
import { trustItems } from "../data/content";

export function TrustSecurity() {
  return (
    <section id="security" style={{ padding: "120px 40px", background: "var(--navy)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <div className="section-label" style={{ justifyContent: "center" }}>Trust & Security</div>
            <h2 className="serif" style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)", letterSpacing: "-0.02em", marginBottom: 16 }}>
              Your data. Your control. Always.
            </h2>
            <p style={{ color: "#7a7d8c", maxWidth: 480, margin: "0 auto", fontSize: "0.9rem", lineHeight: 1.7 }}>
              Legal matters demand absolute privacy. We've built our infrastructure on that principle from day one.
            </p>
          </div>
        </FadeIn>

        <div className="trust-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "rgba(201,168,76,0.08)", marginBottom: 48 }}>
          {trustItems.map((t, i) => (
            <FadeIn key={t.title} delay={i * 0.1}>
              <div className="trust-badge" style={{ height: "100%", flexDirection: "column" }}>
                <div style={{ color: "#c9a84c", marginBottom: 16 }}>{t.icon}</div>
                <h3 style={{ fontSize: "1rem", marginBottom: 10, color: "#e8e6e1", fontWeight: 500 }}>{t.title}</h3>
                <p style={{ color: "#7a7d8c", fontSize: "0.85rem", lineHeight: 1.75 }}>{t.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn>
          <div className="disclaimer-box">
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div style={{ color: "#c9a84c", flexShrink: 0, marginTop: 2 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 18, height: 18 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
              </div>
              <div>
                <span style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#c9a84c", fontWeight: 500 }}>Important Notice</span>
                <p style={{ color: "#7a7d8c", fontSize: "0.85rem", lineHeight: 1.75, marginTop: 6 }}>
                  AI Legal Advisor provides legal information and analysis for educational and research purposes only. It does not constitute legal advice and does not create an attorney-client relationship. For matters requiring legal representation, please consult a licensed attorney in your jurisdiction.
                </p>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
