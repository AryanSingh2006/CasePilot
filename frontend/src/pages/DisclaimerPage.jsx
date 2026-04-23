import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../hooks/useToast";
import { ToastContainer } from "../components/ToastContainer";
import * as disclaimerApi from "../services/disclaimerApi";

export function DisclaimerPage() {
  const [accepted, setAccepted] = useState(null); // null = loading
  const [accepting, setAccepting] = useState(false);
  const navigate = useNavigate();
  const { toasts, toast, removeToast } = useToast();

  useEffect(() => {
    disclaimerApi.getDisclaimerStatus()
      .then(data => setAccepted(data.accepted ?? false))
      .catch(() => setAccepted(false));
  }, []);

  const handleAccept = async () => {
    setAccepting(true);
    try {
      await disclaimerApi.acceptDisclaimer();
      setAccepted(true);
      toast.success("Disclaimer accepted. You can now use all features.");
    } catch {
      toast.error("Failed to record acceptance. Please try again.");
    } finally {
      setAccepting(false);
    }
  };

  if (accepted === null) {
    return (
      <div style={{ height: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid rgba(201,168,76,0.15)", borderTopColor: "#c9a84c", animation: "spin 0.8s linear infinite" }} />
      </div>
    );
  }

  return (
    <div style={{ padding: "36px 32px", maxWidth: 760, margin: "0 auto" }}>
      <div style={{ marginBottom: 32, animation: "fadeUp 0.6s ease forwards" }}>
        <div className="section-label">Legal Notice</div>
        <h1 className="serif" style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: "#e8e6e1", letterSpacing: "-0.02em" }}>
          Disclaimer & Terms of Use
        </h1>
      </div>

      {/* Status badge */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        background: accepted ? "rgba(74,154,90,0.12)" : "rgba(212,130,83,0.12)",
        border: `1px solid ${accepted ? "rgba(74,154,90,0.3)" : "rgba(212,130,83,0.3)"}`,
        borderRadius: 8, padding: "8px 16px", marginBottom: 28,
        fontSize: "0.82rem",
        animation: "fadeUp 0.6s ease 0.1s both",
      }}>
        <div style={{
          width: 8, height: 8, borderRadius: "50%",
          background: accepted ? "#4a9a5a" : "#d48253",
        }} />
        <span style={{ color: accepted ? "#6dbf7a" : "#e0965a" }}>
          {accepted ? "Disclaimer accepted" : "Acceptance required"}
        </span>
      </div>

      {/* Main content */}
      <div style={{
        background: "rgba(255,255,255,0.018)",
        border: "1px solid rgba(201,168,76,0.14)",
        borderRadius: 14, padding: "28px 30px",
        lineHeight: 1.8, fontSize: "0.88rem", color: "#b8b5ad",
        animation: "fadeUp 0.6s ease 0.15s both",
      }}>
        {SECTIONS.map(({ heading, body }) => (
          <div key={heading} style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: "0.82rem", color: "#c9a84c", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
              {heading}
            </h3>
            <p>{body}</p>
          </div>
        ))}
      </div>

      {/* Action */}
      <div style={{
        marginTop: 28, display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center",
        animation: "fadeUp 0.6s ease 0.25s both",
      }}>
        {accepted ? (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#6dbf7a", fontSize: "0.88rem" }}>
              <span style={{ fontSize: "1.1rem" }}>✓</span>
              You have accepted this disclaimer.
            </div>
            <button
              onClick={() => navigate("/dashboard/chat")}
              className="btn-primary"
              style={{ padding: "12px 28px", fontSize: "0.84rem" }}
            >
              Open AI Advisor →
            </button>
          </>
        ) : (
          <>
            <p style={{ fontSize: "0.8rem", color: "#7a7d8c", flex: "1 1 200px" }}>
              You must accept this disclaimer before using CasePilot's AI features.
            </p>
            <button
              id="disclaimer-accept-btn"
              onClick={handleAccept}
              disabled={accepting}
              className="btn-primary"
              style={{ padding: "13px 32px", fontSize: "0.84rem", opacity: accepting ? 0.6 : 1 }}
            >
              {accepting ? "Recording..." : "Accept & Continue"}
            </button>
          </>
        )}
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

const SECTIONS = [
  {
    heading: "1. No Attorney-Client Relationship",
    body: "CasePilot is an AI-powered information platform. Nothing on this platform constitutes legal advice, and no attorney-client relationship is formed through your use of this service. The information provided is for general educational purposes only.",
  },
  {
    heading: "2. Not a Substitute for Legal Counsel",
    body: "The AI-generated responses on CasePilot do not replace the advice of a qualified lawyer. Legal matters are complex and jurisdiction-specific. Always consult a licensed attorney for advice tailored to your specific circumstances before making any legal decisions.",
  },
  {
    heading: "3. Accuracy & Completeness",
    body: "While we strive to provide accurate information, laws change frequently and may vary by jurisdiction. CasePilot makes no warranties, express or implied, regarding the accuracy, completeness, or reliability of any information provided by the AI.",
  },
  {
    heading: "4. Jurisdiction Limitations",
    body: "CasePilot may reference laws from various jurisdictions including India. The platform is designed for informational purposes only. Laws specific to your location may differ significantly from the general guidance provided.",
  },
  {
    heading: "5. Data & Privacy",
    body: "Queries submitted to CasePilot are processed via cloud-based AI services. Do not submit sensitive personal information, confidential case details, or privileged communications through this platform. Treat all interactions as non-confidential.",
  },
  {
    heading: "6. Limitation of Liability",
    body: "CasePilot and its developers shall not be liable for any damages or losses arising from your use or reliance on information obtained through this platform. By using CasePilot, you agree to indemnify and hold harmless the platform from any claims related to such use.",
  },
];
