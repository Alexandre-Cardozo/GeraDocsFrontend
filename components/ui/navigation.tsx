import type { ReactNode } from "react"

import { IconCheck } from "@/components/ui/icons"

/** Bloco branco de seção do ETP: título 15/700, frase de orientação, divisor suave. */
export function SectionBlock({ title, hint, children }: { title: string; hint: string; children: ReactNode }) {
  return (
    <div className="rounded-card border border-border bg-surface px-5.5 py-5">
      <h3 className="m-0 mb-1.5 font-display text-lg font-bold text-text-1">{title}</h3>
      <p className="m-0 mb-4 text-base leading-normal text-text-3">{hint}</p>
      <div className="border-t border-border-soft pt-4">{children}</div>
    </div>
  )
}

/** Indicador de passos do wizard: círculos verdes concluídos / royal ativo. */
export function StepIndicator({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="flex items-center">
      {steps.map((s, i) => {
        const done = current > i + 1
        const active = current === i + 1
        return (
          <div key={s} className="flex items-center">
            <div className="flex items-center gap-2.5">
              <div
                className={`flex size-8 shrink-0 items-center justify-center rounded-full text-base font-bold transition-all duration-200 ${
                  done ? "bg-success text-surface" : active ? "bg-royal text-surface" : "bg-border text-text-muted"
                }`}
              >
                {done ? <IconCheck size={14} strokeWidth={3} /> : i + 1}
              </div>
              <span
                className={`font-body text-base ${active ? "font-bold text-text-1" : "font-medium text-text-muted max-xs:hidden"}`}
              >
                {s}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`mx-2 h-0.5 w-4 transition-colors duration-200 sm:mx-3 sm:w-15 ${done ? "bg-success" : "bg-border"}`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
