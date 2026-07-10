import React from "react";

const base = {
  width: "100%", padding: "10px 13px", border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-md)", fontSize: 14, color: "var(--text-body)",
  background: "#FFFFFF", outline: "none", fontFamily: "var(--font-body)", boxSizing: "border-box",
};

/** Text input. `prefix` renders a bold slate prefix (e.g. "R$"). */
export function Input({ prefix, style, ...rest }) {
  if (prefix) {
    return (
      <div style={{ position: "relative" }}>
        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "var(--color-slate)", fontWeight: 600 }}>{prefix}</span>
        <input style={{ ...base, paddingLeft: 32, ...style }} {...rest} />
      </div>
    );
  }
  return <input style={{ ...base, ...style }} {...rest} />;
}

/** Multiline textarea, 1.6 line-height. */
export function Textarea({ rows = 4, style, ...rest }) {
  return <textarea rows={rows} style={{ ...base, padding: "12px 14px", resize: "vertical", lineHeight: 1.6, ...style }} {...rest} />;
}

/** Native select styled to match inputs. */
export function Select({ options = [], placeholder, style, ...rest }) {
  return (
    <select style={{ ...base, ...style }} {...rest}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}
