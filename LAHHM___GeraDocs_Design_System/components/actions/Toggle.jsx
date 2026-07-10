import React from "react";

/** Pill toggle switch, 40×22, royal when on (color prop overrides). */
export function Toggle({ checked, onChange, color = "var(--color-royal)" }) {
  return (
    <button
      type="button"
      onClick={() => onChange && onChange(!checked)}
      style={{
        width: 40, height: 22, borderRadius: 999, border: "none", cursor: "pointer", padding: 0,
        background: checked ? color : "#CBD5E1", transition: "background 0.2s", position: "relative", flexShrink: 0,
      }}
    >
      <div style={{
        position: "absolute", top: 3, left: checked ? 21 : 3,
        width: 16, height: 16, borderRadius: 999, background: "#FFFFFF",
        transition: "left 0.2s", boxShadow: "var(--shadow-toggle-knob)",
      }} />
    </button>
  );
}
