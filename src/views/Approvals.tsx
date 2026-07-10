import { useState } from "react"
import type { View } from "../App"
import StatusBadge from "../components/StatusBadge"

interface Props {
  navigate: (view: View) => void
}

const approvals = [
  {
    id: "PROC-2024-088",
    title: "Contratação de Serviços de Limpeza",
    type: "ETP + TR",
    secretaria: "Secretaria de Obras",
    responsavel: "João Silva",
    valor: "R$ 120.000,00",
    modalidade: "Pregão Eletrônico",
    submitDate: "04/07/2024",
    deadline: "08/07/2024",
    urgente: true,
    status: "aguardando" as const,
  },
  {
    id: "PROC-2024-083",
    title: "Sistema de Gestão de RH",
    type: "ETP + TR",
    secretaria: "Secretaria de Adm.",
    responsavel: "Pedro Ramos",
    valor: "R$ 750.000,00",
    modalidade: "Inexigibilidade",
    submitDate: "03/07/2024",
    deadline: "07/07/2024",
    urgente: true,
    status: "aguardando" as const,
  },
  {
    id: "PROC-2024-081",
    title: "Reforma Escola Municipal Centro",
    type: "ETP",
    secretaria: "Secretaria de Educação",
    responsavel: "Ana Oliveira",
    valor: "R$ 1.200.000,00",
    modalidade: "Concorrência",
    submitDate: "01/07/2024",
    deadline: "10/07/2024",
    urgente: false,
    status: "aguardando" as const,
  },
]

export default function Approvals({ navigate }: Props) {
  const [selected, setSelected] = useState<string | null>(approvals[0].id)
  const [comment, setComment] = useState("")
  const [approved, setApproved] = useState<string[]>([])
  const [rejected, setRejected] = useState<string[]>([])

  const active = approvals.find((a) => a.id === selected)

  const handleApprove = () => {
    if (selected && !approved.includes(selected)) {
      setApproved((prev) => [...prev, selected])
      setRejected((prev) => prev.filter((r) => r !== selected))
    }
  }

  const handleReject = () => {
    if (selected && !rejected.includes(selected)) {
      setRejected((prev) => [...prev, selected])
      setApproved((prev) => prev.filter((a) => a !== selected))
    }
  }

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      {/* Left list */}
      <div style={{ width: 340, minWidth: 340, background: "#FFFFFF", borderRight: "1px solid #E2E8F0", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "16px 18px", borderBottom: "1px solid #F1F5F9" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#071A3D" }}>Pendentes de Aprovação</div>
          <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>{approvals.length} documentos aguardando análise</div>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {approvals.map((a) => {
            const isApproved = approved.includes(a.id)
            const isRejected = rejected.includes(a.id)
            return (
              <div
                key={a.id}
                onClick={() => setSelected(a.id)}
                style={{
                  padding: "14px 18px",
                  borderBottom: "1px solid #F8FAFC",
                  cursor: "pointer",
                  background: selected === a.id ? "#EFF6FF" : "transparent",
                  borderLeft: selected === a.id ? "3px solid #2563EB" : "3px solid transparent",
                  transition: "all 0.1s",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#071A3D", flex: 1 }}>{a.title}</div>
                  {a.urgente && !isApproved && !isRejected && (
                    <span style={{ fontSize: 10, background: "#FEF3C7", color: "#92400E", borderRadius: 6, padding: "2px 7px", fontWeight: 700, flexShrink: 0 }}>Urgente</span>
                  )}
                  {isApproved && <span style={{ fontSize: 10, background: "#ECFDF5", color: "#065F46", borderRadius: 6, padding: "2px 7px", fontWeight: 700, flexShrink: 0 }}>Aprovado</span>}
                  {isRejected && <span style={{ fontSize: 10, background: "#FEF2F2", color: "#991B1B", borderRadius: 6, padding: "2px 7px", fontWeight: 700, flexShrink: 0 }}>Rejeitado</span>}
                </div>
                <div style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#94A3B8", marginBottom: 4 }}>{a.id}</div>
                <div style={{ fontSize: 12, color: "#64748B", marginBottom: 4 }}>{a.secretaria}</div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 11, background: "#F1F5F9", color: "#475569", borderRadius: 6, padding: "2px 8px", fontWeight: 600 }}>{a.type}</span>
                  <span style={{ fontSize: 11, color: "#94A3B8" }}>Prazo: {a.deadline}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Right detail */}
      {active && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#F8FAFC" }}>
          {/* Detail header */}
          <div style={{ background: "#FFFFFF", borderBottom: "1px solid #E2E8F0", padding: "16px 24px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "#94A3B8", marginBottom: 4 }}>{active.id}</div>
                <h2 style={{ margin: 0, fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 18, fontWeight: 800, color: "#071A3D", letterSpacing: "-0.4px" }}>
                  {active.title}
                </h2>
                <div style={{ display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 12, color: "#64748B" }}>📁 {active.secretaria}</span>
                  <span style={{ fontSize: 12, color: "#64748B" }}>👤 {active.responsavel}</span>
                  <span style={{ fontSize: 12, color: "#64748B" }}>📅 Enviado em {active.submitDate}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: active.urgente ? "#D97706" : "#64748B" }}>⏰ Prazo: {active.deadline}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  style={{ padding: "8px 16px", border: "1px solid #E2E8F0", borderRadius: 8, background: "#FFFFFF", fontSize: 13, fontWeight: 600, color: "#64748B", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  Visualizar Documentos
                </button>
              </div>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
            {/* Info cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
              {[
                { label: "Modalidade", value: active.modalidade },
                { label: "Tipo", value: active.type },
                { label: "Valor Estimado", value: active.valor },
                { label: "Status", value: <StatusBadge status={approved.includes(active.id) ? "aprovado" : rejected.includes(active.id) ? "rejeitado" : "aguardando"} size="sm" /> },
              ].map((info) => (
                <div key={info.label} style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 5 }}>{info.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#071A3D" }}>{info.value}</div>
                </div>
              ))}
            </div>

            {/* Checklist */}
            <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 12, padding: "18px 20px", marginBottom: 16 }}>
              <h3 style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 14, fontWeight: 700, color: "#071A3D", margin: "0 0 14px" }}>
                Checklist de Conformidade
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { ok: true, text: "Descrição da necessidade preenchida e fundamentada" },
                  { ok: true, text: "Estimativa de valor com pesquisa de mercado anexa" },
                  { ok: true, text: "Responsável técnico identificado e assinado" },
                  { ok: true, text: "Modalidade licitatória adequada ao objeto e valor" },
                  { ok: false, text: "Análise de sustentabilidade ambiental pendente" },
                  { ok: true, text: "Declaração de viabilidade preenchida" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 20, height: 20, borderRadius: 999, background: item.ok ? "#ECFDF5" : "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {item.ok ? (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      ) : (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                      )}
                    </div>
                    <span style={{ fontSize: 13, color: item.ok ? "#374151" : "#EF4444", fontWeight: item.ok ? 400 : 600 }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 12, padding: "18px 20px", marginBottom: 16 }}>
              <h3 style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 14, fontWeight: 700, color: "#071A3D", margin: "0 0 10px" }}>
                Parecer / Observações
              </h3>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Registre seu parecer ou observações sobre o processo..."
                rows={4}
                style={{ width: "100%", padding: "12px 14px", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: 14, color: "#071A3D", outline: "none", fontFamily: "Inter, sans-serif", resize: "vertical" }}
              />
            </div>

            {/* Action buttons */}
            {!approved.includes(active.id) && !rejected.includes(active.id) && (
              <div style={{ display: "flex", gap: 12 }}>
                <button
                  onClick={handleReject}
                  style={{ flex: 1, padding: "13px", border: "2px solid #FCA5A5", borderRadius: 10, background: "#FEF2F2", fontSize: 14, fontWeight: 700, color: "#EF4444", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  Rejeitar e Devolver
                </button>
                <button
                  onClick={handleApprove}
                  style={{ flex: 1, padding: "13px", border: "none", borderRadius: 10, background: "#10B981", fontSize: 14, fontWeight: 700, color: "#FFFFFF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  Aprovar Processo
                </button>
              </div>
            )}
            {(approved.includes(active.id) || rejected.includes(active.id)) && (
              <div style={{ background: approved.includes(active.id) ? "#ECFDF5" : "#FEF2F2", border: `1px solid ${approved.includes(active.id) ? "#A7F3D0" : "#FCA5A5"}`, borderRadius: 10, padding: "16px 20px", textAlign: "center" }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: approved.includes(active.id) ? "#065F46" : "#991B1B" }}>
                  {approved.includes(active.id) ? "✓ Processo Aprovado" : "✕ Processo Rejeitado"}
                </div>
                <div style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>Decisão registrada em 07/07/2024 às 14:32</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
