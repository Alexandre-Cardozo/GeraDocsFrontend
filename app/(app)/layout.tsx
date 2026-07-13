import type { ReactNode } from "react"

import AppShell from "@/components/layout/AppShell"

/** Shell autenticado: sidebar 240px navy (drawer no mobile) + header 60px + conteúdo rolável. */
export default function AppLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>
}
