/** Formatação pt-BR — IDs e valores monetários em monospace com formato exato. */

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
})

/** 485000 → "R$ 485.000,00" (espaço comum, como no protótipo). */
export function formatBRL(valor: number): string {
  return brl.format(valor).replace(/ /g, " ")
}

/** ISO "2024-07-05" → "05/07/2024". */
export function formatData(iso: string): string {
  const [ano, mes, dia] = iso.slice(0, 10).split("-")
  return `${dia}/${mes}/${ano}`
}

/** ISO "2024-07-03T16:42:00" → "03/07/2024 — 16:42". */
export function formatDataHora(iso: string): string {
  return `${formatData(iso)} — ${iso.slice(11, 16)}`
}
