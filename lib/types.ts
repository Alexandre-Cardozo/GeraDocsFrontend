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
  /** Prefeitura dona do processo (escopo multi-tenant). */
  prefeituraId: string
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
  /** Trilha de auditoria das transições de status (fonte única — a fila de aprovações projeta daqui). */
  trilha: TransicaoAprovacao[]
  /** Data de envio para análise (rascunho → em_revisao). Ausente enquanto em rascunho. */
  enviadoEm?: string
  /** Prazo de análise, quando o processo está no pipeline de aprovação. */
  prazo?: string
  /** Parecer jurídico de controle prévio de legalidade (Art. 53). Gate para encaminhar ao gestor. */
  parecerJuridico?: ParecerJuridico
}

/** Parecer jurídico de controle prévio de legalidade — Art. 53, Lei 14.133/21. */
export interface ParecerJuridico {
  favoravel: boolean
  autor: string
  data: string
  comentario: string
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

/** Item de conformidade do checklist de aprovação (derivado do estado do processo). */
export interface ItemChecklist {
  ok: boolean
  texto: string
}

/**
 * Projeção de um processo na fila de aprovação. Montada a partir do `Processo`
 * (não é mais uma fixture própria) — ver `getFilaAprovacoes`.
 */
export interface ItemAprovacao {
  processoId: string
  objeto: string
  /** Documentos do processo, na ordem do fluxo. Substitui a taxonomia antiga "ETP + TR". */
  documentos: TipoDocumento[]
  secretaria: string
  responsavel: string
  valorEstimado: number
  modalidade: Modalidade
  enviadoEm: string
  status: StatusProcesso
  parecerJuridico?: ParecerJuridico
  checklist: ItemChecklist[]
  trilha: TransicaoAprovacao[]
}

export type DecisaoAprovacao = "aprovar" | "rejeitar" | "retificar"

/**
 * Apontamento de retificação — a comissão/gestor marca uma seção específica de
 * um documento como pendente de correção. O elaborador o vê no editor e resolve.
 * Substitui o "parecer em texto livre único" por rastreabilidade por seção (TCU).
 */
export interface ApontamentoRetificacao {
  id: string
  processoId: string
  tipo: TipoDocumento
  /** Seção apontada; ausente = apontamento do documento como um todo. */
  secaoId?: string
  secaoTitulo?: string
  texto: string
  autor: string
  papel: PapelUsuario
  data: string
  resolvido: boolean
}

/**
 * Documentos geráveis pela plataforma, na ordem canônica do fluxo de contratação.
 * O DFD é insumo (anexo + verificação) e o PCA é contexto do órgão — nenhum dos
 * dois é gerado aqui. Metadados de cada tipo: `lib/documentos/catalogo.ts`.
 */
export type TipoDocumento = "Cotação" | "ETP" | "Mapa" | "TR" | "Edital" | "Contrato"

export interface DocumentoGerado {
  /** Formato DOC-AAAA-NNNN. */
  id: string
  prefeituraId: string
  processoId: string
  titulo: string
  tipo: TipoDocumento
  formato: string
  geradoEm: string
  tamanho: string
  status: "final" | "rascunho"
  /** Versão vigente (1 na primeira geração; incrementa a cada regeração/retificação). */
  versao: number
}

/** Entrada do histórico de versões de um documento (rastreabilidade — não sobrescreve). */
export interface VersaoDocumento {
  versao: number
  geradoEm: string
  tamanho: string
  /** Motivo da versão: "Geração inicial", "Regeração", "Retificação: <apontamento>". */
  nota: string
}

export interface Secretaria {
  id: string
  nome: string
  sigla?: string
}

/**
 * Perfil de acesso — controla o que o usuário pode ver e fazer no sistema.
 * Distinto de `PapelUsuario` (papel no fluxo de aprovação): um mesmo usuário
 * tem um perfil de acesso e atua com papéis de workflow conforme a etapa.
 */
export type PerfilAcesso = "admin_geral" | "coordenador" | "servidor"

export const PERFIL_ACESSO_LABEL: Record<PerfilAcesso, string> = {
  admin_geral: "Administrador Geral",
  coordenador: "Coordenador",
  servidor: "Servidor",
}

/** Dados institucionais de uma prefeitura (tenant). Um tenant = uma prefeitura. */
export interface Tenant {
  /** Formato PREF-NNN. */
  id: string
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
}

/** Alias documental — o Tenant é a Prefeitura no domínio multi-tenant. */
export type Prefeitura = Tenant

/**
 * Usuário do sistema. A senha nunca trafega aqui — fica só no mapa de
 * credenciais do mock. `prefeituraId` é null apenas para o admin geral (LAHHM).
 */
export interface Usuario {
  /** Formato USR-NNN. */
  id: string
  nome: string
  primeiroNome: string
  iniciais: string
  /** 11 dígitos, sem máscara. */
  cpf: string
  email: string
  cargo: string
  perfilAcesso: PerfilAcesso
  /** Papel primário no fluxo de aprovação (autoria/exibição). */
  papel: PapelUsuario
  /** Prefeitura a que pertence. null = admin geral (LAHHM, sem prefeitura). */
  prefeituraId: string | null
  /** Secretaria em que atua (nome). */
  secretaria?: string
  /** Foto de perfil em data URL; null = usa o avatar padrão (iniciais). */
  avatarDataUrl: string | null
  /** Último acesso em ISO; atualizado no login. */
  ultimoAcesso: string
  ativo: boolean
}

/** Sessão do usuário logado — o que a interface consome. */
export interface Sessao {
  usuario: Usuario
  /** Config da prefeitura do usuário; null para o admin geral. */
  prefeitura: Tenant | null
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
