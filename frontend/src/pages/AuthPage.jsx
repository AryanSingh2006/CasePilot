import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import { ToastContainer } from "../components/ToastContainer";
import * as authApi from "../services/authApi";

export function AuthPage() {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toasts, toast, removeToast } = useToast();

  const update = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    if (!form.email.includes("@")) return "Please enter a valid email address.";
    if (form.password.length < 6) return "Password must be at least 6 characters.";
    if (mode === "register") {
      if (!form.name.trim()) return "Please enter your full name.";
      if (form.password !== form.confirm) return "Passwords do not match.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { toast.error(err); return; }

    setLoading(true);
    try {
      let data;
      if (mode === "register") {
        data = await authApi.register({ name: form.name, email: form.email, password: form.password });
        toast.success("Account created successfully!");
      } else {
        data = await authApi.login({ email: form.email, password: form.password });
        toast.success("Welcome back!");
      }
      login(data.token, data.user);
      const redirectPath = mode === "register" ? "/dashboard/disclaimer" : "/dashboard";
      setTimeout(() => navigate(redirectPath, { replace: true }), 400);
    } catch (err) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (m) => {
    setMode(m);
    setForm({ name: "", email: "", password: "", confirm: "" });
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#07080f",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px 16px", position: "relative", overflow: "hidden",
    }}>
      {/* Background orbs */}
      <div style={{ position: "absolute", top: "10%", left: "20%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", right: "15%", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 440, position: "relative", zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: "linear-gradient(135deg, #c9a84c, #e8c96f)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#07080f" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" />
              </svg>
            </div>
            <span className="serif" style={{ fontSize: "1.4rem", color: "#e8e6e1" }}>CasePilot</span>
          </Link>
          <p style={{ fontSize: "0.82rem", color: "#7a7d8c", marginTop: 10, letterSpacing: "0.04em" }}>
            {mode === "login" ? "Sign in to your legal workspace" : "Create your free account"}
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "rgba(255,255,255,0.018)",
          border: "1px solid rgba(201,168,76,0.14)",
          borderRadius: 16, overflow: "hidden",
          backdropFilter: "blur(20px)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
        }}>
          {/* Tab toggle */}
          <div style={{ display: "flex", borderBottom: "1px solid rgba(201,168,76,0.1)" }}>
            {["login", "register"].map(m => (
              <button key={m} onClick={() => switchMode(m)} style={{
                flex: 1, padding: "16px", background: "none", border: "none",
                fontSize: "0.83rem", letterSpacing: "0.06em", textTransform: "uppercase",
                fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
                color: mode === m ? "#c9a84c" : "#7a7d8c",
                borderBottom: mode === m ? "2px solid #c9a84c" : "2px solid transparent",
                transition: "all 0.2s ease",
                fontWeight: mode === m ? 500 : 400,
              }}>
                {m === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ padding: "28px 28px 24px" }}>
            {mode === "register" && (
              <FieldGroup label="Full Name" id="auth-name">
                <input
                  id="auth-name"
                  type="text"
                  placeholder="Jane Pereira"
                  value={form.name}
                  onChange={update("name")}
                  required
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "rgba(201,168,76,0.45)"}
                  onBlur={e => e.target.style.borderColor = "rgba(201,168,76,0.18)"}
                />
              </FieldGroup>
            )}

            <FieldGroup label="Email Address" id="auth-email">
              <input
                id="auth-email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={update("email")}
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "rgba(201,168,76,0.45)"}
                onBlur={e => e.target.style.borderColor = "rgba(201,168,76,0.18)"}
              />
            </FieldGroup>

            <FieldGroup label="Password" id="auth-password">
              <input
                id="auth-password"
                type="password"
                placeholder={mode === "register" ? "Min. 6 characters" : "••••••••"}
                value={form.password}
                onChange={update("password")}
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "rgba(201,168,76,0.45)"}
                onBlur={e => e.target.style.borderColor = "rgba(201,168,76,0.18)"}
              />
            </FieldGroup>

            {mode === "register" && (
              <FieldGroup label="Confirm Password" id="auth-confirm">
                <input
                  id="auth-confirm"
                  type="password"
                  placeholder="Repeat password"
                  value={form.confirm}
                  onChange={update("confirm")}
                  required
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "rgba(201,168,76,0.45)"}
                  onBlur={e => e.target.style.borderColor = "rgba(201,168,76,0.18)"}
                />
              </FieldGroup>
            )}

            <button
              id="auth-submit"
              type="submit"
              disabled={loading}
              style={{
                width: "100%", marginTop: 8,
                background: loading ? "rgba(201,168,76,0.4)" : "linear-gradient(135deg, #c9a84c, #e8c96f)",
                border: "none", borderRadius: 10,
                color: "#07080f", padding: "14px",
                fontSize: "0.88rem", fontWeight: 600,
                letterSpacing: "0.05em", textTransform: "uppercase",
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "'DM Sans', sans-serif",
                transition: "all 0.25s ease",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              {loading && (
                <div style={{
                  width: 16, height: 16, borderRadius: "50%",
                  border: "2px solid rgba(7,8,15,0.3)",
                  borderTopColor: "#07080f",
                  animation: "spin 0.8s linear infinite",
                }} />
              )}
              {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          {/* Footer link */}
          <div style={{ textAlign: "center", padding: "0 28px 24px", fontSize: "0.8rem", color: "#7a7d8c" }}>
            {mode === "login" ? (
              <>Don't have an account?{" "}
                <button onClick={() => switchMode("register")} style={{ background: "none", border: "none", color: "#c9a84c", cursor: "pointer", fontSize: "0.8rem", fontFamily: "'DM Sans', sans-serif" }}>
                  Register here
                </button>
              </>
            ) : (
              <>Already have an account?{" "}
                <button onClick={() => switchMode("login")} style={{ background: "none", border: "none", color: "#c9a84c", cursor: "pointer", fontSize: "0.8rem", fontFamily: "'DM Sans', sans-serif" }}>
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>

        {/* Disclaimer note */}
        <p style={{ textAlign: "center", fontSize: "0.72rem", color: "#4a4d5c", marginTop: 20, lineHeight: 1.6 }}>
          By continuing, you acknowledge CasePilot provides general legal information only — not legal advice.
        </p>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

function FieldGroup({ label, id, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label htmlFor={id} style={{ display: "block", fontSize: "0.78rem", color: "#9a9dac", letterSpacing: "0.05em", marginBottom: 7, textTransform: "uppercase" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%", background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(201,168,76,0.18)", borderRadius: 8,
  color: "#e8e6e1", padding: "12px 14px",
  fontSize: "0.88rem", fontFamily: "'DM Sans', sans-serif",
  outline: "none", transition: "border-color 0.2s ease",
};
