import { useState } from "react"
import type { View } from "../App"
import StatusBadge from "../components/StatusBadge"

interface Props {
  navigate: (view: View, id?: string) => void
}

type Status = "rascunho" | "em_revisao" | "aguardando" | "aprovado" | "rejeitado" | "concluido"

const allProcesses = [
  { id: "PROC-2024-089", title: "Aquisição de Equipamentos de TI", secretaria: "Secretaria de Educação", modalidade: "Pregão Eletrônico", status: "em_revisao" as Status, valor: "R$ 485.000,00", etp: "Completo", tr: "Em andamento", responsavel: "Maria Costa", date: "05/07/2024" },
  { id: "PROC-2024-088", title: "Contratação de Serviços de Limpeza", secretaria: "Secretaria de Obras", modalidade: "Pregão Eletrônico", status: "aguardando" as Status, valor: "R$ 120.000,00", etp: "Completo", tr: "Completo", responsavel: "João Silva", date: "04/07/2024" },
  { id: "PROC-2024-087", title: "Fornecimento de Material de Escritório", secretaria: "Administração Central", modalidade: "Dispensa", status: "aprovado" as Status, valor: "R$ 38.500,00", etp: "Completo", tr: "Completo", responsavel: "Ana Oliveira", date: "03/07/2024" },
  { id: "PROC-2024-086", title: "Serviços de Manutenção Predial", secretaria: "Secretaria de Saúde", modalidade: "Concorrência", status: "rascunho" as Status, valor: "R$ 210.000,00", etp: "Em andamento", tr: "Não iniciado", responsavel: "Carlos Lima", date: "02/07/2024" },
  { id: "PROC-2024-085", title: "Aquisição de Veículos Oficiais", secretaria: "Frota Municipal", modalidade: "Pregão Eletrônico", status: "concluido" as Status, valor: "R$ 920.000,00", etp: "Completo", tr: "Completo", responsavel: "Maria Costa", date: "01/07/2024" },
  { id: "PROC-2024-084", title: "Sistema de Gestão de RH", secretaria: "Secretaria de Adm.", modalidade: "Inexigibilidade", status: "em_revisao" as Status, valor: "R$ 750.000,00", etp: "Completo", tr: "Em revisão", responsavel: "Pedro Ramos", date: "29/06/2024" },
  { id: "PROC-2024-083", title: "Reforma Escola Municipal Centro", secretaria: "Secretaria de Educação", modalidade: "Concorrência", status: "aguardando" as Status, valor: "R$ 1.200.000,00", etp: "Completo", tr: "Completo", responsavel: "Ana Oliveira", date: "28/06/2024" },
  { id: "PROC-2024-082", title: "Aquisição de Uniformes Escolares", secretaria: "Secretaria de Educação", modalidade: "Pregão Eletrônico", status: "rejeitado" as Status, valor: "R$ 95.000,00", etp: "Completo", tr: "Rejeitado", responsavel: "João Silva", date: "27/06/2024" },
]

const statusFilters = [
  { key: "todos", label: "Todos" },
  { key: "rascunho", label: "Rascunho" },
  { key: "em_revisao", label: "Em Revisão" },
  { key: "aguardando", label: "Aguardando" },
  { key: "aprovado", label: "Aprovado" },
  { key: "concluido", label: "Concluído" },
  { key: "rejeitado", label: "Rejeitado" },
]

export default function ProcessList({ navigate }: Props) {
  const [activeFilter, setActiveFilter] = useState("todos")
  const [search, setSearch] = useState("")

  const filtered = allProcesses.filter((p) => {
    const matchStatus = activeFilter === "todos" || p.status === activeFilter
    const matchSearch = search === "" || p.title.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  return (
    <div style={{ padding: "28px" }}>
      {/* Filters */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: 8,
            padding: "0 12px",
            height: 38,
            flex: "1 1 260px",
            maxWidth: 320,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título ou número..."
            style={{ border: "none", background: "transparent", fontSize: 13, color: "#071A3D", outline: "none", width: "100%" }}
          />
        </div>

        <div style={{ display: "flex", gap: 6, background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 8, padding: 4, flexWrap: "wrap" }}>
          {statusFilters.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              style={{
                padding: "5px 12px",
                borderRadius: 6,
                border: "none",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                background: activeFilter === f.key ? "#071A3D" : "transparent",
                color: activeFilter === f.key ? "#FFFFFF" : "#64748B",
                transition: "all 0.15s",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "0 14px",
              height: 38,
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 500,
              color: "#64748B",
              cursor: "pointer",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
            Filtros
          </button>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "0 14px",
              height: 38,
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 500,
              color: "#64748B",
              cursor: "pointer",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Exportar
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
              {["Processo / Objeto", "Secretaria", "Modalidade", "Valor Est.", "ETP", "TR", "Responsável", "Status", ""].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "11px 16px",
                    textAlign: "left",
                    fontSize: 11,
                    color: "#94A3B8",
                    fontWeight: 600,
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr
                key={p.id}
                style={{
                  borderBottom: i < filtered.length - 1 ? "1px solid #F8FAFC" : "none",
                  cursor: "pointer",
                  transition: "background 0.1s",
                }}
                onClick={() => navigate("etp-form", p.id)}
                onMouseEnter={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = "#F8FAFC")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = "transparent")}
              >
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#071A3D", maxWidth: 260 }}>{p.title}</div>
                  <div style={{ fontSize: 11, color: "#94A3B8", fontFamily: "JetBrains Mono, monospace", marginTop: 3 }}>{p.id}</div>
                </td>
                <td style={{ padding: "14px 16px", fontSize: 12, color: "#64748B", maxWidth: 160 }}>{p.secretaria}</td>
                <td style={{ padding: "14px 16px" }}>
                  <span style={{ fontSize: 11, background: "#EFF6FF", color: "#1D4ED8", borderRadius: 6, padding: "2px 8px", fontWeight: 600 }}>
                    {p.modalidade}
                  </span>
                </td>
                <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 600, color: "#0D3B66", fontFamily: "JetBrains Mono, monospace", whiteSpace: "nowrap" }}>{p.valor}</td>
                <td style={{ padding: "14px 16px" }}>
                  <DocPill status={p.etp} />
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <DocPill status={p.tr} />
                </td>
                <td style={{ padding: "14px 16px", fontSize: 12, color: "#64748B" }}>{p.responsavel}</td>
                <td style={{ padding: "14px 16px" }}><StatusBadge status={p.status} size="sm" /></td>
                <td style={{ padding: "14px 16px" }}>
                  <button
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      border: "1px solid #E2E8F0",
                      background: "#F8FAFC",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: "#64748B",
                    }}
                    onClick={(e) => { e.stopPropagation(); navigate("etp-form", p.id) }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div style={{ padding: 60, textAlign: "center", color: "#94A3B8" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: "0 auto 12px", display: "block" }}>
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>Nenhum processo encontrado</p>
          </div>
        )}

        <div style={{ padding: "12px 16px", borderTop: "1px solid #F1F5F9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12, color: "#94A3B8" }}>Exibindo {filtered.length} de {allProcesses.length} processos</span>
          <div style={{ display: "flex", gap: 6 }}>
            {[1, 2, 3].map((p) => (
              <button key={p} style={{ width: 30, height: 30, borderRadius: 6, border: "1px solid #E2E8F0", background: p === 1 ? "#071A3D" : "#FFFFFF", color: p === 1 ? "#FFFFFF" : "#64748B", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function DocPill({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    "Completo": { bg: "#ECFDF5", color: "#065F46" },
    "Em andamento": { bg: "#EFF6FF", color: "#1D4ED8" },
    "Em revisão": { bg: "#FEF3C7", color: "#92400E" },
    "Rejeitado": { bg: "#FEF2F2", color: "#991B1B" },
    "Não iniciado": { bg: "#F1F5F9", color: "#475569" },
  }
  const c = map[status] || map["Não iniciado"]
  return (
    <span style={{ fontSize: 11, background: c.bg, color: c.color, borderRadius: 6, padding: "2px 8px", fontWeight: 600, whiteSpace: "nowrap" }}>
      {status}
    </span>
  )
}
