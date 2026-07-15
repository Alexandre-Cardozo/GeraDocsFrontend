import type { ReactNode } from "react"

import AppShell from "@/components/layout/AppShell"
import GuardaSessao from "@/components/layout/GuardaSessao"

/** Shell autenticado: guarda de sessão/RBAC + sidebar 240px navy + header 60px + conteúdo. */
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <GuardaSessao>
      <AppShell>{children}</AppShell>
    </GuardaSessao>
  )
}
