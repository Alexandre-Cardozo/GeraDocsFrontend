import { CATALOGO } from "@/lib/documentos";
import type {
  DocumentoGerado,
  EstatisticasDashboard,
  ParecerDFD,
  Processo,
  ResumoDocumentos,
  Tenant,
  TipoDocumento,
  TransicaoAprovacao,
  UsuarioAtual,
} from "@/lib/types";

/**
 * Fixtures do mock — dados de demonstração.
 * Nunca importe este módulo em componentes: consuma via lib/api + hooks.
 *
 * A estrutura seccional dos documentos não vive aqui: é domínio, e está em
 * `lib/documentos/secoes.ts`. Este módulo guarda apenas o conteúdo já redigido
 * do processo de referência.
 */

export const usuarioAtual: UsuarioAtual = {
  nome: "Maria Costa",
  primeiroNome: "Maria",
  iniciais: "MC",
  papel: "servidor_compras",
  descricao: "Servidor · Compras",
  avatarDataUrl: null,
};

export const estatisticas: EstatisticasDashboard = {
  processosAtivos: 24,
  processosNovosMes: 3,
  aguardandoAprovacao: 7,
  aguardandoUrgentes: 3,
  documentosGerados: 138,
  documentosSemana: 12,
  etpsConcluidos: 61,
  taxaConclusao: 89,
};

/** Indicadores da tela de Documentos — base do órgão; crescem a cada geração. */
export const resumoDocumentos: ResumoDocumentos = {
  total: 141,
  esteMes: 14,
  armazenamentoMB: 51,
};

/** Parecer jurídico favorável padrão (Art. 53) — usado nos processos já encaminhados. */
function parecerFavoravel(data: string): Processo["parecerJuridico"] {
  return {
    favoravel: true,
    autor: "Departamento Jurídico",
    data,
    comentario: "Minuta em conformidade com a Lei 14.133/21. Sem óbices ao prosseguimento.",
  };
}

/** Atalho para uma transição da trilha de auditoria. */
function t(
  evento: TransicaoAprovacao["evento"],
  de: TransicaoAprovacao["de"],
  para: TransicaoAprovacao["para"],
  autor: string,
  papel: TransicaoAprovacao["papel"],
  data: string,
  comentario: string,
): TransicaoAprovacao {
  return { evento, de, para, autor, papel, data, comentario };
}

export const processos: Processo[] = [
  {
    id: "PROC-2024-089",
    objeto: "Aquisição de Equipamentos de TI",
    objetoDemanda:
      "Aquisição de 150 microcomputadores tipo desktop e periféricos para modernização dos laboratórios de informática das unidades escolares da rede municipal.",
    documentos: ["Cotação", "ETP", "TR", "Edital"],
    secretaria: "Secretaria de Educação",
    modalidade: "Pregão Eletrônico",
    status: "em_revisao",
    valorEstimado: 485000,
    etpStatus: "Completo",
    trStatus: "Completo",
    responsavel: "Maria Costa",
    criadoEm: "2024-07-05",
    atualizadoEm: "2024-07-05",
    fases: { verificacaoDFD: true, retificacao: false },
    dfdArquivo: "DFD-PROC-2024-089.pdf",
    enviadoEm: "2024-07-05",
    prazo: "2024-07-12",
    trilha: [
      t("envio", "rascunho", "em_revisao", "Maria Costa", "servidor_compras", "2024-07-05",
        "Documentos concluídos; enviado para análise jurídica e da comissão."),
    ],
  },
  {
    id: "PROC-2024-088",
    objeto: "Contratação de Serviços de Limpeza",
    documentos: ["ETP", "TR", "Edital"],
    secretaria: "Secretaria de Obras",
    modalidade: "Pregão Eletrônico",
    status: "aguardando",
    valorEstimado: 120000,
    etpStatus: "Completo",
    trStatus: "Completo",
    responsavel: "João Silva",
    criadoEm: "2024-07-04",
    atualizadoEm: "2024-07-04",
    fases: { verificacaoDFD: false, retificacao: false },
    urgente: true,
    enviadoEm: "2024-07-04",
    prazo: "2024-07-08",
    parecerJuridico: parecerFavoravel("2024-07-04"),
    trilha: [
      t("envio", "rascunho", "em_revisao", "João Silva", "servidor_compras", "2024-07-03",
        "ETP, TR e Edital concluídos; encaminho para análise da comissão."),
      t("envio", "em_revisao", "aguardando", "Comissão de Contratação", "comissao", "2024-07-04",
        "Documentação conferida e parecer jurídico favorável. Segue para decisão do gestor."),
    ],
  },
  {
    id: "PROC-2024-087",
    objeto: "Fornecimento de Material de Escritório",
    documentos: ["Cotação", "ETP", "TR", "Edital", "Contrato"],
    secretaria: "Administração Central",
    modalidade: "Pregão Eletrônico",
    status: "aprovado",
    valorEstimado: 38500,
    etpStatus: "Completo",
    trStatus: "Completo",
    responsavel: "Ana Oliveira",
    criadoEm: "2024-07-03",
    atualizadoEm: "2024-07-04",
    fases: { verificacaoDFD: false, retificacao: false },
    enviadoEm: "2024-07-03",
    prazo: "2024-07-09",
    parecerJuridico: parecerFavoravel("2024-07-03"),
    trilha: [
      t("envio", "rascunho", "em_revisao", "Ana Oliveira", "servidor_compras", "2024-07-03",
        "Instrução completa com Cotação, ETP, TR, Edital e minuta de Contrato."),
      t("envio", "em_revisao", "aguardando", "Comissão de Contratação", "comissao", "2024-07-04",
        "Conformidade verificada. Encaminhado para aprovação."),
      t("aprovacao", "aguardando", "aprovado", "Carlos Lima", "gestor_aprovador", "2024-07-04",
        "Processo aprovado. Autorizada a abertura da fase externa."),
    ],
  },
  {
    id: "PROC-2024-086",
    objeto: "Serviços de Manutenção Predial",
    documentos: ["ETP", "TR", "Edital"],
    secretaria: "Secretaria de Saúde",
    modalidade: "Concorrência",
    status: "rascunho",
    valorEstimado: 210000,
    etpStatus: "Completo",
    trStatus: "Completo",
    responsavel: "Carlos Lima",
    criadoEm: "2024-07-02",
    atualizadoEm: "2024-07-02",
    fases: { verificacaoDFD: false, retificacao: false },
    trilha: [],
  },
  {
    id: "PROC-2024-085",
    objeto: "Aquisição de Veículos Oficiais",
    documentos: ["ETP", "TR", "Edital"],
    secretaria: "Frota Municipal",
    modalidade: "Pregão Eletrônico",
    status: "concluido",
    valorEstimado: 920000,
    etpStatus: "Completo",
    trStatus: "Completo",
    responsavel: "Maria Costa",
    criadoEm: "2024-07-01",
    atualizadoEm: "2024-07-02",
    fases: { verificacaoDFD: false, retificacao: false },
    enviadoEm: "2024-07-01",
    prazo: "2024-07-08",
    parecerJuridico: parecerFavoravel("2024-07-01"),
    trilha: [
      t("envio", "rascunho", "em_revisao", "Maria Costa", "servidor_compras", "2024-07-01",
        "Documentos concluídos; enviado para análise."),
      t("envio", "em_revisao", "aguardando", "Comissão de Contratação", "comissao", "2024-07-01",
        "Documentação conferida. Segue para decisão do gestor."),
      t("aprovacao", "aguardando", "aprovado", "Carlos Lima", "gestor_aprovador", "2024-07-02",
        "Processo aprovado."),
      t("conclusao", "aprovado", "concluido", "Carlos Lima", "gestor_aprovador", "2024-07-02",
        "Contratação homologada e concluída."),
    ],
  },
  {
    id: "PROC-2024-084",
    objeto: "Sistema de Gestão de RH",
    documentos: ["ETP", "TR"],
    secretaria: "Secretaria de Adm.",
    modalidade: "Inexigibilidade",
    status: "aguardando",
    valorEstimado: 750000,
    etpStatus: "Completo",
    trStatus: "Completo",
    responsavel: "Pedro Ramos",
    criadoEm: "2024-06-29",
    atualizadoEm: "2024-07-03",
    fundamentoLegal: "Art. 74, III, 'a', Lei 14.133/21",
    fases: { verificacaoDFD: false, retificacao: false },
    urgente: true,
    enviadoEm: "2024-07-03",
    prazo: "2024-07-07",
    parecerJuridico: parecerFavoravel("2024-07-03"),
    trilha: [
      t("envio", "rascunho", "em_revisao", "Pedro Ramos", "servidor_compras", "2024-07-01",
        "Processo instruído para análise jurídica."),
      t("retificacao", "aguardando", "em_revisao", "Carlos Lima", "gestor_aprovador", "2024-07-02",
        "Solicito retificação: incluir comparativo de preços exigido pelo Art. 23, Lei 14.133/21."),
      t("envio", "em_revisao", "aguardando", "Pedro Ramos", "servidor_compras", "2024-07-03",
        "Retificação atendida; comparativo de preços anexado ao TR."),
    ],
  },
  {
    id: "PROC-2024-083",
    objeto: "Reforma Escola Municipal Centro",
    documentos: ["ETP", "TR", "Edital"],
    secretaria: "Secretaria de Educação",
    modalidade: "Concorrência",
    status: "aguardando",
    valorEstimado: 1200000,
    etpStatus: "Completo",
    trStatus: "Completo",
    responsavel: "Ana Oliveira",
    criadoEm: "2024-06-28",
    atualizadoEm: "2024-07-01",
    fases: { verificacaoDFD: false, retificacao: false },
    enviadoEm: "2024-07-01",
    prazo: "2024-07-10",
    parecerJuridico: parecerFavoravel("2024-07-01"),
    trilha: [
      t("envio", "rascunho", "em_revisao", "Ana Oliveira", "secretaria_demandante", "2024-06-30",
        "ETP, TR e Edital da reforma concluídos conforme levantamento da engenharia."),
      t("envio", "em_revisao", "aguardando", "Comissão de Contratação", "comissao", "2024-07-01",
        "Checklist integral e parecer jurídico favorável. Encaminhado para aprovação."),
    ],
  },
  {
    id: "PROC-2024-082",
    objeto: "Aquisição de Uniformes Escolares",
    documentos: ["ETP", "TR", "Edital"],
    secretaria: "Secretaria de Educação",
    modalidade: "Pregão Eletrônico",
    status: "rejeitado",
    valorEstimado: 95000,
    etpStatus: "Completo",
    trStatus: "Rejeitado",
    responsavel: "João Silva",
    criadoEm: "2024-06-27",
    atualizadoEm: "2024-06-28",
    fases: { verificacaoDFD: false, retificacao: false },
    enviadoEm: "2024-06-27",
    prazo: "2024-07-02",
    trilha: [
      t("envio", "rascunho", "em_revisao", "João Silva", "servidor_compras", "2024-06-27",
        "Documentos concluídos; enviado para análise."),
      t("envio", "em_revisao", "aguardando", "Comissão de Contratação", "comissao", "2024-06-27",
        "Encaminhado para decisão do gestor."),
      t("rejeicao", "aguardando", "rejeitado", "Carlos Lima", "gestor_aprovador", "2024-06-28",
        "Rejeitado: estimativa de valor sem pesquisa de preços que a fundamente (Art. 23)."),
    ],
  },
];

/**
 * Conteúdo já redigido do ETP do processo de referência (PROC-2024-089),
 * por id de seção. As demais seções e documentos nascem em branco.
 */
export const conteudoDemoETP: Record<string, string> = {
  "1": "Necessidade de aquisição de equipamentos de tecnologia da informação para modernização do parque tecnológico das unidades escolares da rede municipal de ensino, visando melhorar a qualidade do ensino e a infraestrutura pedagógica.",
  "2": "Contratação prevista no Plano de Contratações Anual de 2025, item 47, sob responsabilidade da Secretaria Municipal de Educação — Diretoria de Tecnologia Educacional.",
  "3": "Microcomputadores tipo desktop com processador de no mínimo 6 núcleos, 16 GB de memória RAM, armazenamento SSD de 512 GB e garantia on-site de 36 meses.",
};

/** Achados do parecer da IA sobre o DFD (protótipo DFDReview). */
export const parecerDFDBase: Omit<ParecerDFD, "processoId" | "arquivo"> = {
  analisadoEm: "2025-07-09T14:38:00",
  nota: 74,
  classificacao: "Adequado com ressalvas",
  achados: [
    {
      tipo: "conformidade",
      severidade: "info",
      descricao:
        "Identificação do demandante completa e assinada pela autoridade competente.",
    },
    {
      tipo: "conformidade",
      severidade: "info",
      descricao:
        "Objeto descrito com clareza e especificidade suficiente para embasamento do ETP.",
    },
    {
      tipo: "conformidade",
      severidade: "info",
      descricao:
        "Justificativa da necessidade alinhada com o planejamento institucional.",
      fundamentacao: "PCA 2025 — item 47",
    },
    {
      tipo: "alerta",
      severidade: "recomendacao",
      descricao:
        "Estimativa de valor ausente. Recomenda-se incluir pesquisa prévia de preços para fortalecer a justificativa.",
    },
    {
      tipo: "alerta",
      severidade: "recomendacao",
      descricao:
        "Prazo de entrega não especificado. Adicionar cronograma ou prazo estimado facilita o preenchimento do TR.",
    },
    {
      tipo: "conformidade",
      severidade: "info",
      descricao: "Critérios de sustentabilidade mencionados.",
      fundamentacao: "Art. 11 do Decreto 7.746/2012",
    },
    {
      tipo: "alerta",
      severidade: "atencao",
      descricao:
        "Ausência de referência ao item do PCA vigente. O ETP pode ser questionado na fase de aprovação.",
    },
  ],
};

export const documentos: DocumentoGerado[] = construirDocumentos();

/**
 * Documentos já gerados por processo — montados a partir do catálogo (título,
 * formato e tamanho por tipo). Cada um nasce na versão 1; o histórico de versões
 * cresce quando o documento é regerado/retificado durante a sessão.
 */
function construirDocumentos(): DocumentoGerado[] {
  const objetoDe = (pid: string): string =>
    processos.find((p) => p.id === pid)?.objeto ?? "Processo de Contratação";
  let seq = 162;
  const docs = (
    pid: string,
    tipos: TipoDocumento[],
    geradoEm: string,
    status: DocumentoGerado["status"] = "final",
  ): DocumentoGerado[] =>
    tipos.map((tipo) => ({
      id: `DOC-2024-${String(seq++).padStart(4, "0")}`,
      processoId: pid,
      titulo: `${CATALOGO[tipo].titulo} — ${objetoDe(pid)}`,
      tipo,
      formato: CATALOGO[tipo].formato,
      geradoEm,
      tamanho: `${CATALOGO[tipo].tamanhoKB} KB`,
      status,
      versao: 1,
    }));

  return [
    ...docs("PROC-2024-089", ["Cotação", "ETP", "TR", "Edital"], "2024-07-05T15:20:00"),
    ...docs("PROC-2024-088", ["ETP", "TR", "Edital"], "2024-07-04T10:10:00"),
    ...docs("PROC-2024-087", ["Cotação", "ETP", "TR", "Edital", "Contrato"], "2024-07-04T09:15:00"),
    ...docs("PROC-2024-086", ["ETP", "TR", "Edital"], "2024-07-02T14:00:00"),
    ...docs("PROC-2024-085", ["ETP", "TR", "Edital"], "2024-07-01T11:20:00"),
    ...docs("PROC-2024-084", ["ETP", "TR"], "2024-07-03T16:00:00"),
    ...docs("PROC-2024-083", ["ETP", "TR", "Edital"], "2024-07-01T09:30:00"),
    ...docs("PROC-2024-082", ["ETP", "TR"], "2024-06-27T13:00:00"),
    // Acervo histórico — processos fora do painel ativo, para a tela de Documentos.
    {
      id: "DOC-2024-0159",
      processoId: "PROC-2024-079",
      titulo: "ETP — Serviços de Vigilância Armada",
      tipo: "ETP",
      formato: "DOCX + PDF",
      geradoEm: "2024-06-25T09:55:00",
      tamanho: "266 KB",
      status: "rascunho",
      versao: 1,
    },
    {
      id: "DOC-2024-0158",
      processoId: "PROC-2024-078",
      titulo: "Mapa de Riscos — TI 2024",
      tipo: "Mapa",
      formato: "PDF",
      geradoEm: "2024-06-24T14:30:00",
      tamanho: "128 KB",
      status: "final",
      versao: 1,
    },
  ];
}


export const tenant: Tenant = {
  orgao: "Prefeitura de São Paulo",
  unidade: "Secretaria de Compras",
  secretarias: [
    { id: "sec-1", nome: "Secretaria de Educação" },
    { id: "sec-2", nome: "Secretaria de Saúde" },
    { id: "sec-3", nome: "Secretaria de Obras e Infraestrutura" },
    { id: "sec-4", nome: "Secretaria de Administração" },
    { id: "sec-5", nome: "Secretaria de Finanças" },
    { id: "sec-6", nome: "Secretaria de Meio Ambiente" },
    { id: "sec-7", nome: "Secretaria de Assistência Social" },
    { id: "sec-8", nome: "Frota Municipal" },
    { id: "sec-9", nome: "Administração Central" },
  ],
  logoArquivo: "brasao-sao-paulo.png",
  // Sem imagem exibível por padrão → a sidebar mostra o ícone padrão do órgão até
  // que o servidor importe um brasão em Configurações → Identidade Visual.
  logoDataUrl: null,
  timbrado: true,
  cabecalho:
    "PREFEITURA MUNICIPAL DE SÃO PAULO\nSecretaria Municipal de Compras e Contratações",
  rodape:
    "Documento gerado eletronicamente pela plataforma GeraDocs · São Paulo, {data} · Processo nº {numero}",
  pca: { ano: "2025", arquivo: null, itensIndexados: 247 },
  usuarios: [
    {
      nome: "Maria Costa",
      cargo: "Chefe de Compras",
      perfil: "Administrador",
      ultimoAcesso: "Hoje, 14:22",
      iniciais: "MC",
    },
    {
      nome: "José Alves",
      cargo: "Analista de Compras",
      perfil: "Elaborador",
      ultimoAcesso: "Hoje, 11:05",
      iniciais: "JA",
    },
    {
      nome: "Ana Ribeiro",
      cargo: "Técnica de Licitações",
      perfil: "Elaborador",
      ultimoAcesso: "08/07/2025",
      iniciais: "AR",
    },
    {
      nome: "Carlos Lima",
      cargo: "Gestor de Contratos",
      perfil: "Aprovador",
      ultimoAcesso: "07/07/2025",
      iniciais: "CL",
    },
  ],
};
