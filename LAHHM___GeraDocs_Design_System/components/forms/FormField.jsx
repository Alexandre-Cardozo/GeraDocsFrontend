import React from "react";

/** Label + optional hint + required asterisk wrapper for any field. */
export function FormField({ label, required, hint, children }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-label)", marginBottom: hint ? 2 : 6 }}>
        {label}
        {required && <span style={{ color: "var(--color-danger)", marginLeft: 4 }}>*</span>}
      </label>
      {hint && <p style={{ margin: "0 0 8px", fontSize: 12, color: "var(--color-text-muted)" }}>{hint}</p>}
      {children}
    </div>
  );
}
