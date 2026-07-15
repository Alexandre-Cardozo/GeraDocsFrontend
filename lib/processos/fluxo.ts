/**
 * Máquina de estados do processo de contratação.
 *
 * A tabela abaixo é a **fonte única** das transições — antes elas viviam
 * embutidas em `decidirAprovacao`, sem cobrir envio nem conclusão. Aqui está
 * apenas a estrutura do grafo (de → para por evento e papel); as regras de
 * negócio (documentos gerados, parecer jurídico) são guardas aplicadas no
 * client, porque dependem de dados do processo.
 *
 * Usa somente os seis status fixos de `StatusProcesso` — nenhum status novo é
 * inventado (o vocabulário é normativo). Por isso o parecer jurídico (Art. 53)
 * não é um status, e sim um gate no checklist antes de encaminhar ao gestor.
 */

import type { EventoAprovacao, PapelUsuario, StatusProcesso } from "@/lib/types"

export interface Transicao {
  evento: EventoAprovacao
  de: StatusProcesso
  para: StatusProcesso
  /** Papel que executa a transição no fluxo real. */
  papel: PapelUsuario
}

/**
 * Rascunho → Em Revisão → Aguardando → Aprovado → Concluído,
 * com Retificação devolvendo de Aguardando para Em Revisão e Rejeição terminal.
 * O evento `envio` cobre tanto o envio do elaborador quanto o encaminhamento da
 * comissão (dois passos, mesmo evento — como na trilha de auditoria).
 */
export const TRANSICOES: Transicao[] = [
  { evento: "envio", de: "rascunho", para: "em_revisao", papel: "servidor_compras" },
  { evento: "envio", de: "em_revisao", para: "aguardando", papel: "comissao" },
  { evento: "aprovacao", de: "aguardando", para: "aprovado", papel: "gestor_aprovador" },
  { evento: "rejeicao", de: "aguardando", para: "rejeitado", papel: "gestor_aprovador" },
  { evento: "retificacao", de: "aguardando", para: "em_revisao", papel: "gestor_aprovador" },
  { evento: "conclusao", de: "aprovado", para: "concluido", papel: "gestor_aprovador" },
]

/** Rótulos dos eventos (usados na trilha de auditoria). */
export const EVENTO_LABEL: Record<EventoAprovacao, string> = {
  envio: "Envio",
  aprovacao: "Aprovação",
  rejeicao: "Rejeição",
  retificacao: "Solicitação de Retificação",
  conclusao: "Conclusão",
}

/** A transição que sai de `de` sob `evento`, se existir. */
export function transicaoDe(de: StatusProcesso, evento: EventoAprovacao): Transicao | undefined {
  return TRANSICOES.find((t) => t.de === de && t.evento === evento)
}

/** Há uma transição válida saindo de `de` sob `evento`? (só o grafo — sem guardas de negócio) */
export function podeEmitir(de: StatusProcesso, evento: EventoAprovacao): boolean {
  return transicaoDe(de, evento) !== undefined
}

/** Status resultante de aplicar `evento` a `de`, ou `undefined` se a transição não existe. */
export function proximoStatus(de: StatusProcesso, evento: EventoAprovacao): StatusProcesso | undefined {
  return transicaoDe(de, evento)?.para
}
