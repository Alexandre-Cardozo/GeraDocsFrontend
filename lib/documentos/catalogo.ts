/**
 * Catálogo de documentos — fonte única dos metadados por tipo.
 *
 * Substitui os mapas que antes viviam duplicados no hub, no editor, no wizard,
 * na tela de Documentos, na verificação do DFD e no client. Qualquer tela que
 * precise do título, da cor, do slug, da ordem ou das dependências de um
 * documento lê daqui.
 */

import { secoesPorTipoBase } from "@/lib/documentos/secoes"
import type { Modalidade, TipoDocumento } from "@/lib/types"

export interface MetaDocumento {
  tipo: TipoDocumento
  /** Slug do tipo no editor: /processos/documento?id=<id>&tipo=<slug>. */
  slug: string
  titulo: string
  descricao: string
  /** Posição na ordem canônica do fluxo de contratação (1 = primeiro). */
  ordem: number
  /** Fundamento do documento como um todo, citado literalmente. */
  fundamento: string
  /** Classes de token do DS para o chip do tipo. */
  chip: string
  /** Documentos que precisam estar gerados antes que este possa ser elaborado. */
  requer: TipoDocumento[]
  formato: string
  /** Tamanho aproximado do arquivo gerado, em KB. */
  tamanhoKB: number
}

/**
 * Ordem canônica: a Cotação embasa a estimativa de valor do ETP (Art. 18, § 1º,
 * VI); o Mapa de Riscos é concomitante ao ETP; o TR se fundamenta no ETP
 * (Art. 6º, XXIII, 'b'); o Edital tem o TR como anexo (Art. 25, § 1º); e a
 * minuta de contrato é anexo do edital, vinculada a ele (Art. 92, II).
 */
export const CATALOGO: Record<TipoDocumento, MetaDocumento> = {
  "Cotação": {
    tipo: "Cotação",
    slug: "cotacao",
    titulo: "Cotação de Mercado",
    descricao: "Pesquisa de preços que embasa a estimativa de valor da contratação",
    ordem: 1,
    fundamento: "Art. 23, Lei 14.133/21",
    chip: "bg-doc-cotacao-bg text-doc-cotacao",
    requer: [],
    formato: "DOCX + PDF",
    tamanhoKB: 196,
  },
  ETP: {
    tipo: "ETP",
    slug: "etp",
    titulo: "Estudo Técnico Preliminar",
    descricao: "Fundamenta a necessidade, os requisitos e a viabilidade da contratação",
    ordem: 2,
    fundamento: "Art. 18, § 1º, Lei 14.133/21",
    chip: "bg-doc-etp-bg text-doc-etp",
    requer: [],
    formato: "DOCX + PDF",
    tamanhoKB: 312,
  },
  Mapa: {
    tipo: "Mapa",
    slug: "mapa",
    titulo: "Mapa de Riscos",
    descricao: "Identifica e trata os riscos que podem comprometer a contratação",
    ordem: 3,
    fundamento: "Art. 18, X, Lei 14.133/21",
    chip: "bg-doc-mapa-bg text-doc-mapa",
    requer: [],
    formato: "PDF",
    tamanhoKB: 128,
  },
  TR: {
    tipo: "TR",
    slug: "tr",
    titulo: "Termo de Referência",
    descricao: "Define as condições de execução do objeto e se fundamenta no ETP",
    ordem: 4,
    fundamento: "Art. 6º, XXIII, Lei 14.133/21",
    chip: "bg-doc-tr-bg text-doc-tr",
    requer: ["ETP"],
    formato: "DOCX + PDF",
    tamanhoKB: 348,
  },
  Edital: {
    tipo: "Edital",
    slug: "edital",
    titulo: "Edital de Licitação",
    descricao: "Convoca os interessados e fixa as regras da fase de seleção",
    ordem: 5,
    fundamento: "Art. 25, Lei 14.133/21",
    chip: "bg-doc-edital-bg text-doc-edital",
    requer: ["TR"],
    formato: "DOCX + PDF",
    tamanhoKB: 424,
  },
  Contrato: {
    tipo: "Contrato",
    slug: "contrato",
    titulo: "Minuta de Contrato",
    descricao: "Reúne as cláusulas necessárias e integra os anexos do edital",
    ordem: 6,
    fundamento: "Art. 92, Lei 14.133/21",
    chip: "bg-doc-contrato-bg text-doc-contrato",
    requer: ["TR"],
    formato: "DOCX + PDF",
    tamanhoKB: 386,
  },
}

/** Todos os tipos na ordem canônica do fluxo. */
export const ORDEM_FLUXO: TipoDocumento[] = (Object.values(CATALOGO) as MetaDocumento[])
  .sort((a, b) => a.ordem - b.ordem)
  .map((m) => m.tipo)

/**
 * Documentos cabíveis a cada modalidade.
 *
 * Contratação direta (Dispensa e Inexigibilidade) não gera edital de licitação:
 * o Art. 72 instrui o processo com DFD, ETP *quando for o caso*, TR, estimativa
 * de despesa, parecer jurídico e autorização. Por isso o ETP é opcional e o
 * Edital não é oferecido. No Credenciamento (Art. 79), o edital é o de
 * chamamento público.
 */
export const REGRA_MODALIDADE: Record<
  Modalidade,
  { obrigatorios: TipoDocumento[]; opcionais: TipoDocumento[] }
> = {
  "Pregão Eletrônico": { obrigatorios: ["ETP", "TR", "Edital"], opcionais: ["Cotação", "Mapa", "Contrato"] },
  "Concorrência": { obrigatorios: ["ETP", "TR", "Edital"], opcionais: ["Cotação", "Mapa", "Contrato"] },
  "Diálogo Competitivo": { obrigatorios: ["ETP", "TR", "Edital"], opcionais: ["Cotação", "Mapa", "Contrato"] },
  "Credenciamento": { obrigatorios: ["ETP", "TR", "Edital"], opcionais: ["Cotação", "Mapa", "Contrato"] },
  "Concurso": { obrigatorios: ["ETP", "Edital"], opcionais: ["Cotação", "Mapa", "TR", "Contrato"] },
  "Leilão": { obrigatorios: ["Edital"], opcionais: ["Cotação", "Mapa", "ETP", "TR", "Contrato"] },
  "Dispensa Art. 75": { obrigatorios: ["TR"], opcionais: ["ETP", "Cotação", "Mapa", "Contrato"] },
  "Inexigibilidade": { obrigatorios: ["TR"], opcionais: ["ETP", "Cotação", "Mapa", "Contrato"] },
}

/** Tipos cabíveis à modalidade (obrigatórios + opcionais), na ordem do fluxo. */
export function documentosDaModalidade(modalidade: Modalidade): TipoDocumento[] {
  const regra = REGRA_MODALIDADE[modalidade]
  return ordenar([...regra.obrigatorios, ...regra.opcionais])
}

export function ehObrigatorio(modalidade: Modalidade, tipo: TipoDocumento): boolean {
  return REGRA_MODALIDADE[modalidade].obrigatorios.includes(tipo)
}

/** Reordena uma lista de tipos segundo a ordem canônica do fluxo. */
export function ordenar(tipos: TipoDocumento[]): TipoDocumento[] {
  return [...tipos].sort((a, b) => CATALOGO[a].ordem - CATALOGO[b].ordem)
}

/** Resolve o slug da URL para o tipo. Retorna undefined se o slug não existir. */
export function porSlug(slug: string): TipoDocumento | undefined {
  return ORDEM_FLUXO.find((tipo) => CATALOGO[tipo].slug === slug)
}

/**
 * Dependências que ainda travam o documento. Vazio = liberado para elaborar.
 *
 * Só trava o que o processo de fato contém: no Leilão, por exemplo, o Edital é
 * obrigatório e não há TR (a avaliação do bem faz esse papel), então o Edital
 * não pode ficar esperando um documento que o processo nunca terá.
 */
export function pendencias(
  tipo: TipoDocumento,
  doProcesso: TipoDocumento[],
  gerados: TipoDocumento[]
): TipoDocumento[] {
  return CATALOGO[tipo].requer.filter((dep) => doProcesso.includes(dep) && !gerados.includes(dep))
}

/** Número de seções do documento — usado pelo wizard e pelo painel de fases. */
export function totalSecoes(tipo: TipoDocumento): number {
  return secoesPorTipoBase[tipo].length
}
