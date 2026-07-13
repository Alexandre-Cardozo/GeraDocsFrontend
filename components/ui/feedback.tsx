import type { ReactNode } from "react"

import { IconInfo } from "@/components/ui/icons"
import type { StatusDocumento, StatusProcesso } from "@/lib/types"

/** Badge de status de processo com ponto colorido — vocabulário fixo. */
const statusCfg: Record<StatusProcesso, { label: string; pill: string; dot: string }> = {
  rascunho: { label: "Rascunho", pill: "bg-status-draft-bg text-status-draft-fg", dot: "bg-status-draft-dot" },
  em_revisao: { label: "Em Revisão", pill: "bg-status-review-bg text-status-review-fg", dot: "bg-status-review-dot" },
  aguardando: { label: "Aguardando", pill: "bg-status-waiting-bg text-status-waiting-fg", dot: "bg-status-waiting-dot" },
  aprovado: { label: "Aprovado", pill: "bg-status-approved-bg text-status-approved-fg", dot: "bg-status-approved-dot" },
  rejeitado: { label: "Rejeitado", pill: "bg-status-rejected-bg text-status-rejected-fg", dot: "bg-status-rejected-dot" },
  concluido: { label: "Concluído", pill: "bg-status-done-bg text-status-done-fg", dot: "bg-status-done-dot" },
}

export function StatusBadge({ status, size = "md" }: { status: StatusProcesso; size?: "sm" | "md" }) {
  const c = statusCfg[status]
  return (
    <span
      className={`inline-flex items-center gap-1.25 rounded-full font-semibold tracking-badge whitespace-nowrap ${c.pill} ${
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-0.75 text-sm"
      }`}
    >
      <span className={`size-1.25 shrink-0 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  )
}

/** Pill quadrada para estados de documento (colunas ETP/TR) — vocabulário fixo. */
const docCfg: Record<StatusDocumento, string> = {
  "Completo": "bg-tint-success-bg text-tint-success-fg",
  "Em andamento": "bg-tint-royal-bg text-royal-hover",
  "Em revisão": "bg-tint-warning-chip-bg text-tint-warning-fg",
  "Rejeitado": "bg-tint-danger-bg text-tint-danger-fg",
  "Não iniciado": "bg-border-soft text-slate-strong",
}

export function DocPill({ status, classes }: { status: string; classes?: string }) {
  const cor = classes ?? docCfg[status as StatusDocumento] ?? docCfg["Não iniciado"]
  return (
    <span className={`inline-block rounded-sm px-2 py-0.5 text-xs font-semibold whitespace-nowrap ${cor}`}>
      {status}
    </span>
  )
}

/** Micro tag: Obrigatório / Opcional / Recomendado / Urgente etc. */
const tagTones = {
  info: "bg-tint-royal-bg text-royal-hover",
  success: "bg-tint-success-bg text-tint-success-fg",
  warning: "bg-tint-warning-chip-bg text-tint-warning-fg",
  danger: "bg-tint-danger-bg text-tint-danger-fg",
  violet: "bg-tint-violet-bg text-tint-violet-fg",
  neutral: "bg-border-soft text-slate-strong",
} as const

export function Tag({ children, tone = "info" }: { children: ReactNode; tone?: keyof typeof tagTones }) {
  return (
    <span className={`inline-block rounded-sm px-1.75 py-0.5 text-2xs font-bold whitespace-nowrap ${tagTones[tone]}`}>
      {children}
    </span>
  )
}

/** Card KPI do dashboard: chip de ícone, chip de tendência, número 30px. */
export function StatCard({
  label,
  value,
  sub,
  trend = "up",
  icon,
  iconClasses = "bg-tint-royal-bg text-royal",
}: {
  label: string
  value: string
  sub?: string
  trend?: "up" | "warn"
  icon: ReactNode
  /** Classes de cor do chip do ícone (ex.: "bg-tint-warning-bg text-warning-strong"). */
  iconClasses?: string
}) {
  const warn = trend === "warn"
  return (
    <div className="rounded-card border border-border bg-surface p-5">
      <div className="mb-3 flex items-start justify-between">
        <div className={`flex size-10 items-center justify-center rounded-xl ${iconClasses}`}>{icon}</div>
        {sub && (
          <span
            className={`rounded-sm px-1.75 py-0.5 text-xs font-semibold ${
              warn ? "bg-tint-warning-bg text-warning-strong" : "bg-status-done-bg text-green"
            }`}
          >
            {warn ? "!" : "↑"} {sub}
          </span>
        )}
      </div>
      <div className="font-display text-stat leading-none font-extrabold tracking-stat text-text-1">{value}</div>
      <div className="mt-1 text-base font-medium text-text-3">{label}</div>
    </div>
  )
}

/** Barra de progresso com preenchimento gradiente (uso canônico). */
export function ProgressBar({
  percent,
  label,
  sub,
  barClasses = "h-1.5",
  transition = "width 0.5s",
}: {
  percent: number
  label?: string
  sub?: string
  /** Altura da trilha (ex.: "h-2" para a análise do DFD). */
  barClasses?: string
  transition?: string
}) {
  return (
    <div>
      {label != null && (
        <div className="mb-1.5 flex justify-between">
          <span className="text-sm font-semibold text-text-2">{label}</span>
          <span className="text-sm font-bold text-royal">{Math.round(percent)}%</span>
        </div>
      )}
      <div className={`overflow-hidden rounded-full bg-border-soft ${barClasses}`}>
        <div className="h-full rounded-full gradient-progress" style={{ width: `${percent}%`, transition }} />
      </div>
      {sub && <div className="mt-1.25 text-xs text-text-muted">{sub}</div>}
    </div>
  )
}

/** Mensagem de validação inline sob campos. */
const validationCfg = {
  ok: { classes: "bg-tint-success-bg text-tint-success-fg", icon: "✓" },
  warn: { classes: "bg-tint-warning-bg text-tint-warning-fg", icon: "!" },
  error: { classes: "bg-tint-danger-bg text-tint-danger-fg", icon: "✕" },
} as const

export function ValidationMsg({ type = "ok", msg }: { type?: "ok" | "warn" | "error"; msg: string }) {
  const c = validationCfg[type]
  return (
    <div className={`mt-2.5 flex items-center gap-2 rounded-[7px] px-3 py-2 ${c.classes}`}>
      <span className="text-base font-bold">{c.icon}</span>
      <span className="text-sm font-medium">{msg}</span>
    </div>
  )
}

/** Banner informativo com borda (azul/âmbar/vermelho/verde). */
const bannerTones = {
  info: "bg-tint-royal-bg border-tint-royal-border text-royal-hover",
  warning: "bg-tint-warning-bg border-tint-warning-border text-tint-warning-fg",
  danger: "bg-tint-danger-bg border-tint-danger-border text-tint-danger-fg",
  success: "bg-tint-success-bg border-tint-success-border text-tint-success-fg",
} as const

export function InfoBanner({
  tone = "info",
  children,
  icon,
  className = "",
}: {
  tone?: keyof typeof bannerTones
  children: ReactNode
  icon?: ReactNode
  className?: string
}) {
  return (
    <div className={`flex items-start gap-2.5 rounded-xl border px-3.5 py-3 ${bannerTones[tone]} ${className}`}>
      <span className="mt-px flex shrink-0">{icon ?? <IconInfo size={16} />}</span>
      <div className="text-base leading-normal">{children}</div>
    </div>
  )
}
