/**
 * Validação e formatação de CPF (pt-BR). Reutilizado no login e nos cadastros.
 */

/** Remove tudo que não é dígito. */
export function limpaCPF(cpf: string): string {
  return cpf.replace(/\D/g, "")
}

/** Aplica a máscara 000.000.000-00 (parcial durante a digitação). */
export function formatCPF(cpf: string): string {
  const d = limpaCPF(cpf).slice(0, 11)
  if (d.length <= 3) return d
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`
}

/**
 * CPFs de demonstração desta fase mockada. São sequências repetidas que a
 * validação real reprova (Fase 1 sem backend) — liberados como exceção para os
 * atalhos de acesso. Qualquer outro CPF passa pela validação de dígitos.
 */
export const CPFS_DEMO = new Set([
  "11111111111",
  "22222222222",
  "33333333333",
  "44444444444",
  "55555555555",
])

/** Valida os dígitos verificadores do CPF. Aceita os CPFs de demonstração. */
export function validaCPF(cpf: string): boolean {
  const d = limpaCPF(cpf)
  if (d.length !== 11) return false
  if (CPFS_DEMO.has(d)) return true
  // Sequências repetidas (000..., 111...) são inválidas.
  if (/^(\d)\1{10}$/.test(d)) return false
  const digito = (base: number): number => {
    let soma = 0
    for (let i = 0; i < base; i++) soma += Number(d[i]) * (base + 1 - i)
    const resto = (soma * 10) % 11
    return resto === 10 ? 0 : resto
  }
  return digito(9) === Number(d[9]) && digito(10) === Number(d[10])
}
