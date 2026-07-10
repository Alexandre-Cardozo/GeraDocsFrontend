import type { ReactNode } from "react"

import Header from "@/components/chrome/Header"
import Sidebar from "@/components/chrome/Sidebar"

/** Shell autenticado: sidebar 240px navy + header 60px + conteúdo rolável. */
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--surface-app)" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Header />
        <main style={{ flex: 1, overflowY: "auto", padding: 0 }}>{children}</main>
      </div>
    </div>
  )
}
