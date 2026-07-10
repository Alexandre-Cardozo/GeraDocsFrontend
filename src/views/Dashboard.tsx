import type { View } from "../App"
import StatusBadge from "../components/StatusBadge"

interface Props {
  navigate: (view: View) => void
}

const stats = [
  {
    label: "Processos Ativos",
    value: "24",
    sub: "+3 este mês",
    trend: "up",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
    color: "#2563EB",
    bg: "#EFF6FF",
  },
  {
    label: "Aguardando Aprovação",
    value: "7",
    sub: "3 com urgência",
    trend: "warn",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    color: "#D97706",
    bg: "#FFFBEB",
  },
  {
    label: "Documentos Gerados",
    value: "138",
    sub: "12 esta semana",
    trend: "up",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
    color: "#0D9488",
    bg: "#F0FDFA",
  },
  {
    label: "ETPs Concluídos",
    value: "61",
    sub: "Taxa de conclusão: 89%",
    trend: "up",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    color: "#16A34A",
    bg: "#F0FDF4",
  },
]

const recentProcesses = [
  { id: "PROC-2024-089", title: "Aquisição de Equipamentos de TI", secretaria: "Secretaria de Educação", status: "em_revisao" as const, valor: "R$ 485.000,00", date: "05/07/2024" },
  { id: "PROC-2024-088", title: "Contratação de Serviços de Limpeza", secretaria: "Secretaria de Obras", status: "aguardando" as const, valor: "R$ 120.000,00", date: "04/07/2024" },
  { id: "PROC-2024-087", title: "Fornecimento de Material de Escritório", secretaria: "Administração Central", status: "aprovado" as const, valor: "R$ 38.500,00", date: "03/07/2024" },
  { id: "PROC-2024-086", title: "Serviços de Manutenção Predial", secretaria: "Secretaria de Saúde", status: "rascunho" as const, valor: "R$ 210.000,00", date: "02/07/2024" },
  { id: "PROC-2024-085", title: "Aquisição de Veículos Oficiais", secretaria: "Frota Municipal", status: "concluido" as const, valor: "R$ 920.000,00", date: "01/07/2024" },
]

const pendingApprovals = [
  { id: "PROC-2024-088", label: "Contratação de Serviços de Limpeza", type: "ETP", urgente: true },
  { id: "PROC-2024-083", label: "Sistema de Gestão de RH", type: "TR", urgente: true },
  { id: "PROC-2024-081", label: "Reforma Escola Municipal Centro", type: "ETP", urgente: false },
]

export default function Dashboard({ navigate }: Props) {
  return (
    <div style={{ padding: "28px 28px", maxWidth: 1200 }}>
      {/* Welcome bar */}
      <div style={{ marginBottom: 28, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div>
          <p style={{ margin: 0, fontSize: 13, color: "#64748B", marginBottom: 4 }}>Segunda-feira, 07 de julho de 2024</p>
          <h2 style={{ margin: 0, fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 22, fontWeight: 800, color: "#071A3D", letterSpacing: "-0.5px" }}>
            Bom dia, Maria
          </h2>
        </div>
        <button
          onClick={() => navigate("new-process")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#2563EB",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "11px 20px",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Novo Processo de Contratação
        </button>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: 12,
              padding: "20px 20px",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, background: s.bg, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: s.color }}>
                {s.icon}
              </div>
              <span style={{ fontSize: 11, color: s.trend === "warn" ? "#D97706" : "#16A34A", background: s.trend === "warn" ? "#FFFBEB" : "#F0FDF4", borderRadius: 6, padding: "2px 7px", fontWeight: 600 }}>
                {s.trend === "up" ? "↑" : "!"} {s.sub}
              </span>
            </div>
            <div style={{ fontSize: 30, fontWeight: 800, color: "#071A3D", fontFamily: "Plus Jakarta Sans, sans-serif", letterSpacing: "-1px", lineHeight: 1 }}>
              {s.value}
            </div>
            <div style={{ fontSize: 13, color: "#64748B", marginTop: 4, fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
        {/* Recent processes */}
        <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "18px 20px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h3 style={{ margin: 0, fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 15, fontWeight: 700, color: "#071A3D" }}>
              Processos Recentes
            </h3>
            <button
              onClick={() => navigate("processes")}
              style={{ fontSize: 13, color: "#2563EB", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}
            >
              Ver todos →
            </button>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F8FAFC" }}>
                {["Processo", "Secretaria", "Valor Est.", "Status", "Data"].map((h) => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, color: "#94A3B8", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase", borderBottom: "1px solid #F1F5F9" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentProcesses.map((p, i) => (
                <tr
                  key={p.id}
                  onClick={() => navigate("etp-form", p.id)}
                  style={{
                    cursor: "pointer",
                    borderBottom: i < recentProcesses.length - 1 ? "1px solid #F8FAFC" : "none",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = "#F8FAFC")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = "transparent")}
                >
                  <td style={{ padding: "13px 16px" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#071A3D" }}>{p.title}</div>
                    <div style={{ fontSize: 11, color: "#94A3B8", fontFamily: "JetBrains Mono, monospace", marginTop: 2 }}>{p.id}</div>
                  </td>
                  <td style={{ padding: "13px 16px", fontSize: 12, color: "#64748B" }}>{p.secretaria}</td>
                  <td style={{ padding: "13px 16px", fontSize: 13, fontWeight: 600, color: "#0D3B66", fontFamily: "JetBrains Mono, monospace" }}>{p.valor}</td>
                  <td style={{ padding: "13px 16px" }}><StatusBadge status={p.status} size="sm" /></td>
                  <td style={{ padding: "13px 16px", fontSize: 12, color: "#94A3B8" }}>{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Pending approvals */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "18px 18px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ margin: 0, fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 15, fontWeight: 700, color: "#071A3D" }}>
                Pendentes de Aprovação
              </h3>
              <span style={{ background: "#FEF2F2", color: "#EF4444", fontSize: 11, fontWeight: 700, borderRadius: 999, padding: "2px 8px" }}>
                {pendingApprovals.length}
              </span>
            </div>
            <div style={{ padding: "8px 0" }}>
              {pendingApprovals.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate("approvals")}
                  style={{
                    padding: "12px 18px",
                    cursor: "pointer",
                    transition: "background 0.1s",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.background = "#F8FAFC")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.background = "transparent")}
                >
                  <div style={{ width: 32, height: 32, background: "#EFF6FF", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#2563EB", fontFamily: "JetBrains Mono, monospace" }}>{item.type}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#071A3D", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: 11, color: "#94A3B8", fontFamily: "JetBrains Mono, monospace", marginTop: 2 }}>{item.id}</div>
                  </div>
                  {item.urgente && (
                    <span style={{ fontSize: 10, background: "#FEF3C7", color: "#92400E", borderRadius: 6, padding: "2px 6px", fontWeight: 700, flexShrink: 0 }}>
                      Urgente
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div style={{ padding: "12px 18px", borderTop: "1px solid #F1F5F9" }}>
              <button
                onClick={() => navigate("approvals")}
                style={{ width: "100%", padding: "9px", background: "#EFF6FF", color: "#2563EB", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
              >
                Ver todas as aprovações
              </button>
            </div>
          </div>

          {/* Quick actions */}
          <div style={{ background: "#071A3D", borderRadius: 12, padding: "20px 18px" }}>
            <h3 style={{ margin: "0 0 14px", fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 14, fontWeight: 700, color: "#FFFFFF" }}>
              Ações Rápidas
            </h3>
            {[
              { label: "Novo ETP", desc: "Estudo Técnico Preliminar", icon: "📋" },
              { label: "Novo TR", desc: "Termo de Referência", icon: "📄" },
              { label: "Consultar PNCP", desc: "Portal Nacional de Contratações", icon: "🔍" },
            ].map((a) => (
              <button
                key={a.label}
                onClick={() => navigate("new-process")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  padding: "10px 12px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 9,
                  cursor: "pointer",
                  marginBottom: 8,
                  textAlign: "left",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)")}
              >
                <span style={{ fontSize: 18 }}>{a.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#FFFFFF" }}>{a.label}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{a.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
