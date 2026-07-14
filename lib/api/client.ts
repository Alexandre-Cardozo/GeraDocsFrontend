// Guarda explícita: o "banco" em memória abaixo é estado mutável de módulo e só
// pode viver no browser. Se algum RSC importar isto (ex.: prefetch no servidor),
// o build falha em vez de vazar estado entre requests/usuários.
import "client-only"

import {
  aprovacoes as aprovacoesFixture,
  documentos as documentosFixture,
  estatisticas as estatisticasFixture,
  parecerDFDBase,
  processos as processosFixture,
  resumoDocumentos as resumoDocumentosFixture,
  secoesPorTipoBase,
  tenant as tenantFixture,
  usuarioAtual,
} from "@/lib/mocks/fixtures"
import { dataBrasiliaISO, dataHoraBrasiliaISO } from "@/lib/format"
import type {
  DecisaoAprovacao,
  DocumentoGerado,
  EstatisticasDashboard,
  ItemAprovacao,
  NovoProcessoInput,
  ParecerDFD,
  Processo,
  ResumoDocumentos,
  SecaoETP,
  StatusProcesso,
  Tenant,
  TipoDocumento,
  TransicaoAprovacao,
  UsuarioAtual,
} from "@/lib/types"

/**
 * Cliente de API do GeraDocs — hoje resolve contra mocks em memória com
 * latência simulada; as assinaturas são as mesmas que o cliente gerado do
 * OpenAPI do backend Spring Boot terá. A integração real substitui apenas o
 * corpo destas funções (fetch/axios), tela nenhuma muda.
 */

const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v)) as T

/** Ano-série dos identificadores do órgão (PROC-/DOC-). Mantém a numeração coerente com o acervo. */
const ANO_SERIE = "2024"

function delay(ms = 350 + Math.random() * 350): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/* ── Estado em memória (persiste durante a sessão) ─────────────────────────── */
const db = {
  usuario: clone(usuarioAtual),
  processos: clone(processosFixture),
  /** Seções por documento — chave `${processoId}:${tipo}`. */
  secoes: new Map<string, SecaoETP[]>(),
  pareceresDFD: new Map<string, ParecerDFD>(),
  aprovacoes: clone(aprovacoesFixture),
  documentos: clone(documentosFixture),
  estatisticas: clone(estatisticasFixture),
  resumoDocumentos: clone(resumoDocumentosFixture),
  tenant: clone(tenantFixture),
  seqProcesso: 90,
  seqDocumento: 189,
}

function secoesDoDocumento(processoId: string, tipo: TipoDocumento): SecaoETP[] {
  const chave = `${processoId}:${tipo}`
  let secoes = db.secoes.get(chave)
  if (!secoes) {
    secoes = clone(secoesPorTipoBase[tipo])
    const jaGerado = db.documentos.some((d) => d.processoId === processoId && d.tipo === tipo)
    if (jaGerado) {
      // Documento já gerado → todas as seções contam como concluídas (progresso 100%).
      secoes = secoes.map((s) => ({ ...s, status: "Completo" }))
    } else if (!(tipo === "ETP" && processoId === "PROC-2024-089")) {
      // Só o ETP do processo de referência começa com seções pré-preenchidas.
      secoes = secoes.map((s) => ({ ...s, status: "Não iniciado", conteudo: "" }))
    }
    db.secoes.set(chave, secoes)
  }
  return secoes
}

/* ── Sessão / dashboard ────────────────────────────────────────────────────── */

export async function getUsuarioAtual(): Promise<UsuarioAtual> {
  await delay(120)
  return clone(db.usuario)
}

/** Atualiza a foto de perfil do usuário (data URL ou null para voltar ao padrão). */
export async function atualizarAvatar(avatarDataUrl: string | null): Promise<UsuarioAtual> {
  await delay(200)
  db.usuario = { ...db.usuario, avatarDataUrl }
  return clone(db.usuario)
}

export async function getEstatisticas(): Promise<EstatisticasDashboard> {
  await delay()
  return clone(db.estatisticas)
}

/* ── Processos ─────────────────────────────────────────────────────────────── */

export interface ListaProcessosParams {
  busca?: string
  status?: StatusProcesso | "todos"
  pagina?: number
  porPagina?: number
}

export interface Paginado<T> {
  itens: T[]
  total: number
  pagina: number
  totalPaginas: number
}

export async function getProcessos(params: ListaProcessosParams = {}): Promise<Paginado<Processo>> {
  await delay()
  const { busca = "", status = "todos", pagina = 1, porPagina = 8 } = params
  const filtrados = db.processos.filter((p) => {
    const matchStatus = status === "todos" || p.status === status
    const q = busca.trim().toLowerCase()
    const matchBusca = q === "" || p.objeto.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)
    return matchStatus && matchBusca
  })
  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / porPagina))
  const inicio = (pagina - 1) * porPagina
  return {
    itens: clone(filtrados.slice(inicio, inicio + porPagina)),
    total: filtrados.length,
    pagina,
    totalPaginas,
  }
}

export async function getProcesso(id: string): Promise<Processo> {
  await delay()
  const proc = db.processos.find((p) => p.id === id)
  if (!proc) throw new Error(`Processo ${id} não encontrado`)
  return clone(proc)
}

export async function getProximoNumeroProcesso(): Promise<string> {
  await delay(150)
  return `PROC-${ANO_SERIE}-${String(db.seqProcesso).padStart(3, "0")}`
}

export async function criarProcesso(input: NovoProcessoInput): Promise<Processo> {
  await delay(600)
  const id = `PROC-${ANO_SERIE}-${String(db.seqProcesso++).padStart(3, "0")}`
  const hoje = dataBrasiliaISO()
  const processo: Processo = {
    id,
    objeto: input.objeto || "Novo Processo de Contratação",
    objetoDemanda: input.objetoDemanda,
    modalidade: input.modalidade,
    secretaria: input.secretaria,
    status: "rascunho",
    valorEstimado: input.valorEstimado ?? 0,
    responsavel: db.usuario.nome,
    criadoEm: hoje,
    atualizadoEm: hoje,
    etpStatus: "Não iniciado",
    trStatus: "Não iniciado",
    documentos: input.documentos,
    fundamentoLegal: input.fundamentoLegal,
    ata: input.ata ?? null,
    fases: input.fases,
    dfdArquivo: input.dfdArquivo ?? null,
  }
  db.processos.unshift(processo)
  return clone(processo)
}

export interface AtualizarProcessoInput {
  id: string
  secretaria?: string
  objeto?: string
  objetoDemanda?: string
  dfdArquivo?: string | null
  documentos?: Array<TipoDocumento>
}

/** Edições feitas no hub do processo (secretaria, descrição, objeto da demanda, DFD, documentos). */
export async function atualizarProcesso(input: AtualizarProcessoInput): Promise<Processo> {
  await delay(400)
  const proc = db.processos.find((p) => p.id === input.id)
  if (!proc) throw new Error(`Processo ${input.id} não encontrado`)
  if (input.secretaria !== undefined) proc.secretaria = input.secretaria
  if (input.objeto !== undefined) proc.objeto = input.objeto
  if (input.objetoDemanda !== undefined) proc.objetoDemanda = input.objetoDemanda
  if (input.dfdArquivo !== undefined) proc.dfdArquivo = input.dfdArquivo
  if (input.documentos !== undefined) proc.documentos = input.documentos
  proc.atualizadoEm = dataBrasiliaISO()
  return clone(proc)
}

/* ── Verificação do DFD ────────────────────────────────────────────────────── */

/** Dispara a análise mockada do DFD (a UI mostra o progresso ~1s). */
export async function analisarDFD(processoId: string, arquivo: string): Promise<ParecerDFD> {
  await delay(900)
  // Registra a data/hora real da análise (fuso de Brasília).
  const parecer: ParecerDFD = { ...clone(parecerDFDBase), processoId, arquivo, analisadoEm: dataHoraBrasiliaISO() }
  db.pareceresDFD.set(processoId, parecer)
  return clone(parecer)
}

/** Parecer persistido no mock (null se o DFD ainda não foi analisado). */
export async function getParecerDFD(processoId: string): Promise<ParecerDFD | null> {
  await delay()
  const parecer = db.pareceresDFD.get(processoId)
  return parecer ? clone(parecer) : null
}

/* ── Seções de documento (ETP, TR, Cotação, Mapa) ──────────────────────────── */

export async function getSecoes(processoId: string, tipo: TipoDocumento): Promise<SecaoETP[]> {
  await delay()
  return clone(secoesDoDocumento(processoId, tipo))
}

export interface AtualizarSecaoInput {
  processoId: string
  tipo: TipoDocumento
  secaoId: string
  conteudo: string
  status?: SecaoETP["status"]
}

export async function atualizarSecao(input: AtualizarSecaoInput): Promise<SecaoETP> {
  await delay(400)
  const secoes = secoesDoDocumento(input.processoId, input.tipo)
  const secao = secoes.find((s) => s.id === input.secaoId)
  if (!secao) throw new Error(`Seção ${input.secaoId} não encontrada`)
  secao.conteudo = input.conteudo
  // Esvaziar uma seção antes concluída volta o status para "Não iniciado" —
  // senão o rail e o percentual do documento contariam seção vazia como completa.
  secao.status = input.status ?? (input.conteudo.trim() ? "Completo" : "Não iniciado")
  return clone(secao)
}

/** Geração de conteúdo por IA — simulada com delay maior. */
export async function gerarSecao(processoId: string, tipo: TipoDocumento, secaoId: string): Promise<SecaoETP> {
  await delay(1800)
  const secoes = secoesDoDocumento(processoId, tipo)
  const secao = secoes.find((s) => s.id === secaoId)
  if (!secao) throw new Error(`Seção ${secaoId} não encontrada`)
  const processo = db.processos.find((p) => p.id === processoId)
  const objeto = processo?.objetoDemanda || processo?.objeto || "objeto da contratação"
  secao.conteudo =
    `[Conteúdo gerado pela IA] ${secao.titulo} referente ao processo ${processoId} — ` +
    `${objeto}. Elaborado em conformidade com o ` +
    `${secao.incisoArt18}, considerando o DFD anexado, o PCA vigente e as informações prestadas pela ${processo?.secretaria ?? "secretaria demandante"}.`
  secao.status = "Completo"
  return clone(secao)
}

/* ── Aprovações ────────────────────────────────────────────────────────────── */

export async function getFilaAprovacoes(): Promise<ItemAprovacao[]> {
  await delay()
  return clone(db.aprovacoes)
}

export interface DecisaoInput {
  processoId: string
  decisao: DecisaoAprovacao
  comentario: string
}

export async function decidirAprovacao(input: DecisaoInput): Promise<ItemAprovacao> {
  await delay(500)
  const item = db.aprovacoes.find((a) => a.processoId === input.processoId)
  if (!item) throw new Error(`Item de aprovação ${input.processoId} não encontrado`)
  const agora = dataBrasiliaISO()
  const para: StatusProcesso =
    input.decisao === "aprovar" ? "aprovado" : input.decisao === "rejeitar" ? "rejeitado" : "em_revisao"
  const transicao: TransicaoAprovacao = {
    evento: input.decisao === "aprovar" ? "aprovacao" : input.decisao === "rejeitar" ? "rejeicao" : "retificacao",
    de: item.status,
    para,
    autor: usuarioAtual.nome,
    papel: "gestor_aprovador",
    data: agora,
    comentario: input.comentario,
  }
  item.status = para
  item.trilha.push(transicao)
  const processo = db.processos.find((p) => p.id === input.processoId)
  if (processo) processo.status = para
  return clone(item)
}

/* ── Documentos ────────────────────────────────────────────────────────────── */

export async function getDocumentos(): Promise<DocumentoGerado[]> {
  await delay()
  return clone(db.documentos)
}

export async function getResumoDocumentos(): Promise<ResumoDocumentos> {
  await delay()
  return clone(db.resumoDocumentos)
}

/** Tamanho aproximado por tipo de documento (KB) — usado no registro gerado. */
const TAMANHO_POR_TIPO: Record<TipoDocumento, number> = { ETP: 312, TR: 348, "Cotação": 196, Mapa: 128 }

export interface GerarDocumentoInput {
  processoId: string
  tipo: TipoDocumento
}

/**
 * Finaliza um documento do processo: cria (ou, se já existir do mesmo tipo,
 * substitui) o registro em Documentos Gerados e atualiza os indicadores.
 */
export async function gerarDocumento(input: GerarDocumentoInput): Promise<DocumentoGerado> {
  await delay(700)
  const processo = db.processos.find((p) => p.id === input.processoId)
  const objeto = processo?.objeto ?? "Processo de Contratação"
  const tamanhoKB = TAMANHO_POR_TIPO[input.tipo]

  // Documento finalizado → todas as suas seções ficam concluídas (inclui a última).
  for (const secao of secoesDoDocumento(input.processoId, input.tipo)) secao.status = "Completo"

  const existente = db.documentos.find((d) => d.processoId === input.processoId && d.tipo === input.tipo)

  if (existente) {
    // Regeração — substitui a versão anterior no lugar; não altera os indicadores.
    existente.titulo = `${input.tipo} — ${objeto}`
    existente.geradoEm = dataHoraBrasiliaISO()
    existente.tamanho = `${tamanhoKB} KB`
    existente.status = "final"
    if (processo) processo.atualizadoEm = dataBrasiliaISO()
    return clone(existente)
  }

  const doc: DocumentoGerado = {
    id: `DOC-${ANO_SERIE}-${String(++db.seqDocumento).padStart(4, "0")}`,
    processoId: input.processoId,
    titulo: `${input.tipo} — ${objeto}`,
    tipo: input.tipo,
    formato: input.tipo === "Mapa" ? "PDF" : "DOCX + PDF",
    geradoEm: dataHoraBrasiliaISO(),
    tamanho: `${tamanhoKB} KB`,
    status: "final",
  }
  db.documentos.unshift(doc)

  // Indicadores da tela de Documentos e do dashboard acompanham a nova geração.
  db.resumoDocumentos.total += 1
  db.resumoDocumentos.esteMes += 1
  db.resumoDocumentos.armazenamentoMB = Math.round((db.resumoDocumentos.armazenamentoMB + tamanhoKB / 1024) * 10) / 10
  db.estatisticas.documentosGerados += 1
  db.estatisticas.documentosSemana += 1
  if (input.tipo === "ETP") db.estatisticas.etpsConcluidos += 1

  // Reflete a conclusão no processo de origem.
  if (processo) {
    if (input.tipo === "ETP") processo.etpStatus = "Completo"
    if (input.tipo === "TR") processo.trStatus = "Completo"
    processo.atualizadoEm = dataBrasiliaISO()
  }
  return clone(doc)
}

/* ── Configurações do tenant ───────────────────────────────────────────────── */

export async function getConfigTenant(): Promise<Tenant> {
  await delay()
  return clone(db.tenant)
}

export async function atualizarConfigTenant(patch: Partial<Tenant>): Promise<Tenant> {
  await delay(450)
  db.tenant = { ...db.tenant, ...clone(patch) }
  return clone(db.tenant)
}
