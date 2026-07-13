import type { ReactNode } from "react"

/**
 * Cabeçalho de tabela padrão do DS: uppercase 11px, tracking amplo, texto muted
 * sobre fundo ice. Único dono do estilo de <th> — antes copiado em 4 páginas.
 */
export function Th({ children, className = "" }: { children?: ReactNode; className?: string }) {
  return (
    <th
      className={`px-4 py-2.75 text-left text-xs font-semibold tracking-caps whitespace-nowrap text-text-muted uppercase ${className}`}
    >
      {children}
    </th>
  )
}
