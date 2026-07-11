import React, { useState } from "react";

const icons = {
  dashboard: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>,
  processes: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>,
  approvals: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>,
  documents: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>,
  settings: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" /></svg>,
};

function NavButton({ item, isActive, onClick, dim }) {
  const [hover, setHover] = useState(false);
  const inactive = dim ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.55)";
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "9px 10px",
        borderRadius: 8, border: "none", cursor: "pointer",
        background: isActive ? "rgba(37,99,235,0.18)" : hover ? "rgba(255,255,255,0.06)" : "transparent",
        color: isActive || hover ? "#FFFFFF" : inactive,
        fontSize: 13, fontWeight: isActive ? 600 : 500, textAlign: "left",
        transition: "all 0.15s", position: "relative", marginBottom: 2, fontFamily: "var(--font-body)",
      }}
    >
      {isActive && (
        <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 3, height: 20, background: "#38BDF8", borderRadius: "0 3px 3px 0" }} />
      )}
      <span style={{ color: "inherit", display: "flex" }}>{icons[item.view] || item.icon}</span>
      <span style={{ flex: 1 }}>{item.label}</span>
      {item.badge && (
        <span style={{ background: "#EF4444", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 999, padding: "1px 6px", minWidth: 18, textAlign: "center" }}>{item.badge}</span>
      )}
    </button>
  );
}

/**
 * GeraDocs navy app sidebar: brand chip, órgão switcher, nav sections, user row.
 * Faithful port of src/components/Sidebar.tsx (wordmark updated to GeraDocs).
 */
export function Sidebar({
  currentView = "dashboard",
  navigate,
  items = [
    { view: "dashboard", label: "Dashboard" },
    { view: "processes", label: "Processos" },
    { view: "approvals", label: "Aprovações", badge: 3 },
    { view: "documents", label: "Documentos" },
  ],
  bottomItems = [{ view: "settings", label: "Configurações" }],
  orgName = "Pref. de São Paulo",
  orgUnit = "Secretaria de Compras",
  userName = "Maria Costa",
  userRole = "Servidora · Compras",
  userInitials = "MC",
}) {
  const go = (v) => navigate && navigate(v);
  return (
    <aside style={{ width: 240, minWidth: 240, background: "#071A3D", display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, background: "linear-gradient(135deg, #2563EB, #38BDF8)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "#FFFFFF", letterSpacing: "-0.3px" }}>GeraDocs</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontWeight: 500, letterSpacing: "0.5px", textTransform: "uppercase", marginTop: 1 }}>LAHHM · Gov</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 6 }}>Órgão Atual</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.06)", borderRadius: 8, padding: "8px 10px", cursor: "pointer" }}>
          <div style={{ width: 22, height: 22, background: "rgba(37,99,235,0.4)", borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2.5">
              <path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, color: "#FFFFFF", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{orgName}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{orgUnit}</div>
          </div>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
        </div>
      </div>

      <nav style={{ flex: 1, padding: "12px 12px", overflowY: "auto" }}>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", padding: "4px 8px", marginBottom: 4 }}>Principal</div>
        {items.map((item) => (
          <NavButton key={item.view} item={item} onClick={() => go(item.view)}
            isActive={currentView === item.view || (item.view === "processes" && currentView === "etp-form")} />
        ))}
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", padding: "4px 8px", marginBottom: 4, marginTop: 16 }}>Sistema</div>
        {bottomItems.map((item) => (
          <NavButton key={item.view} item={item} dim onClick={() => go(item.view)} isActive={currentView === item.view} />
        ))}
      </nav>

      <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <div style={{ width: 34, height: 34, borderRadius: 999, background: "linear-gradient(135deg, #0D3B66, #2563EB)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{userInitials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, color: "#FFFFFF", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{userName}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{userRole}</div>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2">
            <circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" />
          </svg>
        </div>
      </div>
    </aside>
  );
}
