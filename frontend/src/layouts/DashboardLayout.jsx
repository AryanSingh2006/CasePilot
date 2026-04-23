import { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { to: "/dashboard",             icon: "⊞", label: "Dashboard",   exact: true },
  { to: "/dashboard/categories",  icon: "🗂",  label: "Categories"  },
  { to: "/dashboard/chat",        icon: "💬", label: "AI Advisor"  },
  { to: "/dashboard/history",     icon: "📋", label: "History"     },
  { to: "/dashboard/disclaimer",  icon: "📜", label: "Disclaimer"  },
  { to: "/dashboard/profile",     icon: "👤", label: "Profile"     },
];

const LOGO_SVG = (
  <div style={{
    width: 32, height: 32, borderRadius: 6,
    background: "linear-gradient(135deg, #c9a84c, #e8c96f)",
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
  }}>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#07080f" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" />
    </svg>
  </div>
);

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/auth", { replace: true });
  };

  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const sidebarWidth = collapsed ? 68 : 240;

  return (
    <div style={{ display: "flex", height: "100vh", background: "#07080f", color: "#e8e6e1", overflow: "hidden" }}>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
            zIndex: 50, backdropFilter: "blur(4px)",
            display: "none",
          }}
          className="mobile-overlay"
        />
      )}

      {/* Sidebar */}
      <aside style={{
        width: sidebarWidth,
        minWidth: sidebarWidth,
        height: "100vh",
        background: "linear-gradient(180deg, #0b0d18 0%, #07080f 100%)",
        borderRight: "1px solid rgba(201,168,76,0.1)",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.25s ease, min-width 0.25s ease",
        overflow: "hidden",
        position: "relative",
        zIndex: 20,
        flexShrink: 0,
      }}>
        {/* Logo row */}
        <div style={{
          height: 64,
          display: "flex",
          alignItems: "center",
          padding: collapsed ? "0 18px" : "0 20px",
          gap: 12,
          borderBottom: "1px solid rgba(201,168,76,0.08)",
          flexShrink: 0,
          justifyContent: collapsed ? "center" : "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {LOGO_SVG}
            {!collapsed && (
              <span className="serif" style={{ fontSize: "1.05rem", color: "#e8e6e1", letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>
                CasePilot
              </span>
            )}
          </div>
          {!collapsed && (
            <button onClick={() => setCollapsed(true)} style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#7a7d8c", fontSize: "0.85rem", padding: "4px 6px",
              borderRadius: 4, transition: "color 0.2s",
            }}
              onMouseEnter={e => e.target.style.color = "#c9a84c"}
              onMouseLeave={e => e.target.style.color = "#7a7d8c"}
            >◀</button>
          )}
          {collapsed && (
            <button onClick={() => setCollapsed(false)} style={{
              position: "absolute", right: -12, top: "50%", transform: "translateY(-50%)",
              background: "#0b0d18", border: "1px solid rgba(201,168,76,0.2)",
              borderRadius: "50%", width: 24, height: 24, cursor: "pointer",
              color: "#c9a84c", fontSize: "0.65rem", display: "flex",
              alignItems: "center", justifyContent: "center",
            }}>▶</button>
          )}
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, overflowY: "auto", padding: "16px 0" }}>
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: collapsed ? "12px 0" : "11px 20px",
                margin: "2px 8px",
                borderRadius: 8,
                textDecoration: "none",
                fontSize: "0.85rem",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 400,
                letterSpacing: "0.01em",
                color: isActive ? "#c9a84c" : "#9a9dac",
                background: isActive
                  ? "rgba(201,168,76,0.1)"
                  : "transparent",
                borderLeft: isActive ? "2px solid #c9a84c" : "2px solid transparent",
                transition: "all 0.2s ease",
                justifyContent: collapsed ? "center" : "flex-start",
                position: "relative",
              })}
            >
              <span style={{ fontSize: "1rem", flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
              {collapsed && (
                <span style={{
                  position: "absolute", left: "100%", marginLeft: 12,
                  background: "#1a1e2e", border: "1px solid rgba(201,168,76,0.2)",
                  padding: "5px 10px", borderRadius: 6, fontSize: "0.8rem",
                  whiteSpace: "nowrap", color: "#e8e6e1", pointerEvents: "none",
                  opacity: 0, transition: "opacity 0.2s",
                }} className="tooltip">{item.label}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User area */}
        <div style={{
          borderTop: "1px solid rgba(201,168,76,0.08)",
          padding: collapsed ? "16px 0" : "16px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          justifyContent: collapsed ? "center" : "flex-start",
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "linear-gradient(135deg, #c9a84c, #e8c96f)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.82rem", fontWeight: 700, color: "#07080f", flexShrink: 0,
          }}>{initials}</div>
          {!collapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 500, color: "#e8e6e1", truncate: true, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user?.name || "User"}
              </div>
              <div style={{ fontSize: "0.72rem", color: "#7a7d8c", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user?.email || ""}
              </div>
            </div>
          )}
          {!collapsed && (
            <button onClick={handleLogout} title="Logout" style={{
              background: "none", border: "1px solid rgba(201,168,76,0.15)",
              borderRadius: 6, color: "#7a7d8c", cursor: "pointer",
              padding: "5px 8px", fontSize: "0.75rem", transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.color = "#cf6679"; e.currentTarget.style.borderColor = "rgba(207,102,121,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#7a7d8c"; e.currentTarget.style.borderColor = "rgba(201,168,76,0.15)"; }}
            >↪</button>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        {/* Top bar */}
        <header style={{
          height: 64,
          borderBottom: "1px solid rgba(201,168,76,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 28px",
          background: "rgba(11,13,24,0.5)",
          backdropFilter: "blur(12px)",
          flexShrink: 0,
        }}>
          <div style={{ fontSize: "0.8rem", color: "#7a7d8c", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            {NAV_ITEMS.find(i => i.to === location.pathname)?.label || "Dashboard"}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "rgba(201,168,76,0.06)",
              border: "1px solid rgba(201,168,76,0.12)",
              borderRadius: 8, padding: "6px 12px",
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%",
                background: "#4a9a5a", boxShadow: "0 0 6px rgba(74,154,90,0.6)",
              }} />
              <span style={{ fontSize: "0.78rem", color: "#9a9dac" }}>Live</span>
            </div>
            <button onClick={handleLogout} style={{
              background: "transparent", border: "1px solid rgba(201,168,76,0.15)",
              borderRadius: 8, color: "#9a9dac", cursor: "pointer",
              padding: "7px 14px", fontSize: "0.78rem", letterSpacing: "0.04em",
              fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.color = "#cf6679"; e.currentTarget.style.borderColor = "rgba(207,102,121,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#9a9dac"; e.currentTarget.style.borderColor = "rgba(201,168,76,0.15)"; }}
            >Logout</button>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
