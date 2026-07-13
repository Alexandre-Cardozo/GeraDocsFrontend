import type { CSSProperties, ReactNode } from "react"

/**
 * Cabeçalho de tabela padrão do DS: uppercase 11px, tracking amplo, texto muted
 * sobre fundo ice. Único dono do estilo de <th> — antes copiado em 4 páginas.
 */
export function Th({ children, style }: { children?: ReactNode; style?: CSSProperties }) {
  return (
    <th
      style={{
        paddingBlock: 11,
        paddingInline: 16,
        textAlign: "left",
        fontSize: 11,
        color: "var(--color-text-muted)",
        fontWeight: 600,
        letterSpacing: "var(--tracking-caps)",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </th>
  )
}
