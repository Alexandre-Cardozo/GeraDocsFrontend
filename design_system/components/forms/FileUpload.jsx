import React from "react";

/** Dashed drop-zone that swaps to a file chip once a file is chosen. */
export function FileUpload({ file, onChange, placeholder = "Clique para selecionar ou arraste o arquivo", accept = ".pdf,.docx" }) {
  if (file) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#F8FAFC", border: "1px solid var(--color-border)", borderRadius: 8, padding: "10px 14px" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-royal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
        </svg>
        <span style={{ flex: 1, fontSize: 13, color: "var(--text-label)", fontWeight: 500 }}>{file}</span>
        <button onClick={() => onChange && onChange(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)", padding: 2, display: "flex" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    );
  }
  return (
    <label style={{ display: "block", cursor: "pointer" }}>
      <input type="file" accept={accept} style={{ display: "none" }}
        onChange={(e) => { const f = e.target.files && e.target.files[0]; if (f && onChange) onChange(f.name); }} />
      <div style={{ border: "2px dashed #CBD5E1", borderRadius: 8, padding: "18px 20px", textAlign: "center", background: "#FAFAFA" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 8px", display: "block" }}>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)" }}>{placeholder}</p>
        <p style={{ margin: "4px 0 0", fontSize: 11, color: "var(--color-text-muted)" }}>{accept.replace(/\./g, "").toUpperCase().replace(/,/g, ", ")}</p>
      </div>
    </label>
  );
}
