import React from "react";

/** Bordered search field with magnifier; optional ⌘K kbd chip. */
export function SearchInput({ placeholder = "Buscar...", value, onChange, kbd, width = 240, background = "#F8FAFC" }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8, background,
      border: "1px solid var(--color-border)", borderRadius: 8, padding: "0 12px", height: 36, width,
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input value={value} onChange={onChange} placeholder={placeholder}
        style={{ border: "none", background: "transparent", fontSize: 13, color: "var(--text-body)", outline: "none", width: "100%", fontFamily: "var(--font-body)" }} />
      {kbd && (
        <span style={{ fontSize: 11, color: "#CBD5E1", fontFamily: "var(--font-mono)", background: "#F1F5F9", padding: "2px 5px", borderRadius: 4 }}>{kbd}</span>
      )}
    </div>
  );
}

/** Segmented status filter: dark navy active pill inside bordered white group. */
export function FilterTabs({ options, active, onChange }) {
  return (
    <div style={{ display: "flex", gap: 6, background: "#FFFFFF", border: "1px solid var(--color-border)", borderRadius: 8, padding: 4, flexWrap: "wrap" }}>
      {options.map((f) => (
        <button key={f.key} onClick={() => onChange && onChange(f.key)}
          style={{
            padding: "5px 12px", borderRadius: 6, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer",
            background: active === f.key ? "var(--color-navy)" : "transparent",
            color: active === f.key ? "#FFFFFF" : "var(--text-secondary)",
            transition: "var(--transition-fast)", fontFamily: "var(--font-body)",
          }}>
          {f.label}
        </button>
      ))}
    </div>
  );
}
