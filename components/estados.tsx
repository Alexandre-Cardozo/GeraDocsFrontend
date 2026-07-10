"use client"

import type { ReactNode } from "react"

import { Button } from "@/components/ds"
import { IconSearch, IconXCircle } from "@/components/ds/icons"

/** Estados compartilhados de carregamento / erro / vazio das telas. */

export function LoadingState({ label = "Carregando..." }: { label?: string }) {
  return (
    <div style={{ padding: 60, textAlign: "center", color: "var(--color-text-muted)" }} role="status">
      <span
        className="gd-spinner"
        style={{
          width: 24,
          height: 24,
          border: "var(--border-tint-royal-3)",
          borderTopColor: "var(--color-royal)",
          borderRadius: "var(--radius-full)",
          display: "inline-block",
          marginBottom: 12,
        }}
      />
      <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>{label}</p>
    </div>
  )
}

/** Skeleton flat de linhas (listas/tabelas). */
export function SkeletonRows({ rows = 5, height = 44 }: { rows?: number; height?: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: 20 }} aria-hidden>
      {Array.from({ length: rows }, (_, i) => (
        <div
          key={i}
          style={{
            height,
            background: "var(--color-border-soft)",
            borderRadius: "var(--radius-md)",
            opacity: 1 - i * 0.12,
          }}
        />
      ))}
    </div>
  )
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div style={{ padding: 60, textAlign: "center", color: "var(--color-text-muted)" }}>
      <span style={{ display: "inline-flex", color: "var(--color-danger)", marginBottom: 12 }}>
        <IconXCircle size={36} strokeWidth={1.5} />
      </span>
      <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "var(--text-body)" }}>Não foi possível carregar os dados</p>
      <p style={{ margin: 0, marginTop: 4, fontSize: 13 }}>{message ?? "Verifique sua conexão e tente novamente."}</p>
      {onRetry && (
        <div style={{ marginTop: 16, display: "flex", justifyContent: "center" }}>
          <Button variant="secondary" onClick={onRetry}>
            Tentar Novamente
          </Button>
        </div>
      )}
    </div>
  )
}

export function EmptyState({ message, icon, children }: { message: string; icon?: ReactNode; children?: ReactNode }) {
  return (
    <div style={{ padding: 60, textAlign: "center", color: "var(--color-text-muted)" }}>
      <span style={{ display: "inline-flex", marginBottom: 12 }}>{icon ?? <IconSearch size={40} strokeWidth={1.5} />}</span>
      <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>{message}</p>
      {children && <div style={{ marginTop: 16 }}>{children}</div>}
    </div>
  )
}
