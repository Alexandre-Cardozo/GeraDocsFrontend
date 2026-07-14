/**
 * Modelo de domínio do GeraDocs — congelado nesta fase (seção 3.1.6 do plano).
 * As assinaturas espelham o que o cliente gerado do OpenAPI do Spring Boot
 * exporá; a troca de mocks por HTTP não deve alterar estes tipos.
 */

/** Vocabulário fixo de status de processo. */
export type StatusProcesso =
  | "rascunho"
  | "em_revisao"
  | "aguardando"
  | "aprovado"
  | "rejeitado"
  | "concluido"

export const STATUS_PROCESSO_LABEL: Record<StatusProcesso, string> = {
  rascunho: "Rascunho",
  em_revisao: "Em Revisão",
  aguardando: "Aguardando",
  aprovado: "Aprovado",
  rejeitado: "Rejeitado",
  concluido: "Concluído",
}

/** Estados de documento/seção (vocabulário fixo). */
export type StatusDocumento =
  | "Completo"
  | "Em andamento"
  | "Em revisão"
  | "Não iniciado"
  | "Rejeitado"

/** Tags fixas. */
export type TagProcesso = "Obrigatório" | "Opcional" | "Recomendado" | "Urgente"

/**
 * Modalidades de licitação da Lei 14.133/21 (Art. 28) + formas de contratação
 * direta e procedimento auxiliar tratados como opções no wizard.
 */
export type Modalidade =
  | "Pregão Eletrônico"
  | "Concorrência"
  | "Concurso"
  | "Leilão"
  | "Diálogo Competitivo"
  | "Dispensa Art. 75"
  | "Inexigibilidade"
  | "Credenciamento"

/** Modo de gestão da Ata de Registro de Preços. */
export type ModoATA = "anexar" | "delegar" | "combinado"

export interface ConfigATA {
  modo: ModoATA
  motivo?: string
  arquivo?: string | null
}

export interface Processo {
  /** Formato PROC-AAAA-NNN. */
  id: string
  /** Descrição/nomenclatura do processo — identifica-o no painel, listas e documentos. */
  objeto: string
  /** Objeto da demanda (contratação em si) — trabalha junto com o DFD e alimenta o ETP. */
  objetoDemanda?: string
  modalidade: Modalidade
  secretaria: string
  status: StatusProcesso
  /** Valor estimado em centavos não — em reais (number); formatar com formatBRL. */
  valorEstimado: number
  responsavel: string
  criadoEm: string
  atualizadoEm: string
  etpStatus: StatusDocumento
  trStatus: StatusDocumento
  /** Documentos solicitados para o processo (definidos no wizard, editáveis no hub). */
  documentos: Array<TipoDocumento>
  fundamentoLegal?: string
  /** Flags do modo de ATA (anexar / delegar busca à IA / combinado). */
  ata?: ConfigATA | null
  fases: {
    verificacaoDFD: boolean
    retificacao: boolean
  }
  dfdArquivo?: string | null
  urgente?: boolean
}

export interface NovoProcessoInput {
  objeto: string
  objetoDemanda?: string
  modalidade: Modalidade
  secretaria: string
  valorEstimado?: number
  fundamentoLegal?: string
  dfdArquivo?: string | null
  ata?: ConfigATA | null
  documentos: Array<TipoDocumento>
  fases: {
    verificacaoDFD: boolean
    retificacao: boolean
  }
}

/** Painel especial do editor acionado por uma seção (ver components/documentos/paineis.tsx). */
export type PainelSecao = "ata" | "quantidades" | "valor"

/**
 * Seção de um documento gerável (ETP, TR, Cotação, Mapa, Edital, Contrato).
 * A estrutura seccional de cada tipo vive em `lib/documentos/secoes.ts`.
 */
export interface SecaoDocumento {
  /** Ordinal da seção dentro do documento ("1", "2", ...). */
  id: string
  titulo: string
  status: StatusDocumento
  /**
   * Seção indispensável. No ETP são as do Art. 18, § 2º (incisos I, IV, VI, VIII
   * e XIII); as demais são dispensáveis mediante justificativa.
   */
  obrigatoria: boolean
  conteudo: string
  /** Frase de orientação — o usuário sempre sabe o que escrever e por quê. */
  hint: string
  /** Fundamento citado literalmente (ex.: "Art. 18, § 1º, I, Lei 14.133/21"). */
  fundamentoLegal: string
  /** Painel especial do editor, quando a seção tem um. */
  painel?: PainelSecao
}

/** Achado do parecer da IA sobre o DFD. */
export interface AchadoDFD {
  tipo: "conformidade" | "alerta"
  severidade: "info" | "recomendacao" | "atencao"
  descricao: string
  /** Fundamentação citada literalmente (ex.: "PCA 2025 — item 47", "Art. 11 do Decreto 7.746/2012"). */
  fundamentacao?: string
}

export interface ParecerDFD {
  processoId: string
  arquivo: string
  analisadoEm: string
  /** Nota 0–100. */
  nota: number
  classificacao: string
  achados: AchadoDFD[]
}

/** Papéis do fluxo de aprovação. */
export type PapelUsuario =
  | "servidor_compras"
  | "secretaria_demandante"
  | "comissao"
  | "juridico"
  | "gestor_aprovador"
  | "admin_lahhm"

export const PAPEL_LABEL: Record<PapelUsuario, string> = {
  servidor_compras: "Servidor de Compras",
  secretaria_demandante: "Secretaria Demandante",
  comissao: "Comissão de Contratação",
  juridico: "Jurídico",
  gestor_aprovador: "Gestor Aprovador",
  admin_lahhm: "Admin LAHHM",
}

/**
 * Máquina de estados:
 * Rascunho → Em Revisão → (Retificação → Em Revisão) → Aprovado | Rejeitado → Concluído.
 */
export type EventoAprovacao = "envio" | "aprovacao" | "rejeicao" | "retificacao" | "conclusao"

export interface TransicaoAprovacao {
  evento: EventoAprovacao
  de: StatusProcesso
  para: StatusProcesso
  autor: string
  papel: PapelUsuario
  data: string
  comentario: string
}

export interface ItemAprovacao {
  processoId: string
  objeto: string
  tipo: "ETP" | "TR" | "ETP + TR"
  secretaria: string
  responsavel: string
  valorEstimado: number
  modalidade: Modalidade
  enviadoEm: string
  prazo: string
  urgente: boolean
  status: StatusProcesso
  checklist: Array<{ ok: boolean; texto: string }>
  trilha: TransicaoAprovacao[]
}

export type DecisaoAprovacao = "aprovar" | "rejeitar" | "retificar"

/**
 * Documentos geráveis pela plataforma, na ordem canônica do fluxo de contratação.
 * O DFD é insumo (anexo + verificação) e o PCA é contexto do órgão — nenhum dos
 * dois é gerado aqui. Metadados de cada tipo: `lib/documentos/catalogo.ts`.
 */
export type TipoDocumento = "Cotação" | "ETP" | "Mapa" | "TR" | "Edital" | "Contrato"

export interface DocumentoGerado {
  /** Formato DOC-AAAA-NNNN. */
  id: string
  processoId: string
  titulo: string
  tipo: TipoDocumento
  formato: string
  geradoEm: string
  tamanho: string
  status: "final" | "rascunho"
}

export interface Secretaria {
  id: string
  nome: string
  sigla?: string
}

export interface UsuarioTenant {
  nome: string
  cargo: string
  perfil: "Administrador" | "Elaborador" | "Aprovador"
  ultimoAcesso: string
  iniciais: string
}

/** Dados institucionais do órgão (tenant). */
export interface Tenant {
  orgao: string
  unidade: string
  secretarias: Secretaria[]
  /** Nome do arquivo do logotipo/brasão configurado (metadado exibido). */
  logoArquivo: string | null
  /** Imagem do logotipo/brasão em data URL, para exibição (sidebar, timbre). Null = sem logo. */
  logoDataUrl: string | null
  timbrado: boolean
  cabecalho: string
  rodape: string
  pca: {
    ano: string
    arquivo: string | null
    itensIndexados: number
  }
  usuarios: UsuarioTenant[]
}

export interface UsuarioAtual {
  nome: string
  primeiroNome: string
  iniciais: string
  papel: PapelUsuario
  descricao: string
  /** Foto de perfil em data URL; null = usa o avatar padrão (iniciais). */
  avatarDataUrl: string | null
}

export interface EstatisticasDashboard {
  processosAtivos: number
  processosNovosMes: number
  aguardandoAprovacao: number
  aguardandoUrgentes: number
  documentosGerados: number
  documentosSemana: number
  etpsConcluidos: number
  taxaConclusao: number
}

/** Indicadores do topo da tela de Documentos Gerados. */
export interface ResumoDocumentos {
  /** Total de documentos armazenados no órgão. */
  total: number
  /** Documentos gerados no mês vigente. */
  esteMes: number
  /** Armazenamento usado, em megabytes. */
  armazenamentoMB: number
}
