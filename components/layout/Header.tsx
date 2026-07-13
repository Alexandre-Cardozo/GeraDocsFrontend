"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

import { SearchInput } from "@/components/ui"
import { IconBell, IconMenu, IconPlus } from "@/components/ui/icons"

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

export default function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname()
  const [busca, setBusca] = useState("")
  const [hoverCta, setHoverCta] = useState(false)

  const showNewProcess = pathname === "/" || pathname === "/processos"

  return (
    <header
      className="gd-header"
      style={{
        height: "var(--header-height)",
        background: "var(--color-surface)",
        borderBottom: "var(--border-default)",
        display: "flex",
        alignItems: "center",
        gap: 12,
        flexShrink: 0,
        minWidth: 0,
      }}
    >
      {/* Hambúrguer — abre o drawer da sidebar abaixo de 1024px */}
      <button
        type="button"
        className="gd-only-mobile"
        aria-label="Abrir menu de navegação"
        onClick={onMenuClick}
        style={{
          width: 36,
          height: 36,
          borderRadius: "var(--radius-md)",
          border: "var(--border-default)",
          background: "var(--color-ice)",
          cursor: "pointer",
          flexShrink: 0,
          color: "var(--text-secondary)",
        }}
      >
        <IconMenu size={18} />
      </button>

      <div style={{ flex: 1, minWidth: 0 }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-xl)",
            fontWeight: 700,
            color: "var(--text-body)",
            margin: 0,
            letterSpacing: "var(--tracking-heading)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {tituloDaRota(pathname)}
        </h1>
      </div>

      {/* Busca global — oculta em telas estreitas */}
      <div className="gd-hide-sm">
        <SearchInput
          placeholder="Buscar processo, documento..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          kbd="⌘K"
        />
      </div>

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
            border: "var(--border-ice-2)",
          }}
        />
      </button>

      {showNewProcess && (
        <Link
          href="/processos/novo"
          aria-label="Novo Processo"
          onMouseEnter={() => setHoverCta(true)}
          onMouseLeave={() => setHoverCta(false)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            background: hoverCta ? "var(--action-primary-hover)" : "var(--action-primary)",
            color: "var(--color-surface)",
            borderRadius: "var(--radius-md)",
            paddingInline: 12,
            height: 36,
            fontSize: 13,
            fontWeight: 600,
            transition: "var(--transition-bg)",
            flexShrink: 0,
            textDecoration: "none",
          }}
        >
          <IconPlus size={14} strokeWidth={2.5} />
          {/* Rótulo some no celular — fica só o ícone */}
          <span className="gd-hide-xs">Novo Processo</span>
        </Link>
      )}
    </header>
  )
}
