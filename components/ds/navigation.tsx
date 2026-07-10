import type { ReactNode } from "react"

import { IconCheck } from "@/components/ds/icons"

/** Bloco branco de seção do ETP: título 15/700, frase de orientação, divisor suave. */
export function SectionBlock({ title, hint, children }: { title: string; hint: string; children: ReactNode }) {
  return (
    <div
      style={{
        background: "var(--surface-card)",
        border: "var(--border-default)",
        borderRadius: "var(--radius-card)",
        paddingBlock: 20,
        paddingInline: 22,
      }}
    >
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "var(--text-body)", margin: 0, marginBottom: 6 }}>
        {title}
      </h3>
      <p style={{ margin: 0, marginBottom: 16, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>{hint}</p>
      <div style={{ borderTop: "var(--border-soft)", paddingTop: 16 }}>{children}</div>
    </div>
  )
}

/** Indicador de passos do wizard: círculos verdes concluídos / royal ativo. */
export function StepIndicator({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
      {steps.map((s, i) => (
        <div key={s} style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "var(--radius-full)",
                background:
                  current > i + 1
                    ? "var(--color-success)"
                    : current === i + 1
                      ? "var(--color-royal)"
                      : "var(--color-border)",
                color: current >= i + 1 ? "var(--color-surface)" : "var(--color-text-muted)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 700,
                flexShrink: 0,
                transition: "var(--transition-slow)",
              }}
            >
              {current > i + 1 ? <IconCheck size={14} strokeWidth={3} /> : i + 1}
            </div>
            <span
              style={{
                fontSize: 13,
                fontWeight: current === i + 1 ? 700 : 500,
                color: current === i + 1 ? "var(--text-body)" : "var(--color-text-muted)",
                fontFamily: "var(--font-body)",
              }}
            >
              {s}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              style={{
                width: 60,
                height: 2,
                background: current > i + 1 ? "var(--color-success)" : "var(--color-border)",
                marginInline: 12,
                transition: "background 0.2s",
              }}
            />
          )}
        </div>
      ))}
    </div>
  )
}
