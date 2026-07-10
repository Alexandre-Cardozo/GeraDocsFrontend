import Link from "next/link"

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--surface-app)",
        gap: 8,
        padding: 28,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          background: "var(--gradient-brand)",
          borderRadius: "var(--radius-card)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 12,
          color: "var(--color-surface)",
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      </div>
      <h1
        style={{
          margin: 0,
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-2xl)",
          fontWeight: 800,
          color: "var(--text-body)",
          letterSpacing: "var(--tracking-tight)",
        }}
      >
        Página Não Encontrada
      </h1>
      <p style={{ margin: 0, fontSize: 14, color: "var(--text-secondary)", textAlign: "center", maxWidth: 420 }}>
        O endereço acessado não existe ou foi movido. Verifique o número do processo ou retorne ao Dashboard.
      </p>
      <Link
        href="/"
        style={{
          marginTop: 16,
          display: "inline-flex",
          alignItems: "center",
          gap: 7,
          background: "var(--action-primary)",
          color: "var(--color-surface)",
          borderRadius: "var(--radius-md)",
          paddingInline: 20,
          height: 40,
          fontSize: 14,
          fontWeight: 600,
          textDecoration: "none",
        }}
      >
        Voltar ao Dashboard →
      </Link>
    </div>
  )
}
