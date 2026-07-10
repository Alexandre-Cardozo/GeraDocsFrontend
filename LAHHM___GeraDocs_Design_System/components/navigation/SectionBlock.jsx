import React from "react";

/** White card wrapping a form section: display-font title, hint, soft divider. */
export function SectionBlock({ title, hint, children }) {
  return (
    <div style={{ background: "var(--surface-card)", border: "var(--border-default)", borderRadius: "var(--radius-card)", padding: "20px 22px" }}>
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "var(--text-body)", margin: "0 0 6px" }}>{title}</h3>
      {hint && <p style={{ margin: "0 0 16px", fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>{hint}</p>}
      <div style={{ borderTop: "1px solid var(--color-border-soft)", paddingTop: 16 }}>{children}</div>
    </div>
  );
}

/** White card with header row (title + action slot) — tables/lists container. */
export function CardPanel({ title, action, children, padding = 0 }) {
  return (
    <div style={{ background: "var(--surface-card)", border: "var(--border-default)", borderRadius: "var(--radius-card)", overflow: "hidden" }}>
      {title && (
        <div style={{ padding: "18px 20px", borderBottom: "1px solid var(--color-border-soft)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "var(--text-body)" }}>{title}</h3>
          {action}
        </div>
      )}
      <div style={{ padding }}>{children}</div>
    </div>
  );
}
