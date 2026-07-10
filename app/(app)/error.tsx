"use client"

import { ErrorState } from "@/components/estados"

export default function ErroApp({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div style={{ padding: 28, maxWidth: "var(--content-max)" }}>
      <div style={{ background: "var(--surface-card)", border: "var(--border-default)", borderRadius: "var(--radius-card)" }}>
        <ErrorState message={error.message} onRetry={reset} />
      </div>
    </div>
  )
}
