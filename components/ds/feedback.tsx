import type { CSSProperties, ReactNode } from "react"

import { IconInfo } from "@/components/ds/icons"
import type { StatusDocumento, StatusProcesso } from "@/lib/types"

/** Badge de status de processo com ponto colorido — vocabulário fixo. */
const statusCfg: Record<StatusProcesso, { label: string; bg: string; color: string; dot: string }> = {
  rascunho: { label: "Rascunho", bg: "var(--status-draft-bg)", color: "var(--status-draft-fg)", dot: "var(--status-draft-dot)" },
  em_revisao: { label: "Em Revisão", bg: "var(--status-review-bg)", color: "var(--status-review-fg)", dot: "var(--status-review-dot)" },
  aguardando: { label: "Aguardando", bg: "var(--status-waiting-bg)", color: "var(--status-waiting-fg)", dot: "var(--status-waiting-dot)" },
  aprovado: { label: "Aprovado", bg: "var(--status-approved-bg)", color: "var(--status-approved-fg)", dot: "var(--status-approved-dot)" },
  rejeitado: { label: "Rejeitado", bg: "var(--status-rejected-bg)", color: "var(--status-rejected-fg)", dot: "var(--status-rejected-dot)" },
  concluido: { label: "Concluído", bg: "var(--status-done-bg)", color: "var(--status-done-fg)", dot: "var(--status-done-dot)" },
}

export function StatusBadge({ status, size = "md" }: { status: StatusProcesso; size?: "sm" | "md" }) {
  const c = statusCfg[status]
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        background: c.bg,
        color: c.color,
        borderRadius: "var(--radius-full)",
        paddingBlock: size === "sm" ? 2 : 3,
        paddingInline: size === "sm" ? 8 : 10,
        fontSize: size === "sm" ? 11 : 12,
        fontWeight: 600,
        letterSpacing: "var(--tracking-badge)",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ width: 5, height: 5, borderRadius: "var(--radius-full)", background: c.dot, flexShrink: 0 }} />
      {c.label}
    </span>
  )
}

/** Pill quadrada para estados de documento (colunas ETP/TR) — vocabulário fixo. */
const docCfg: Record<StatusDocumento, { bg: string; color: string }> = {
  "Completo": { bg: "var(--tint-success-bg)", color: "var(--tint-success-fg)" },
  "Em andamento": { bg: "var(--tint-royal-bg)", color: "var(--color-royal-hover)" },
  "Em revisão": { bg: "var(--tint-warning-chip-bg)", color: "var(--tint-warning-fg)" },
  "Rejeitado": { bg: "var(--tint-danger-bg)", color: "var(--tint-danger-fg)" },
  "Não iniciado": { bg: "var(--color-border-soft)", color: "var(--color-slate-strong)" },
}

export function DocPill({ status, bg, color }: { status: string; bg?: string; color?: string }) {
  const c = docCfg[status as StatusDocumento] ?? (bg && color ? { bg, color } : docCfg["Não iniciado"])
  return (
    <span
      style={{
        fontSize: 11,
        background: c.bg,
        color: c.color,
        borderRadius: "var(--radius-sm)",
        paddingBlock: 2,
        paddingInline: 8,
        fontWeight: 600,
        whiteSpace: "nowrap",
        display: "inline-block",
      }}
    >
      {status}
    </span>
  )
}

/** Micro tag: Obrigatório / Opcional / Recomendado / Urgente etc. */
const tagTones = {
  info: { bg: "var(--tint-royal-bg)", color: "var(--color-royal-hover)" },
  success: { bg: "var(--tint-success-bg)", color: "var(--tint-success-fg)" },
  warning: { bg: "var(--tint-warning-chip-bg)", color: "var(--tint-warning-fg)" },
  danger: { bg: "var(--tint-danger-bg)", color: "var(--tint-danger-fg)" },
  violet: { bg: "var(--tint-violet-bg)", color: "var(--tint-violet-fg)" },
  neutral: { bg: "var(--color-border-soft)", color: "var(--color-slate-strong)" },
} as const

export function Tag({ children, tone = "info" }: { children: ReactNode; tone?: keyof typeof tagTones }) {
  const c = tagTones[tone]
  return (
    <span
      style={{
        fontSize: 10,
        background: c.bg,
        color: c.color,
        borderRadius: "var(--radius-sm)",
        paddingBlock: 2,
        paddingInline: 7,
        fontWeight: 700,
        whiteSpace: "nowrap",
        display: "inline-block",
      }}
    >
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
  color = "var(--color-royal)",
  bg = "var(--tint-royal-bg)",
}: {
  label: string
  value: string
  sub?: string
  trend?: "up" | "warn"
  icon: ReactNode
  color?: string
  bg?: string
}) {
  const warn = trend === "warn"
  return (
    <div
      style={{
        background: "var(--surface-card)",
        border: "var(--border-default)",
        borderRadius: "var(--radius-card)",
        padding: 20,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
        <div
          style={{
            width: 40,
            height: 40,
            background: bg,
            borderRadius: "var(--radius-xl)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color,
          }}
        >
          {icon}
        </div>
        {sub && (
          <span
            style={{
              fontSize: 11,
              color: warn ? "var(--color-warning-strong)" : "var(--color-green)",
              background: warn ? "var(--tint-warning-bg)" : "var(--status-done-bg)",
              borderRadius: "var(--radius-sm)",
              paddingBlock: 2,
              paddingInline: 7,
              fontWeight: 600,
            }}
          >
            {warn ? "!" : "↑"} {sub}
          </span>
        )}
      </div>
      <div
        style={{
          fontSize: "var(--text-stat)",
          fontWeight: 800,
          color: "var(--text-body)",
          fontFamily: "var(--font-display)",
          letterSpacing: "var(--tracking-stat)",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4, fontWeight: 500 }}>{label}</div>
    </div>
  )
}

/** Barra de progresso com preenchimento gradiente (uso canônico). */
export function ProgressBar({
  percent,
  label,
  sub,
  height = 6,
  transition = "width 0.5s",
}: {
  percent: number
  label?: string
  sub?: string
  height?: number
  transition?: string
}) {
  return (
    <div>
      {label != null && (
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-label)" }}>{label}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--color-royal)" }}>{Math.round(percent)}%</span>
        </div>
      )}
      <div style={{ height, background: "var(--color-border-soft)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
        <div
          style={{
            width: `${percent}%`,
            height: "100%",
            background: "var(--gradient-progress)",
            borderRadius: "var(--radius-full)",
            transition,
          }}
        />
      </div>
      {sub && <div style={{ fontSize: 11, color: "var(--color-text-muted)", marginTop: 5 }}>{sub}</div>}
    </div>
  )
}

/** Mensagem de validação inline sob campos. */
const validationCfg = {
  ok: { bg: "var(--tint-success-bg)", color: "var(--tint-success-fg)", icon: "✓" },
  warn: { bg: "var(--tint-warning-bg)", color: "var(--tint-warning-fg)", icon: "!" },
  error: { bg: "var(--tint-danger-bg)", color: "var(--tint-danger-fg)", icon: "✕" },
} as const

export function ValidationMsg({ type = "ok", msg }: { type?: "ok" | "warn" | "error"; msg: string }) {
  const c = validationCfg[type]
  return (
    <div
      style={{
        background: c.bg,
        borderRadius: 7,
        paddingBlock: 8,
        paddingInline: 12,
        marginTop: 10,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <span style={{ color: c.color, fontWeight: 700, fontSize: 13 }}>{c.icon}</span>
      <span style={{ fontSize: 12, color: c.color, fontWeight: 500 }}>{msg}</span>
    </div>
  )
}

/** Banner informativo com borda (azul/âmbar/vermelho/verde). */
const bannerTones = {
  info: { bg: "var(--tint-royal-bg)", border: "var(--tint-royal-border)", color: "var(--color-royal-hover)" },
  warning: { bg: "var(--tint-warning-bg)", border: "var(--tint-warning-border)", color: "var(--tint-warning-fg)" },
  danger: { bg: "var(--tint-danger-bg)", border: "var(--tint-danger-border)", color: "var(--tint-danger-fg)" },
  success: { bg: "var(--tint-success-bg)", border: "var(--tint-success-border)", color: "var(--tint-success-fg)" },
} as const

export function InfoBanner({
  tone = "info",
  children,
  icon,
  style,
}: {
  tone?: keyof typeof bannerTones
  children: ReactNode
  icon?: ReactNode
  style?: CSSProperties
}) {
  const c = bannerTones[tone]
  return (
    <div
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: "var(--radius-xl)",
        paddingBlock: 12,
        paddingInline: 14,
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
        ...style,
      }}
    >
      <span style={{ flexShrink: 0, marginTop: 1, display: "flex", color: c.color }}>{icon ?? <IconInfo size={16} />}</span>
      <div style={{ margin: 0, fontSize: 13, color: c.color, lineHeight: 1.5 }}>{children}</div>
    </div>
  )
}
