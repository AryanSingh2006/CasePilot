import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import { ToastContainer } from "../components/ToastContainer";
import { updateProfile, changePassword } from "../services/userApi";

export function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const { toasts, toast, removeToast } = useToast();

  const [profileForm, setProfileForm] = useState({ name: user?.name || "" });
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [profileLoading, setProfileLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("profile"); // "profile" | "password"

  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) { toast.error("Name cannot be empty."); return; }
    setProfileLoading(true);
    try {
      const updated = await updateProfile({ name: profileForm.name.trim() });
      updateUser({ name: updated.name });
      toast.success("Profile updated successfully.");
    } catch (err) {
      toast.error(err.message || "Failed to update profile.");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword.length < 6) { toast.error("New password must be at least 6 characters."); return; }
    if (pwForm.newPassword !== pwForm.confirm) { toast.error("Passwords do not match."); return; }
    setPwLoading(true);
    try {
      await changePassword({
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      setPwForm({ currentPassword: "", newPassword: "", confirm: "" });
      toast.success("Password changed successfully.");
    } catch (err) {
      toast.error(err.message || "Failed to change password.");
    } finally {
      setPwLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/auth", { replace: true });
  };

  return (
    <div style={{ padding: "36px 32px", maxWidth: 700, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 32, animation: "fadeUp 0.5s ease forwards" }}>
        <div className="section-label">Account</div>
        <h1 className="serif" style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: "#e8e6e1", letterSpacing: "-0.02em" }}>
          My Profile
        </h1>
      </div>

      {/* Avatar + info row */}
      <div style={{
        display: "flex", alignItems: "center", gap: 18,
        background: "rgba(255,255,255,0.018)", border: "1px solid rgba(201,168,76,0.14)",
        borderRadius: 14, padding: "22px 24px", marginBottom: 24,
        animation: "fadeUp 0.5s ease 0.08s both",
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: "50%", flexShrink: 0,
          background: "linear-gradient(135deg, #c9a84c, #e8c96f)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.2rem", fontWeight: 700, color: "#07080f",
        }}>{initials}</div>
        <div>
          <div style={{ fontSize: "1rem", fontWeight: 600, color: "#e8e6e1" }}>{user?.name || "Unknown"}</div>
          <div style={{ fontSize: "0.82rem", color: "#7a7d8c", marginTop: 3 }}>{user?.email || ""}</div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            marginLeft: "auto", background: "rgba(207,102,121,0.08)",
            border: "1px solid rgba(207,102,121,0.25)", borderRadius: 8,
            color: "#cf6679", cursor: "pointer", padding: "9px 18px",
            fontSize: "0.8rem", fontFamily: "'DM Sans', sans-serif",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(207,102,121,0.15)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(207,102,121,0.08)"}
        >
          Sign Out
        </button>
      </div>

      {/* Tab switcher */}
      <div style={{
        display: "flex", borderBottom: "1px solid rgba(201,168,76,0.1)",
        marginBottom: 24, animation: "fadeUp 0.5s ease 0.12s both",
      }}>
        {[["profile", "Edit Profile"], ["password", "Change Password"]].map(([key, label]) => (
          <button key={key} onClick={() => setActiveSection(key)} style={{
            padding: "10px 20px", background: "none", border: "none",
            fontSize: "0.82rem", letterSpacing: "0.04em",
            fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
            color: activeSection === key ? "#c9a84c" : "#7a7d8c",
            borderBottom: activeSection === key ? "2px solid #c9a84c" : "2px solid transparent",
            transition: "all 0.2s",
          }}>{label}</button>
        ))}
      </div>

      {/* Profile Section */}
      {activeSection === "profile" && (
        <form onSubmit={handleProfileSave} style={{ animation: "fadeUp 0.4s ease forwards" }}>
          <div style={{
            background: "rgba(255,255,255,0.018)", border: "1px solid rgba(201,168,76,0.12)",
            borderRadius: 12, padding: "24px",
          }}>
            <FieldGroup label="Full Name" id="profile-name">
              <input
                id="profile-name"
                type="text"
                value={profileForm.name}
                onChange={e => setProfileForm({ name: e.target.value })}
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "rgba(201,168,76,0.45)"}
                onBlur={e => e.target.style.borderColor = "rgba(201,168,76,0.18)"}
              />
            </FieldGroup>

            <FieldGroup label="Email Address" id="profile-email">
              <input
                id="profile-email"
                type="email"
                value={user?.email || ""}
                disabled
                style={{ ...inputStyle, opacity: 0.5, cursor: "not-allowed" }}
              />
              <p style={{ fontSize: "0.72rem", color: "#7a7d8c", marginTop: 5 }}>
                Email address cannot be changed.
              </p>
            </FieldGroup>

            <button
              id="profile-save-btn"
              type="submit"
              disabled={profileLoading}
              className="btn-primary"
              style={{ padding: "12px 28px", fontSize: "0.84rem", opacity: profileLoading ? 0.6 : 1 }}
            >
              {profileLoading ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      )}

      {/* Password Section */}
      {activeSection === "password" && (
        <form onSubmit={handlePasswordSave} style={{ animation: "fadeUp 0.4s ease forwards" }}>
          <div style={{
            background: "rgba(255,255,255,0.018)", border: "1px solid rgba(201,168,76,0.12)",
            borderRadius: 12, padding: "24px",
          }}>
            <FieldGroup label="Current Password" id="pw-current">
              <input
                id="pw-current"
                type="password"
                placeholder="Enter current password"
                value={pwForm.currentPassword}
                onChange={e => setPwForm(f => ({ ...f, currentPassword: e.target.value }))}
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "rgba(201,168,76,0.45)"}
                onBlur={e => e.target.style.borderColor = "rgba(201,168,76,0.18)"}
              />
            </FieldGroup>

            <FieldGroup label="New Password" id="pw-new">
              <input
                id="pw-new"
                type="password"
                placeholder="Min. 6 characters"
                value={pwForm.newPassword}
                onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))}
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "rgba(201,168,76,0.45)"}
                onBlur={e => e.target.style.borderColor = "rgba(201,168,76,0.18)"}
              />
            </FieldGroup>

            <FieldGroup label="Confirm New Password" id="pw-confirm">
              <input
                id="pw-confirm"
                type="password"
                placeholder="Repeat new password"
                value={pwForm.confirm}
                onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))}
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "rgba(201,168,76,0.45)"}
                onBlur={e => e.target.style.borderColor = "rgba(201,168,76,0.18)"}
              />
            </FieldGroup>

            <button
              id="pw-save-btn"
              type="submit"
              disabled={pwLoading}
              className="btn-primary"
              style={{ padding: "12px 28px", fontSize: "0.84rem", opacity: pwLoading ? 0.6 : 1 }}
            >
              {pwLoading ? "Updating…" : "Update Password"}
            </button>
          </div>
        </form>
      )}

      {/* Danger zone */}
      <div style={{
        marginTop: 28,
        background: "rgba(207,102,121,0.04)", border: "1px solid rgba(207,102,121,0.15)",
        borderRadius: 10, padding: "18px 22px",
        animation: "fadeUp 0.5s ease 0.2s both",
      }}>
        <div style={{ fontSize: "0.8rem", color: "#cf6679", marginBottom: 8, fontWeight: 600 }}>Danger Zone</div>
        <p style={{ fontSize: "0.8rem", color: "#7a7d8c", marginBottom: 12 }}>
          Signing out removes your session from this device.
        </p>
        <button onClick={handleLogout} style={{
          background: "none", border: "1px solid rgba(207,102,121,0.3)",
          borderRadius: 7, color: "#cf6679", cursor: "pointer",
          padding: "8px 18px", fontSize: "0.8rem", fontFamily: "'DM Sans', sans-serif",
          transition: "all 0.2s",
        }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(207,102,121,0.08)"}
          onMouseLeave={e => e.currentTarget.style.background = "none"}
        >Sign Out of CasePilot</button>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

function FieldGroup({ label, id, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label htmlFor={id} style={{ display: "block", fontSize: "0.76rem", color: "#9a9dac", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 7 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(201,168,76,0.18)",
  borderRadius: 8, color: "#e8e6e1",
  padding: "12px 14px",
  fontSize: "0.88rem",
  fontFamily: "'DM Sans', sans-serif",
  outline: "none",
  transition: "border-color 0.2s ease",
};
