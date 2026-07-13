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

  const showNewProcess = pathname === "/" || pathname === "/processos"

  return (
    <header className="flex h-15 min-w-0 shrink-0 items-center gap-3 border-b border-border bg-surface px-4 lg:px-7">
      {/* Hambúrguer — abre o drawer da sidebar abaixo de 1024px */}
      <button
        type="button"
        aria-label="Abrir menu de navegação"
        onClick={onMenuClick}
        className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md border border-border bg-ice text-text-3 lg:hidden"
      >
        <IconMenu size={18} />
      </button>

      <div className="min-w-0 flex-1">
        <h1 className="m-0 truncate font-display text-xl font-bold tracking-heading text-text-1">
          {tituloDaRota(pathname)}
        </h1>
      </div>

      {/* Busca global — oculta em telas estreitas */}
      <div className="hidden md:block">
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
        className="relative flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md border border-border bg-ice text-text-3"
      >
        <IconBell size={16} />
        <span className="absolute top-1.75 right-1.75 size-1.75 rounded-full border-2 border-ice bg-danger" />
      </button>

      {showNewProcess && (
        <Link
          href="/processos/novo"
          aria-label="Novo Processo"
          className="flex h-9 shrink-0 items-center gap-1.75 rounded-md bg-royal px-3 text-base font-semibold text-surface no-underline transition-colors hover:bg-royal-hover"
        >
          <IconPlus size={14} strokeWidth={2.5} />
          {/* Rótulo some no celular — fica só o ícone */}
          <span className="hidden sm:inline">Novo Processo</span>
        </Link>
      )}
    </header>
  )
}
