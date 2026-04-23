import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LandingPage } from "./components/LandingPage";
import { AuthPage } from "./pages/AuthPage";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { DisclaimerPage } from "./pages/DisclaimerPage";
import { CategoryPage } from "./pages/CategoryPage";
import { ChatPage } from "./pages/ChatPage";
import { HistoryPage } from "./pages/HistoryPage";
import { ProfilePage } from "./pages/ProfilePage";

// Global keyframe animations injected once
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --navy: #07080f;
    --navy-2: #0b0d16;
    --text: #e8e6e1;
    --muted: #7a7d8c;
    --gold: #c9a84c;
    --border: rgba(201,168,76,0.14);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html { scroll-behavior: smooth; }

  body {
    background: #07080f;
    color: #e8e6e1;
    -webkit-font-smoothing: antialiased;
    font-family: 'DM Sans', sans-serif;
  }

  ::selection { background: rgba(201,168,76,0.25); color: #e8e6e1; }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.2); border-radius: 3px; }

  textarea::-webkit-scrollbar { display: none; }

  .advisor-chat-scroll::-webkit-scrollbar { display: none; }

  @keyframes msgIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes typingDot {
    0%, 80%, 100% { opacity: 0.25; transform: scale(0.8); }
    40%           { opacity: 1;    transform: scale(1); }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-16px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  .serif { font-family: 'DM Serif Display', serif; }

  .nav-link {
    color: #9a9dac;
    text-decoration: none;
    font-size: 0.82rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    transition: color 0.2s ease;
  }

  .nav-link:hover { color: var(--gold); }

  .btn-primary,
  .btn-ghost {
    border: 1px solid transparent;
    padding: 13px 30px;
    font-size: 0.88rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.25s ease;
    font-family: 'DM Sans', sans-serif;
  }

  .btn-primary {
    background: linear-gradient(135deg, #c9a84c, #e8c96f);
    color: #07080f;
    border-color: #d5b460;
  }

  .btn-primary:hover {
    filter: brightness(1.05);
    transform: translateY(-1px);
  }

  .btn-ghost {
    background: transparent;
    color: #d8d5cc;
    border-color: rgba(201,168,76,0.3);
  }

  .btn-ghost:hover {
    background: rgba(201,168,76,0.08);
    border-color: rgba(201,168,76,0.5);
  }

  .section-label {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    color: var(--gold);
    font-size: 0.74rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 18px;
  }

  .section-label::before {
    content: '';
    width: 24px;
    height: 1px;
    background: rgba(201,168,76,0.5);
  }

  .grid-lines {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: radial-gradient(circle at center, black 45%, transparent 85%);
    pointer-events: none;
  }

  .glow-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(70px);
    pointer-events: none;
  }

  .feature-card,
  .use-case-card,
  .trust-badge,
  .disclaimer-box {
    background: rgba(255,255,255,0.015);
    border: 1px solid var(--border);
  }

  .feature-card,
  .use-case-card,
  .trust-badge {
    padding: 28px;
    transition: transform 0.25s ease, border-color 0.25s ease;
  }

  .feature-card:hover,
  .use-case-card:hover,
  .trust-badge:hover {
    transform: translateY(-4px);
    border-color: rgba(201,168,76,0.35);
  }

  .divider {
    width: 42px;
    height: 1px;
    background: rgba(201,168,76,0.28);
    margin-bottom: 16px;
  }

  .disclaimer-box {
    padding: 22px 24px;
  }

  .final-cta {
    position: relative;
    overflow: hidden;
    background: linear-gradient(180deg, #0a0c14 0%, #07080f 100%);
  }

  .fade-in {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }

  .fade-in.in-view {
    opacity: 1;
    transform: translateY(0);
  }

  @media (max-width: 980px) {
    .features-grid,
    .use-cases-grid {
      grid-template-columns: repeat(2, 1fr) !important;
    }

    .steps-grid,
    .trust-grid {
      grid-template-columns: 1fr !important;
    }

    nav > div > div:last-child {
      gap: 16px !important;
    }
  }

  @media (max-width: 760px) {
    nav {
      padding: 0 16px !important;
    }

    .hero-btns {
      flex-direction: column;
      align-items: flex-start;
    }

    .features-grid,
    .use-cases-grid {
      grid-template-columns: 1fr !important;
    }

    section {
      padding-left: 20px !important;
      padding-right: 20px !important;
    }
  }
`;

export default function App() {
  return (
    <>
      <style>{globalStyles}</style>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />

            {/* Protected — all wrapped in DashboardLayout */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<DashboardPage />} />
              <Route path="disclaimer" element={<DisclaimerPage />} />
              <Route path="categories" element={<CategoryPage />} />
              <Route path="chat" element={<ChatPage />} />
              <Route path="history" element={<HistoryPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}
