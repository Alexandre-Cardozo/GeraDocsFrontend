import React from "react";

const cfg = {
  ok: { bg: "#ECFDF5", color: "#065F46", icon: "✓" },
  warn: { bg: "#FFFBEB", color: "#92400E", icon: "!" },
  error: { bg: "#FEF2F2", color: "#991B1B", icon: "✕" },
};

/** Inline validation message under form fields. */
export function ValidationMsg({ type = "ok", msg }) {
  const c = cfg[type];
  return (
    <div style={{ background: c.bg, borderRadius: 7, padding: "8px 12px", marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ color: c.color, fontWeight: 700, fontSize: 13 }}>{c.icon}</span>
      <span style={{ fontSize: 12, color: c.color, fontWeight: 500 }}>{msg}</span>
    </div>
  );
}

/** Bordered info banner (blue/amber/red/green) with icon slot. */
export function InfoBanner({ tone = "info", children }) {
  const tones = {
    info: { bg: "#EFF6FF", border: "#BFDBFE", color: "#1D4ED8" },
    warning: { bg: "#FFFBEB", border: "#FDE68A", color: "#92400E" },
    danger: { bg: "#FEF2F2", border: "#FECACA", color: "#991B1B" },
    success: { bg: "#ECFDF5", border: "#A7F3D0", color: "#065F46" },
  };
  const c = tones[tone] || tones.info;
  return (
    <div style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 10, padding: "12px 14px", display: "flex", gap: 10, alignItems: "flex-start" }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <div style={{ margin: 0, fontSize: 13, color: c.color }}>{children}</div>
    </div>
  );
}
