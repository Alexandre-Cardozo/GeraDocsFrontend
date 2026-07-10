import type { View } from "../App"

interface Props {
  navigate: (view: View) => void
}

const docs = [
  { id: "DOC-2024-0189", process: "PROC-2024-087", title: "ETP — Fornecimento de Material de Escritório", type: "ETP", format: "DOCX + PDF", generatedAt: "03/07/2024 — 16:42", size: "284 KB", status: "final" },
  { id: "DOC-2024-0188", process: "PROC-2024-087", title: "TR — Fornecimento de Material de Escritório", type: "TR", format: "DOCX + PDF", generatedAt: "03/07/2024 — 16:40", size: "310 KB", status: "final" },
  { id: "DOC-2024-0187", process: "PROC-2024-087", title: "Cotação de Mercado — Material de Escritório", type: "Cotação", format: "DOCX + PDF", generatedAt: "03/07/2024 — 16:35", size: "196 KB", status: "final" },
  { id: "DOC-2024-0185", process: "PROC-2024-085", title: "ETP — Aquisição de Veículos Oficiais", type: "ETP", format: "DOCX + PDF", generatedAt: "01/07/2024 — 11:20", size: "398 KB", status: "final" },
  { id: "DOC-2024-0184", process: "PROC-2024-085", title: "TR — Aquisição de Veículos Oficiais", type: "TR", format: "DOCX + PDF", generatedAt: "01/07/2024 — 11:18", size: "425 KB", status: "final" },
  { id: "DOC-2024-0171", process: "PROC-2024-079", title: "ETP — Serviços de Vigilância Armada", type: "ETP", format: "DOCX + PDF", generatedAt: "25/06/2024 — 09:55", size: "266 KB", status: "rascunho" },
  { id: "DOC-2024-0168", process: "PROC-2024-078", title: "Mapa de Riscos — TI 2024", type: "Mapa", format: "PDF", generatedAt: "24/06/2024 — 14:30", size: "128 KB", status: "final" },
]

const typeColors: Record<string, { bg: string; color: string }> = {
  ETP: { bg: "#EFF6FF", color: "#1D4ED8" },
  TR: { bg: "#F0FDF4", color: "#15803D" },
  Mapa: { bg: "#FEF3C7", color: "#92400E" },
  Cotação: { bg: "#F5F3FF", color: "#6D28D9" },
}

export default function Documents({ navigate }: Props) {
  return (
    <div style={{ padding: "28px" }}>
      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24, maxWidth: 700 }}>
        {[
          { label: "Total de Documentos", value: "141", icon: "📄" },
          { label: "Gerados este Mês", value: "14", icon: "📅" },
          { label: "Armazenamento Usado", value: "51 MB", icon: "💾" },
        ].map((s) => (
          <div key={s.label} style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 12, padding: "16px 18px", display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 22 }}>{s.icon}</span>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#071A3D", fontFamily: "Plus Jakarta Sans, sans-serif", letterSpacing: "-0.8px" }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#64748B" }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ margin: 0, fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 15, fontWeight: 700, color: "#071A3D" }}>Documentos Gerados</h3>
          <div style={{ display: "flex", gap: 8 }}>
            {["ETP", "TR", "Cotação", "Mapa"].map((f) => (
              <button key={f} style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid #E2E8F0", background: "#F8FAFC", fontSize: 12, fontWeight: 600, color: "#64748B", cursor: "pointer" }}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
              {["Documento", "Processo", "Tipo", "Formato", "Gerado em", "Tamanho", "Status", ""].map((h) => (
                <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, color: "#94A3B8", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {docs.map((doc, i) => {
              const tc = typeColors[doc.type] || typeColors.ETP
              return (
                <tr
                  key={doc.id}
                  style={{ borderBottom: i < docs.length - 1 ? "1px solid #F8FAFC" : "none", cursor: "pointer", transition: "background 0.1s" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = "#F8FAFC")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = "transparent")}
                >
                  <td style={{ padding: "13px 16px" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#071A3D" }}>{doc.title}</div>
                    <div style={{ fontSize: 11, color: "#94A3B8", fontFamily: "JetBrains Mono, monospace", marginTop: 2 }}>{doc.id}</div>
                  </td>
                  <td style={{ padding: "13px 16px" }}>
                    <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "#2563EB", fontWeight: 600 }}>{doc.process}</span>
                  </td>
                  <td style={{ padding: "13px 16px" }}>
                    <span style={{ fontSize: 11, background: tc.bg, color: tc.color, borderRadius: 6, padding: "2px 9px", fontWeight: 700 }}>{doc.type}</span>
                  </td>
                  <td style={{ padding: "13px 16px", fontSize: 12, color: "#64748B" }}>{doc.format}</td>
                  <td style={{ padding: "13px 16px", fontSize: 12, color: "#64748B", whiteSpace: "nowrap" }}>{doc.generatedAt}</td>
                  <td style={{ padding: "13px 16px", fontSize: 12, fontFamily: "JetBrains Mono, monospace", color: "#94A3B8" }}>{doc.size}</td>
                  <td style={{ padding: "13px 16px" }}>
                    <span style={{
                      fontSize: 11,
                      background: doc.status === "final" ? "#ECFDF5" : "#F1F5F9",
                      color: doc.status === "final" ? "#065F46" : "#475569",
                      borderRadius: 6,
                      padding: "2px 9px",
                      fontWeight: 700,
                    }}>
                      {doc.status === "final" ? "Final" : "Rascunho"}
                    </span>
                  </td>
                  <td style={{ padding: "13px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        title="Download DOCX"
                        style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #E2E8F0", background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#2563EB" }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                      </button>
                      <button
                        title="Visualizar"
                        style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #E2E8F0", background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748B" }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Generate document CTA */}
      <div style={{ marginTop: 20, background: "linear-gradient(135deg, #071A3D 0%, #0D3B66 100%)", borderRadius: 12, padding: "24px 28px", display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 16, fontWeight: 800, color: "#FFFFFF", margin: "0 0 6px" }}>
            Gerar Novo Documento
          </h3>
          <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
            Selecione um processo com ETP ou TR concluído para gerar o documento final em DOCX e PDF.
          </p>
        </div>
        <button
          onClick={() => navigate("processes")}
          style={{
            padding: "11px 24px",
            background: "#2563EB",
            border: "none",
            borderRadius: 9,
            fontSize: 14,
            fontWeight: 700,
            color: "#FFFFFF",
            cursor: "pointer",
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Selecionar Processo
        </button>
      </div>
    </div>
  )
}
