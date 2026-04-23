import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getHistory } from "../services/chatApi";

const FEATURE_CARDS = [
  {
    to: "/dashboard/categories",
    icon: "🗂",
    title: "Legal Categories",
    desc: "Browse 6 specialised legal areas from Family Law to Cyber Crime.",
    color: "rgba(106,138,223,0.15)",
    border: "rgba(106,138,223,0.25)",
  },
  {
    to: "/dashboard/chat",
    icon: "💬",
    title: "AI Advisor",
    desc: "Get instant AI-powered answers to your legal questions.",
    color: "rgba(201,168,76,0.1)",
    border: "rgba(201,168,76,0.25)",
  },
  {
    to: "/dashboard/history",
    icon: "📋",
    title: "Query History",
    desc: "Review your past consultations and revisit any conversation.",
    color: "rgba(74,154,90,0.12)",
    border: "rgba(74,154,90,0.25)",
  },
  {
    to: "/dashboard/disclaimer",
    icon: "📜",
    title: "Disclaimer",
    desc: "Review and accept the legal information disclaimer to get started.",
    color: "rgba(212,130,83,0.12)",
    border: "rgba(212,130,83,0.25)",
  },
  {
    to: "/dashboard/profile",
    icon: "👤",
    title: "My Profile",
    desc: "Manage your account details and change your password.",
    color: "rgba(160,100,200,0.12)",
    border: "rgba(160,100,200,0.25)",
  },
];

export function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, loading: true });

  const firstName = user?.name?.split(" ")[0] || "Counsellor";

  useEffect(() => {
    getHistory(0, 1)
      .then(data => setStats({ total: data.totalElements ?? 0, loading: false }))
      .catch(() => setStats({ total: 0, loading: false }));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div style={{ padding: "36px 32px", maxWidth: 1100, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 40, animation: "fadeUp 0.6s ease forwards" }}>
        <div className="section-label">{greeting}</div>
        <h1 className="serif" style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", color: "#e8e6e1", letterSpacing: "-0.02em", marginBottom: 8 }}>
          Welcome back, <span style={{ color: "#c9a84c" }}>{firstName}</span>
        </h1>
        <p style={{ color: "#7a7d8c", fontSize: "0.9rem", maxWidth: 480 }}>
          Your AI-powered legal workspace. Select a feature below to get started.
        </p>
      </div>

      {/* Stats bar */}
      <div style={{
        display: "flex", gap: 16, marginBottom: 36,
        flexWrap: "wrap",
        animation: "fadeUp 0.6s ease 0.1s both",
      }}>
        {[
          {
            label: "Total Queries",
            value: stats.loading ? "—" : stats.total,
            icon: "💬",
            color: "#c9a84c",
          },
          {
            label: "Account Status",
            value: "Active",
            icon: "✅",
            color: "#4a9a5a",
          },
          {
            label: "AI Model",
            value: "Gemini 2.5",
            icon: "🤖",
            color: "#6a8adf",
          },
        ].map(stat => (
          <div key={stat.label} style={{
            flex: "1 1 160px",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(201,168,76,0.12)",
            borderRadius: 12, padding: "18px 20px",
            display: "flex", alignItems: "center", gap: 14,
          }}>
            <span style={{ fontSize: "1.4rem" }}>{stat.icon}</span>
            <div>
              <div style={{ fontSize: "1.3rem", fontWeight: 600, color: stat.color, fontFamily: "'DM Serif Display', serif" }}>
                {stat.value}
              </div>
              <div style={{ fontSize: "0.74rem", color: "#7a7d8c", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Feature cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 18,
        animation: "fadeUp 0.6s ease 0.2s both",
      }}>
        {FEATURE_CARDS.map((card, i) => (
          <button
            key={card.to}
            onClick={() => navigate(card.to)}
            style={{
              background: card.color,
              border: `1px solid ${card.border}`,
              borderRadius: 14, padding: "24px 22px",
              textAlign: "left", cursor: "pointer",
              transition: "transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease",
              animation: `fadeUp 0.5s ease ${0.08 * i + 0.25}s both`,
              fontFamily: "'DM Sans', sans-serif",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.35)";
              e.currentTarget.style.borderColor = card.border.replace("0.25", "0.55");
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = card.border;
            }}
          >
            <div style={{ fontSize: "1.8rem", marginBottom: 12 }}>{card.icon}</div>
            <div style={{ fontSize: "0.98rem", fontWeight: 600, color: "#e8e6e1", marginBottom: 6 }}>
              {card.title}
            </div>
            <div style={{ fontSize: "0.82rem", color: "#9a9dac", lineHeight: 1.55 }}>
              {card.desc}
            </div>
          </button>
        ))}
      </div>

      {/* Quick tips */}
      <div style={{
        marginTop: 36,
        background: "rgba(201,168,76,0.04)",
        border: "1px solid rgba(201,168,76,0.1)",
        borderRadius: 12, padding: "20px 24px",
        animation: "fadeUp 0.6s ease 0.5s both",
      }}>
        <div style={{ fontSize: "0.74rem", color: "#c9a84c", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
          💡 Quick Tip
        </div>
        <p style={{ fontSize: "0.85rem", color: "#9a9dac", lineHeight: 1.6 }}>
          For best results, start with <strong style={{ color: "#e8e6e1" }}>Legal Categories</strong> to give the AI context about your area of law, then ask your question in the <strong style={{ color: "#e8e6e1" }}>AI Advisor</strong>.
        </p>
      </div>
    </div>
  );
}
