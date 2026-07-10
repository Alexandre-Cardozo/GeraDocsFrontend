import React from "react";

/** Numbered wizard step indicator with green completed / royal active circles. */
export function StepIndicator({ steps, current }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
      {steps.map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 999,
              background: current > i + 1 ? "var(--color-success)" : current === i + 1 ? "var(--color-royal)" : "var(--color-border)",
              color: current >= i + 1 ? "#FFFFFF" : "var(--color-text-muted)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700, flexShrink: 0, transition: "var(--transition-slow)",
            }}>
              {current > i + 1 ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : i + 1}
            </div>
            <span style={{ fontSize: 13, fontWeight: current === i + 1 ? 700 : 500, color: current === i + 1 ? "var(--text-body)" : "var(--color-text-muted)", fontFamily: "var(--font-body)" }}>
              {s}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div style={{ width: 60, height: 2, background: current > i + 1 ? "var(--color-success)" : "var(--color-border)", margin: "0 12px", transition: "background 0.2s" }} />
          )}
        </div>
      ))}
    </div>
  );
}
