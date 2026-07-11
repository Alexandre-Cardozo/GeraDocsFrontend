import React from "react";
import { SearchInput } from "../forms/SearchInput.jsx";
import { Button } from "../actions/Button.jsx";

/** 60px white top bar: page title, ⌘K search, bell, optional primary CTA. */
export function Header({ title, cta, onCta, children }) {
  return (
    <header style={{
      height: 60, background: "#FFFFFF", borderBottom: "1px solid var(--color-border)",
      display: "flex", alignItems: "center", padding: "0 28px", gap: 16, flexShrink: 0,
    }}>
      <div style={{ flex: 1 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700, color: "var(--text-body)", margin: 0, letterSpacing: "-0.3px" }}>{title}</h1>
      </div>
      <SearchInput placeholder="Buscar processo, documento..." kbd="⌘K" />
      <button style={{
        width: 36, height: 36, borderRadius: 8, border: "1px solid var(--color-border)", background: "#F8FAFC",
        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", flexShrink: 0,
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        <div style={{ position: "absolute", top: 7, right: 7, width: 7, height: 7, background: "#EF4444", borderRadius: 999, border: "2px solid #F8FAFC" }} />
      </button>
      {cta && (
        <Button variant="primary" size="md" onClick={onCta}
          icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>}>
          {cta}
        </Button>
      )}
      {children}
    </header>
  );
}
