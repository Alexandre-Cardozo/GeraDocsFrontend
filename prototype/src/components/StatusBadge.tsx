type Status = "rascunho" | "em_revisao" | "aguardando" | "aprovado" | "rejeitado" | "concluido"

interface Props {
  status: Status
  size?: "sm" | "md"
}

const config: Record<Status, { label: string; bg: string; color: string; dot: string }> = {
  rascunho: { label: "Rascunho", bg: "#F1F5F9", color: "#475569", dot: "#94A3B8" },
  em_revisao: { label: "Em Revisão", bg: "#FEF3C7", color: "#92400E", dot: "#F59E0B" },
  aguardando: { label: "Aguardando", bg: "#EFF6FF", color: "#1D4ED8", dot: "#3B82F6" },
  aprovado: { label: "Aprovado", bg: "#ECFDF5", color: "#065F46", dot: "#10B981" },
  rejeitado: { label: "Rejeitado", bg: "#FEF2F2", color: "#991B1B", dot: "#EF4444" },
  concluido: { label: "Concluído", bg: "#F0FDF4", color: "#15803D", dot: "#22C55E" },
}

export default function StatusBadge({ status, size = "md" }: Props) {
  const c = config[status]
  const pad = size === "sm" ? "2px 8px" : "3px 10px"
  const fs = size === "sm" ? 11 : 12

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        background: c.bg,
        color: c.color,
        borderRadius: 999,
        padding: pad,
        fontSize: fs,
        fontWeight: 600,
        letterSpacing: "0.1px",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ width: 5, height: 5, borderRadius: 999, background: c.dot, flexShrink: 0 }} />
      {c.label}
    </span>
  )
}
