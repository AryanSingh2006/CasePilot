import { Navbar }        from "./components/Navbar";
import { Hero }          from "./components/Hero";
import { Features }      from "./components/Features";
import { HowItWorks }    from "./components/HowItWorks";
import { UseCases }      from "./components/UseCases";
import { TrustSecurity } from "./components/TrustSecurity";
import { FinalCTA }      from "./components/FinalCTA";
import { Footer }        from "./components/Footer";

export default function App() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: "#07080f", color: "#e8e6e1", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        :root {
          --navy: #07080f;
          --navy-2: #0d1020;
          --navy-3: #131729;
          --navy-4: #1a1f35;
          --gold: #c9a84c;
          --gold-light: #e8c96f;
          --cream: #e8e6e1;
          --muted: #7a7d8c;
          --border: rgba(201,168,76,0.15);
        }

        .serif { font-family: 'DM Serif Display', Georgia, serif; }
        
        html { scroll-behavior: smooth; }

        .nav-link {
          color: var(--muted);
          text-decoration: none;
          font-size: 0.85rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          transition: color 0.2s;
        }
        .nav-link:hover { color: var(--gold-light); }

        .btn-primary {
          background: linear-gradient(135deg, #c9a84c, #e8c96f);
          color: #07080f;
          border: none;
          padding: 14px 32px;
          font-weight: 600;
          font-size: 0.9rem;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(201,168,76,0.3); opacity: 0.92; }

        .btn-ghost {
          background: transparent;
          color: var(--cream);
          border: 1px solid rgba(232,230,225,0.25);
          padding: 14px 32px;
          font-size: 0.9rem;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s, transform 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .btn-ghost:hover { border-color: var(--gold); color: var(--gold-light); transform: translateY(-2px); }

        .feature-card {
          background: var(--navy-3);
          border: 1px solid var(--border);
          padding: 36px 32px;
          transition: transform 0.3s, border-color 0.3s, box-shadow 0.3s;
        }
        .feature-card:hover {
          transform: translateY(-6px);
          border-color: rgba(201,168,76,0.4);
          box-shadow: 0 24px 64px rgba(0,0,0,0.4);
        }

        .use-case-card {
          background: var(--navy-2);
          border: 1px solid rgba(255,255,255,0.06);
          padding: 32px 28px;
          transition: border-color 0.3s, transform 0.3s;
        }
        .use-case-card:hover {
          border-color: rgba(201,168,76,0.3);
          transform: translateY(-4px);
        }

        .grid-lines {
          position: absolute;
          inset: 0;
          background-image: linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px);
          background-size: 80px 80px;
          pointer-events: none;
        }

        .glow-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
        }

        .section-label {
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .section-label::before {
          content: '';
          display: block;
          width: 28px;
          height: 1px;
          background: var(--gold);
        }

        .divider {
          width: 48px;
          height: 1px;
          background: linear-gradient(90deg, var(--gold), transparent);
          margin: 20px 0;
        }

        .step-connector {
          position: absolute;
          top: 24px;
          left: calc(100% + 0px);
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, var(--gold), rgba(201,168,76,0.1));
        }

        .trust-badge {
          background: var(--navy-3);
          border: 1px solid var(--border);
          padding: 24px 28px;
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }

        .disclaimer-box {
          border: 1px solid rgba(201,168,76,0.2);
          background: rgba(201,168,76,0.04);
          padding: 24px 32px;
        }

        .final-cta {
          background: linear-gradient(135deg, #0d1020 0%, #131729 50%, #0d1020 100%);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          position: relative;
          overflow: hidden;
        }

        footer { background: #040508; border-top: 1px solid rgba(255,255,255,0.05); }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .hero-btns { flex-direction: column; align-items: flex-start; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .use-cases-grid { grid-template-columns: 1fr 1fr !important; }
          .trust-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .use-cases-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <UseCases />
      <TrustSecurity />
      <FinalCTA />
      <Footer />
    </div>
  );
}
