import type { ReactNode } from "react"

/** Shell mínimo das telas de autenticação — sem sidebar/header. */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-dvh">{children}</div>
}
