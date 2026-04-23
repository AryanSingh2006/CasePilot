import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../services/categoryApi";

const ICON_BG = {
  "👨‍👩‍👧": "rgba(106,138,223,0.12)",
  "🔐":     "rgba(207,102,121,0.12)",
  "🏠":     "rgba(74,154,90,0.12)",
  "🛡️":     "rgba(201,168,76,0.12)",
  "⚖️":     "rgba(212,130,83,0.12)",
  "💼":     "rgba(160,100,200,0.12)",
};
const ICON_BORDER = {
  "👨‍👩‍👧": "rgba(106,138,223,0.3)",
  "🔐":     "rgba(207,102,121,0.3)",
  "🏠":     "rgba(74,154,90,0.3)",
  "🛡️":     "rgba(201,168,76,0.3)",
  "⚖️":     "rgba(212,130,83,0.3)",
  "💼":     "rgba(160,100,200,0.3)",
};

export function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (cat) => {
    navigate("/dashboard/chat", { state: { category: cat } });
  };

  return (
    <div style={{ padding: "36px 32px", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ marginBottom: 36, animation: "fadeUp 0.6s ease forwards" }}>
        <div className="section-label">Specialisations</div>
        <h1 className="serif" style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: "#e8e6e1", letterSpacing: "-0.02em", marginBottom: 8 }}>
          Legal Categories
        </h1>
        <p style={{ color: "#7a7d8c", fontSize: "0.88rem" }}>
          Select a category to get AI guidance tailored to that area of law.
        </p>
      </div>

      {loading && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {error && (
        <div style={{
          background: "rgba(207,102,121,0.08)", border: "1px solid rgba(207,102,121,0.25)",
          borderRadius: 10, padding: "16px 20px", color: "#cf6679", fontSize: "0.88rem",
        }}>
          ⚠ Could not load categories: {error}
        </div>
      )}

      {!loading && !error && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 18,
          animation: "fadeUp 0.6s ease 0.1s both",
        }}>
          {categories.map((cat, i) => {
            const bg = ICON_BG[cat.icon] || "rgba(201,168,76,0.08)";
            const border = ICON_BORDER[cat.icon] || "rgba(201,168,76,0.2)";
            return (
              <button
                key={cat.id}
                onClick={() => handleSelect(cat)}
                style={{
                  background: bg,
                  border: `1px solid ${border}`,
                  borderRadius: 14, padding: "26px 22px",
                  textAlign: "left", cursor: "pointer",
                  transition: "transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease",
                  animation: `fadeUp 0.5s ease ${0.07 * i + 0.2}s both`,
                  fontFamily: "'DM Sans', sans-serif",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 14px 44px rgba(0,0,0,0.4)";
                  e.currentTarget.style.borderColor = border.replace("0.3", "0.6");
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = border;
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: 14 }}>{cat.icon}</div>
                <div style={{ fontSize: "1rem", fontWeight: 600, color: "#e8e6e1", marginBottom: 6 }}>
                  {cat.name}
                </div>
                <div style={{ fontSize: "0.82rem", color: "#9a9dac", lineHeight: 1.55 }}>
                  {cat.description}
                </div>
                <div style={{
                  marginTop: 18, fontSize: "0.76rem", color: "#c9a84c",
                  letterSpacing: "0.06em", textTransform: "uppercase",
                  display: "flex", alignItems: "center", gap: 6,
                }}>
                  Ask a question <span style={{ fontSize: "0.9rem" }}>→</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div style={{
      background: "rgba(255,255,255,0.015)",
      border: "1px solid rgba(201,168,76,0.08)",
      borderRadius: 14, padding: "26px 22px",
      animation: "pulse 1.5s ease infinite",
    }}>
      <div style={{ width: 40, height: 40, background: "rgba(255,255,255,0.06)", borderRadius: 8, marginBottom: 14 }} />
      <div style={{ width: "60%", height: 14, background: "rgba(255,255,255,0.06)", borderRadius: 4, marginBottom: 8 }} />
      <div style={{ width: "90%", height: 10, background: "rgba(255,255,255,0.04)", borderRadius: 4, marginBottom: 4 }} />
      <div style={{ width: "75%", height: 10, background: "rgba(255,255,255,0.04)", borderRadius: 4 }} />
    </div>
  );
}
