"use client"

import { useState, type ReactNode } from "react"

import Header from "@/components/chrome/Header"
import Sidebar from "@/components/chrome/Sidebar"

/**
 * Shell autenticado responsivo: no laptop (≥1024px) a sidebar é fixa de 240px;
 * abaixo disso vira drawer off-canvas aberto pelo hambúrguer do Header,
 * fechado ao navegar ou tocar no backdrop.
 */
export default function AppShell({ children }: { children: ReactNode }) {
  const [sidebarAberta, setSidebarAberta] = useState(false)

  return (
    <div style={{ display: "flex", height: "100dvh", overflow: "hidden", background: "var(--surface-app)" }}>
      <Sidebar aberta={sidebarAberta} onNavigate={() => setSidebarAberta(false)} />
      {sidebarAberta && (
        <div className="gd-sidebar-backdrop" onClick={() => setSidebarAberta(false)} aria-hidden />
      )}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Header onMenuClick={() => setSidebarAberta(true)} />
        <main style={{ flex: 1, overflowY: "auto", padding: 0 }}>{children}</main>
      </div>
    </div>
  )
}
