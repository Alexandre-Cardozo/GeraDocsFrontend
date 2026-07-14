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

/** Fuso oficial de Brasília — usado nas saudações e na data do Dashboard. */
const FUSO_BRASILIA = "America/Sao_Paulo"

/** Hora do dia (0–23) no fuso de Brasília. */
export function horaBrasilia(d: Date = new Date()): number {
  const partes = new Intl.DateTimeFormat("en-US", {
    timeZone: FUSO_BRASILIA,
    hour: "2-digit",
    hour12: false,
    hourCycle: "h23",
  }).formatToParts(d)
  return Number(partes.find((p) => p.type === "hour")?.value ?? "0")
}

/** Saudação conforme o período do dia em Brasília: Bom dia / Boa tarde / Boa noite. */
export function saudacao(d: Date = new Date()): string {
  const h = horaBrasilia(d)
  if (h >= 5 && h < 12) return "Bom dia"
  if (h >= 12 && h < 18) return "Boa tarde"
  return "Boa noite"
}

/** Ano vigente (4 dígitos) no fuso de Brasília. */
export function anoBrasilia(d: Date = new Date()): number {
  const partes = new Intl.DateTimeFormat("en-US", { timeZone: FUSO_BRASILIA, year: "numeric" }).formatToParts(d)
  return Number(partes.find((p) => p.type === "year")?.value ?? "0")
}

/** Data atual como ISO "AAAA-MM-DD" no fuso de Brasília (para registrar em fixtures/mocks). */
export function dataBrasiliaISO(d: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: FUSO_BRASILIA,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d)
}

/** Data+hora atual como ISO "AAAA-MM-DDTHH:mm:ss" no fuso de Brasília. */
export function dataHoraBrasiliaISO(d: Date = new Date()): string {
  const hora = new Intl.DateTimeFormat("en-GB", {
    timeZone: FUSO_BRASILIA,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(d)
  return `${dataBrasiliaISO(d)}T${hora}`
}

/** Data por extenso em pt-BR no fuso de Brasília: "Segunda-feira, 07 de julho de 2024". */
export function dataPorExtenso(d: Date = new Date()): string {
  const texto = new Intl.DateTimeFormat("pt-BR", {
    timeZone: FUSO_BRASILIA,
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(d)
  // Intl retorna com inicial minúscula ("segunda-feira, ...") — capitaliza a primeira letra.
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}
