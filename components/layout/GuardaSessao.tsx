"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect, type ReactNode } from "react"

import { useSessao } from "@/lib/api/hooks"
import { rotaPermitida } from "@/lib/auth/acesso"

/**
 * Guarda do shell autenticado. Sem sessão → /login. Com sessão mas sem acesso à
 * rota (RBAC) → volta para "/". Enquanto resolve a sessão, mostra um splash.
 * É client-side porque a sessão vive no navegador (mock da Fase 1).
 */
export default function GuardaSessao({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const sessao = useSessao()

  const perfil = sessao.data?.usuario.perfilAcesso
  const semSessao = sessao.isSuccess && sessao.data === null
  const semAcesso = perfil !== undefined && !rotaPermitida(perfil, pathname)

  useEffect(() => {
    if (semSessao) router.replace("/login")
    else if (semAcesso) router.replace("/")
  }, [semSessao, semAcesso, router])

  if (sessao.isPending || semSessao || semAcesso) {
    return (
      <div className="flex h-dvh items-center justify-center bg-ice">
        <div className="flex flex-col items-center gap-3">
          <span className="size-8 animate-spin rounded-full border-2 border-border border-t-royal" />
          <span className="text-sm text-text-3">Carregando…</span>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
