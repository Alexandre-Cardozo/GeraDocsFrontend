"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

import { SearchInput } from "@/components/ds"
import { IconBell, IconPlus } from "@/components/ds/icons"

/** Título do header por rota (equivalente ao viewTitles do protótipo). */
function tituloDaRota(pathname: string): string {
  if (pathname === "/") return "Dashboard"
  if (pathname === "/processos") return "Processos de Contratação"
  if (pathname === "/processos/novo") return "Novo Processo"
  if (/^\/processos\/[^/]+\/dfd/.test(pathname)) return "Verificação do DFD pela IA"
  if (/^\/processos\/[^/]+\/etp/.test(pathname)) return "Estudo Técnico Preliminar"
  if (pathname.startsWith("/aprovacoes")) return "Aprovações"
  if (pathname.startsWith("/documentos")) return "Documentos Gerados"
  if (pathname.startsWith("/configuracoes")) return "Configurações da Prefeitura"
  return "GeraDocs"
}

export default function Header() {
  const pathname = usePathname()
  const [busca, setBusca] = useState("")
  const [hoverCta, setHoverCta] = useState(false)

  const showNewProcess = pathname === "/" || pathname === "/processos"

  return (
    <header
      style={{
        height: "var(--header-height)",
        background: "var(--color-surface)",
        borderBottom: "var(--border-default)",
        display: "flex",
        alignItems: "center",
        paddingInline: 28,
        gap: 16,
        flexShrink: 0,
      }}
    >
      <div style={{ flex: 1 }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-xl)",
            fontWeight: 700,
            color: "var(--text-body)",
            margin: 0,
            letterSpacing: "var(--tracking-heading)",
          }}
        >
          {tituloDaRota(pathname)}
        </h1>
      </div>

      <SearchInput
        placeholder="Buscar processo, documento..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        kbd="⌘K"
      />

      <button
        type="button"
        aria-label="Notificações"
        style={{
          width: 36,
          height: 36,
          borderRadius: "var(--radius-md)",
          border: "var(--border-default)",
          background: "var(--color-ice)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          flexShrink: 0,
          color: "var(--text-secondary)",
        }}
      >
        <IconBell size={16} />
        <span
          style={{
            position: "absolute",
            top: 7,
            right: 7,
            width: 7,
            height: 7,
            background: "var(--color-danger)",
            borderRadius: "var(--radius-full)",
            border: "2px solid var(--color-ice)",
          }}
        />
      </button>

      {showNewProcess && (
        <Link
          href="/processos/novo"
          onMouseEnter={() => setHoverCta(true)}
          onMouseLeave={() => setHoverCta(false)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            background: hoverCta ? "var(--action-primary-hover)" : "var(--action-primary)",
            color: "var(--color-surface)",
            borderRadius: "var(--radius-md)",
            paddingInline: 16,
            height: 36,
            fontSize: 13,
            fontWeight: 600,
            transition: "var(--transition-bg)",
            flexShrink: 0,
            textDecoration: "none",
          }}
        >
          <IconPlus size={14} strokeWidth={2.5} />
          Novo Processo
        </Link>
      )}
    </header>
  )
}
