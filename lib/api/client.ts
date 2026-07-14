// Guarda explícita: o "banco" em memória abaixo é estado mutável de módulo e só
// pode viver no browser. Se algum RSC importar isto (ex.: prefetch no servidor),
// o build falha em vez de vazar estado entre requests/usuários.
import "client-only"

import {
  aprovacoes as aprovacoesFixture,
  documentos as documentosFixture,
  estatisticas,
  parecerDFDBase,
  processos as processosFixture,
  secoesETPBase,
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
  SecaoETP,
  StatusProcesso,
  Tenant,
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

function delay(ms = 350 + Math.random() * 350): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/* ── Estado em memória (persiste durante a sessão) ─────────────────────────── */
const db = {
  usuario: clone(usuarioAtual),
  processos: clone(processosFixture),
  secoesETP: new Map<string, SecaoETP[]>(),
  pareceresDFD: new Map<string, ParecerDFD>(),
  aprovacoes: clone(aprovacoesFixture),
  documentos: clone(documentosFixture),
  tenant: clone(tenantFixture),
  seqProcesso: 90,
}

function secoesDoProcesso(id: string): SecaoETP[] {
  let secoes = db.secoesETP.get(id)
  if (!secoes) {
    secoes = clone(secoesETPBase)
    // Processos que não o de referência começam com o ETP zerado.
    if (id !== "PROC-2024-089") {
      secoes = secoes.map((s) => ({ ...s, status: "Não iniciado", conteudo: "" }))
    }
    db.secoesETP.set(id, secoes)
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
  return clone(estatisticas)
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
  return `PROC-2024-${String(db.seqProcesso).padStart(3, "0")}`
}

export async function criarProcesso(input: NovoProcessoInput): Promise<Processo> {
  await delay(600)
  const id = `PROC-2024-${String(db.seqProcesso++).padStart(3, "0")}`
  const hoje = dataBrasiliaISO()
  const processo: Processo = {
    id,
    objeto: input.objeto || "Novo Processo de Contratação",
    modalidade: input.modalidade,
    secretaria: input.secretaria,
    status: "rascunho",
    valorEstimado: input.valorEstimado ?? 0,
    responsavel: db.usuario.nome,
    criadoEm: hoje,
    atualizadoEm: hoje,
    etpStatus: "Não iniciado",
    trStatus: "Não iniciado",
    fundamentoLegal: input.fundamentoLegal,
    ata: input.ata ?? null,
    fases: input.fases,
    dfdArquivo: input.dfdArquivo ?? null,
  }
  db.processos.unshift(processo)
  return clone(processo)
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

/* ── ETP ───────────────────────────────────────────────────────────────────── */

export async function getSecoesETP(processoId: string): Promise<SecaoETP[]> {
  await delay()
  return clone(secoesDoProcesso(processoId))
}

export interface AtualizarSecaoInput {
  processoId: string
  secaoId: string
  conteudo: string
  status?: SecaoETP["status"]
}

export async function atualizarSecaoETP(input: AtualizarSecaoInput): Promise<SecaoETP> {
  await delay(400)
  const secoes = secoesDoProcesso(input.processoId)
  const secao = secoes.find((s) => s.id === input.secaoId)
  if (!secao) throw new Error(`Seção ${input.secaoId} não encontrada`)
  secao.conteudo = input.conteudo
  // Esvaziar uma seção antes concluída volta o status para "Não iniciado" —
  // senão o rail e o percentual do ETP contariam seção vazia como completa.
  secao.status = input.status ?? (input.conteudo.trim() ? "Completo" : "Não iniciado")
  return clone(secao)
}

/** Geração de conteúdo por IA — simulada com delay maior. */
export async function gerarSecaoETP(processoId: string, secaoId: string): Promise<SecaoETP> {
  await delay(1800)
  const secoes = secoesDoProcesso(processoId)
  const secao = secoes.find((s) => s.id === secaoId)
  if (!secao) throw new Error(`Seção ${secaoId} não encontrada`)
  const processo = db.processos.find((p) => p.id === processoId)
  secao.conteudo =
    `[Conteúdo gerado pela IA] ${secao.titulo} referente ao processo ${processoId} — ` +
    `${processo?.objeto ?? "objeto da contratação"}. Elaborado em conformidade com o ` +
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
