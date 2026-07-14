import type {
  DocumentoGerado,
  EstatisticasDashboard,
  ItemAprovacao,
  ParecerDFD,
  Processo,
  ResumoDocumentos,
  SecaoETP,
  Tenant,
  TipoDocumento,
  UsuarioAtual,
} from "@/lib/types";

/**
 * Fixtures do mock — dados idênticos aos do protótipo Vite.
 * Nunca importe este módulo em componentes: consuma via lib/api + hooks.
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

export const processos: Processo[] = [
  {
    id: "PROC-2024-089",
    objeto: "Aquisição de Equipamentos de TI",
    objetoDemanda:
      "Aquisição de 150 microcomputadores tipo desktop e periféricos para modernização dos laboratórios de informática das unidades escolares da rede municipal.",
    documentos: ["ETP", "TR"],
    secretaria: "Secretaria de Educação",
    modalidade: "Pregão Eletrônico",
    status: "em_revisao",
    valorEstimado: 485000,
    etpStatus: "Completo",
    trStatus: "Em andamento",
    responsavel: "Maria Costa",
    criadoEm: "2024-07-05",
    atualizadoEm: "2024-07-05",
    fases: { verificacaoDFD: true, retificacao: false },
    dfdArquivo: "DFD-PROC-2024-089.pdf",
  },
  {
    id: "PROC-2024-088",
    objeto: "Contratação de Serviços de Limpeza",
    documentos: ["ETP", "TR"],
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
  },
  {
    id: "PROC-2024-087",
    objeto: "Fornecimento de Material de Escritório",
    documentos: ["ETP", "TR", "Cotação"],
    secretaria: "Administração Central",
    modalidade: "Dispensa Art. 75",
    status: "aprovado",
    valorEstimado: 38500,
    etpStatus: "Completo",
    trStatus: "Completo",
    responsavel: "Ana Oliveira",
    criadoEm: "2024-07-03",
    atualizadoEm: "2024-07-03",
    fundamentoLegal: "Art. 75, II, Lei 14.133/21",
    fases: { verificacaoDFD: false, retificacao: false },
  },
  {
    id: "PROC-2024-086",
    objeto: "Serviços de Manutenção Predial",
    documentos: ["ETP"],
    secretaria: "Secretaria de Saúde",
    modalidade: "Concorrência",
    status: "rascunho",
    valorEstimado: 210000,
    etpStatus: "Em andamento",
    trStatus: "Não iniciado",
    responsavel: "Carlos Lima",
    criadoEm: "2024-07-02",
    atualizadoEm: "2024-07-02",
    fases: { verificacaoDFD: false, retificacao: false },
  },
  {
    id: "PROC-2024-085",
    objeto: "Aquisição de Veículos Oficiais",
    documentos: ["ETP", "TR"],
    secretaria: "Frota Municipal",
    modalidade: "Pregão Eletrônico",
    status: "concluido",
    valorEstimado: 920000,
    etpStatus: "Completo",
    trStatus: "Completo",
    responsavel: "Maria Costa",
    criadoEm: "2024-07-01",
    atualizadoEm: "2024-07-01",
    fases: { verificacaoDFD: false, retificacao: false },
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
    trStatus: "Em revisão",
    responsavel: "Pedro Ramos",
    criadoEm: "2024-06-29",
    atualizadoEm: "2024-06-29",
    fases: { verificacaoDFD: false, retificacao: true },
    urgente: true,
  },
  {
    id: "PROC-2024-083",
    objeto: "Reforma Escola Municipal Centro",
    documentos: ["ETP"],
    secretaria: "Secretaria de Educação",
    modalidade: "Concorrência",
    status: "aguardando",
    valorEstimado: 1200000,
    etpStatus: "Completo",
    trStatus: "Completo",
    responsavel: "Ana Oliveira",
    criadoEm: "2024-06-28",
    atualizadoEm: "2024-06-28",
    fases: { verificacaoDFD: false, retificacao: false },
  },
  {
    id: "PROC-2024-082",
    objeto: "Aquisição de Uniformes Escolares",
    documentos: ["ETP", "TR"],
    secretaria: "Secretaria de Educação",
    modalidade: "Pregão Eletrônico",
    status: "rejeitado",
    valorEstimado: 95000,
    etpStatus: "Completo",
    trStatus: "Rejeitado",
    responsavel: "João Silva",
    criadoEm: "2024-06-27",
    atualizadoEm: "2024-06-27",
    fases: { verificacaoDFD: false, retificacao: false },
  },
];

/** As 11 seções do ETP na ordem do protótipo, com inciso do Art. 18. */
export const secoesETPBase: SecaoETP[] = [
  {
    id: "1",
    titulo: "Descrição da Necessidade",
    status: "Completo",
    obrigatoria: true,
    incisoArt18: "Art. 18, § 1º, I, Lei 14.133/21",
    hint: "Descreva de forma clara e objetiva a necessidade que justifica a contratação, com base nos planos de trabalho e planejamento da unidade.",
    conteudo:
      "Necessidade de aquisição de equipamentos de tecnologia da informação para modernização do parque tecnológico das unidades escolares da rede municipal de ensino, visando melhorar a qualidade do ensino e a infraestrutura pedagógica.",
  },
  {
    id: "2",
    titulo: "Área Requisitante",
    status: "Completo",
    obrigatoria: true,
    incisoArt18: "Art. 18, § 1º, II, Lei 14.133/21",
    hint: "Identifique a unidade demandante, o responsável pela solicitação e a previsão da contratação no PCA vigente.",
    conteudo:
      "Secretaria Municipal de Educação — Diretoria de Tecnologia Educacional. Demanda prevista no PCA 2025, item 47.",
  },
  {
    id: "3",
    titulo: "Descrição dos Requisitos",
    status: "Completo",
    obrigatoria: true,
    incisoArt18: "Art. 18, § 1º, III, Lei 14.133/21",
    hint: "Especifique os requisitos técnicos e de desempenho indispensáveis ao atendimento da necessidade, sem direcionamento de marca.",
    conteudo:
      "Microcomputadores tipo desktop com processador de no mínimo 6 núcleos, 16 GB de memória RAM, armazenamento SSD de 512 GB e garantia on-site de 36 meses.",
  },
  {
    id: "4",
    titulo: "Estimativa das Quantidades e do Valor",
    status: "Em andamento",
    obrigatoria: true,
    incisoArt18: "Art. 18, § 1º, IV e VI, Lei 14.133/21",
    hint: "Informe as quantidades estimadas e a estimativa de valor, com base em histórico de consumo, demanda projetada e pesquisa de preços.",
    conteudo: "",
  },
  {
    id: "5",
    titulo: "Soluções Disponíveis no Mercado",
    status: "Não iniciado",
    obrigatoria: true,
    incisoArt18: "Art. 18, § 1º, V, Lei 14.133/21",
    hint: "Levante as soluções existentes no mercado, incluindo a possibilidade de Adesão a Ata de Registro de Preços vigente.",
    conteudo: "",
  },
  {
    id: "6",
    titulo: "Justificativa para Contratação",
    status: "Não iniciado",
    obrigatoria: true,
    incisoArt18: "Art. 18, § 1º, IX, Lei 14.133/21",
    hint: "Demonstre os resultados pretendidos e o alinhamento da contratação com o interesse público e o planejamento institucional.",
    conteudo: "",
  },
  {
    id: "7",
    titulo: "Análise da Viabilidade",
    status: "Não iniciado",
    obrigatoria: true,
    incisoArt18: "Art. 18, § 1º, XIII, Lei 14.133/21",
    hint: "Avalie a viabilidade técnica, econômica e operacional da contratação diante das alternativas levantadas.",
    conteudo: "",
  },
  {
    id: "8",
    titulo: "Declaração de Viabilidade",
    status: "Não iniciado",
    obrigatoria: true,
    incisoArt18: "Art. 18, § 1º, XIII, Lei 14.133/21",
    hint: "Declare expressamente se a contratação é viável, com base nos elementos analisados nas seções anteriores.",
    conteudo: "",
  },
  {
    id: "9",
    titulo: "Responsável Técnico",
    status: "Não iniciado",
    obrigatoria: true,
    incisoArt18: "Art. 18, caput, Lei 14.133/21",
    hint: "Identifique o servidor responsável pela elaboração do estudo, com cargo, matrícula e assinatura.",
    conteudo: "",
  },
  {
    id: "10",
    titulo: "Sustentabilidade",
    status: "Não iniciado",
    obrigatoria: false,
    incisoArt18: "Art. 18, § 1º, XII, Lei 14.133/21",
    hint: "Descreva os impactos ambientais da contratação e as medidas de mitigação, conforme critérios de sustentabilidade aplicáveis.",
    conteudo: "",
  },
  {
    id: "11",
    titulo: "Posicionamento Conclusivo",
    status: "Não iniciado",
    obrigatoria: false,
    incisoArt18: "Art. 18, § 1º, XIII, Lei 14.133/21",
    hint: "Registre o posicionamento conclusivo sobre a adequação da contratação para o atendimento da necessidade.",
    conteudo: "",
  },
];

/** Monta seções zeradas a partir de uma lista de (título, referência, hint). */
function secoes(defs: Array<[string, string, string]>, opcionaisAPartirDe = Infinity): SecaoETP[] {
  return defs.map(([titulo, incisoArt18, hint], i) => ({
    id: String(i + 1),
    titulo,
    status: "Não iniciado",
    obrigatoria: i + 1 < opcionaisAPartirDe,
    incisoArt18,
    hint,
    conteudo: "",
  }))
}

/** Seções do Termo de Referência (Art. 6º, XXIII, Lei 14.133/21). */
const secoesTRBase: SecaoETP[] = secoes(
  [
    ["Definição do Objeto", "Art. 6º, XXIII, 'a', Lei 14.133/21", "Defina o objeto de forma precisa, suficiente e clara, com quantitativos e unidades de medida."],
    ["Fundamentação da Contratação", "Art. 6º, XXIII, 'b', Lei 14.133/21", "Referencie o ETP e demonstre a necessidade pública que motiva a contratação."],
    ["Descrição da Solução", "Art. 6º, XXIII, 'c', Lei 14.133/21", "Descreva a solução como um todo, considerando o ciclo de vida do objeto."],
    ["Requisitos da Contratação", "Art. 6º, XXIII, 'd', Lei 14.133/21", "Especifique requisitos de sustentabilidade, garantia, prazos e obrigações das partes."],
    ["Modelo de Execução do Objeto", "Art. 6º, XXIII, 'e', Lei 14.133/21", "Defina como o contrato deverá produzir os resultados pretendidos (rotinas, prazos, locais)."],
    ["Modelo de Gestão do Contrato", "Art. 6º, XXIII, 'f', Lei 14.133/21", "Descreva a fiscalização, o recebimento e a gestão contratual."],
    ["Critérios de Medição e Pagamento", "Art. 6º, XXIII, 'g', Lei 14.133/21", "Estabeleça os critérios de medição, aferição de resultados e condições de pagamento."],
    ["Seleção do Fornecedor", "Art. 6º, XXIII, 'h', Lei 14.133/21", "Indique a forma de seleção, o critério de julgamento e as exigências de habilitação."],
    ["Estimativa do Valor da Contratação", "Art. 23, Lei 14.133/21", "Apresente o valor estimado acompanhado dos preços unitários referenciais."],
    ["Adequação Orçamentária", "Art. 6º, XXIII, 'j', Lei 14.133/21", "Informe a dotação orçamentária e a previsão no PCA vigente."],
  ],
  10, // "Adequação Orçamentária" opcional
);

/** Seções da Cotação de Mercado (pesquisa de preços — Art. 23, Lei 14.133/21). */
const secoesCotacaoBase: SecaoETP[] = secoes(
  [
    ["Objeto da Pesquisa de Preços", "Art. 23, Lei 14.133/21", "Delimite o objeto e as especificações que balizam a coleta de preços."],
    ["Fornecedores e Fontes Consultadas", "Art. 23, § 1º, Lei 14.133/21", "Liste as fontes utilizadas (painel de preços, contratos, fornecedores)."],
    ["Preços Coletados", "Art. 23, § 2º, Lei 14.133/21", "Registre os preços obtidos por fonte, com datas e validade das propostas."],
    ["Metodologia e Preço de Referência", "IN SEGES 65/2021", "Explicite a metodologia (média, mediana, menor preço) e o valor de referência apurado."],
  ],
);

/** Seções do Mapa de Riscos (gestão de riscos — Art. 18, X, Lei 14.133/21). */
const secoesMapaBase: SecaoETP[] = secoes(
  [
    ["Identificação dos Riscos", "Art. 18, X, Lei 14.133/21", "Liste os riscos das fases de planejamento, seleção e execução do contrato."],
    ["Análise de Probabilidade e Impacto", "Art. 18, X, Lei 14.133/21", "Classifique cada risco quanto à probabilidade e ao impacto."],
    ["Ações Preventivas", "Art. 18, X, Lei 14.133/21", "Defina medidas para reduzir a probabilidade de ocorrência dos riscos."],
    ["Ações de Contingência", "Art. 18, X, Lei 14.133/21", "Estabeleça respostas caso o risco se concretize."],
    ["Responsáveis e Monitoramento", "Art. 18, X, Lei 14.133/21", "Aponte os responsáveis pelo monitoramento e a periodicidade de revisão."],
  ],
);

/** Seções por tipo de documento — fonte única do editor de seções. */
export const secoesPorTipoBase: Record<TipoDocumento, SecaoETP[]> = {
  ETP: secoesETPBase,
  TR: secoesTRBase,
  "Cotação": secoesCotacaoBase,
  Mapa: secoesMapaBase,
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

export const aprovacoes: ItemAprovacao[] = [
  {
    processoId: "PROC-2024-088",
    objeto: "Contratação de Serviços de Limpeza",
    tipo: "ETP + TR",
    secretaria: "Secretaria de Obras",
    responsavel: "João Silva",
    valorEstimado: 120000,
    modalidade: "Pregão Eletrônico",
    enviadoEm: "2024-07-04",
    prazo: "2024-07-08",
    urgente: true,
    status: "aguardando",
    checklist: [
      { ok: true, texto: "Descrição da necessidade preenchida e fundamentada" },
      { ok: true, texto: "Estimativa de valor com pesquisa de mercado anexa" },
      { ok: true, texto: "Responsável técnico identificado e assinado" },
      { ok: true, texto: "Modalidade licitatória adequada ao objeto e valor" },
      { ok: false, texto: "Análise de sustentabilidade ambiental pendente" },
      { ok: true, texto: "Declaração de viabilidade preenchida" },
    ],
    trilha: [
      {
        evento: "envio",
        de: "rascunho",
        para: "em_revisao",
        autor: "João Silva",
        papel: "servidor_compras",
        data: "2024-07-03",
        comentario: "ETP e TR concluídos; encaminho para análise da comissão.",
      },
      {
        evento: "envio",
        de: "em_revisao",
        para: "aguardando",
        autor: "Comissão de Contratação",
        papel: "comissao",
        data: "2024-07-04",
        comentario:
          "Documentação conferida. Segue para decisão do gestor aprovador.",
      },
    ],
  },
  {
    processoId: "PROC-2024-084",
    objeto: "Sistema de Gestão de RH",
    tipo: "ETP + TR",
    secretaria: "Secretaria de Adm.",
    responsavel: "Pedro Ramos",
    valorEstimado: 750000,
    modalidade: "Inexigibilidade",
    enviadoEm: "2024-07-03",
    prazo: "2024-07-07",
    urgente: true,
    status: "aguardando",
    checklist: [
      { ok: true, texto: "Descrição da necessidade preenchida e fundamentada" },
      {
        ok: true,
        texto:
          "Inviabilidade de competição demonstrada (Art. 74, Lei 14.133/21)",
      },
      { ok: true, texto: "Responsável técnico identificado e assinado" },
      { ok: true, texto: "Justificativa de preço com comparativos de mercado" },
      { ok: true, texto: "Declaração de viabilidade preenchida" },
    ],
    trilha: [
      {
        evento: "envio",
        de: "rascunho",
        para: "em_revisao",
        autor: "Pedro Ramos",
        papel: "servidor_compras",
        data: "2024-07-01",
        comentario: "Processo instruído para análise jurídica.",
      },
      {
        evento: "retificacao",
        de: "em_revisao",
        para: "em_revisao",
        autor: "Departamento Jurídico",
        papel: "juridico",
        data: "2024-07-02",
        comentario:
          "Solicito retificação: incluir comparativo de preços exigido pelo Art. 23, Lei 14.133/21.",
      },
      {
        evento: "envio",
        de: "em_revisao",
        para: "aguardando",
        autor: "Pedro Ramos",
        papel: "servidor_compras",
        data: "2024-07-03",
        comentario:
          "Retificação atendida; comparativo de preços anexado à seção 5 do ETP.",
      },
    ],
  },
  {
    processoId: "PROC-2024-083",
    objeto: "Reforma Escola Municipal Centro",
    tipo: "ETP",
    secretaria: "Secretaria de Educação",
    responsavel: "Ana Oliveira",
    valorEstimado: 1200000,
    modalidade: "Concorrência",
    enviadoEm: "2024-07-01",
    prazo: "2024-07-10",
    urgente: false,
    status: "aguardando",
    checklist: [
      { ok: true, texto: "Descrição da necessidade preenchida e fundamentada" },
      { ok: true, texto: "Estimativa de valor com pesquisa de mercado anexa" },
      { ok: true, texto: "Responsável técnico identificado e assinado" },
      { ok: true, texto: "Modalidade licitatória adequada ao objeto e valor" },
      { ok: true, texto: "Análise de sustentabilidade ambiental incluída" },
      { ok: true, texto: "Declaração de viabilidade preenchida" },
    ],
    trilha: [
      {
        evento: "envio",
        de: "rascunho",
        para: "em_revisao",
        autor: "Ana Oliveira",
        papel: "secretaria_demandante",
        data: "2024-06-30",
        comentario:
          "ETP da reforma concluído conforme levantamento da engenharia.",
      },
      {
        evento: "envio",
        de: "em_revisao",
        para: "aguardando",
        autor: "Comissão de Contratação",
        papel: "comissao",
        data: "2024-07-01",
        comentario: "Checklist integral. Encaminhado para aprovação.",
      },
    ],
  },
];

export const documentos: DocumentoGerado[] = [
  {
    id: "DOC-2024-0189",
    processoId: "PROC-2024-087",
    titulo: "ETP — Fornecimento de Material de Escritório",
    tipo: "ETP",
    formato: "DOCX + PDF",
    geradoEm: "2024-07-03T16:42:00",
    tamanho: "284 KB",
    status: "final",
  },
  {
    id: "DOC-2024-0188",
    processoId: "PROC-2024-087",
    titulo: "TR — Fornecimento de Material de Escritório",
    tipo: "TR",
    formato: "DOCX + PDF",
    geradoEm: "2024-07-03T16:40:00",
    tamanho: "310 KB",
    status: "final",
  },
  {
    id: "DOC-2024-0187",
    processoId: "PROC-2024-087",
    titulo: "Cotação de Mercado — Material de Escritório",
    tipo: "Cotação",
    formato: "DOCX + PDF",
    geradoEm: "2024-07-03T16:35:00",
    tamanho: "196 KB",
    status: "final",
  },
  {
    id: "DOC-2024-0185",
    processoId: "PROC-2024-085",
    titulo: "ETP — Aquisição de Veículos Oficiais",
    tipo: "ETP",
    formato: "DOCX + PDF",
    geradoEm: "2024-07-01T11:20:00",
    tamanho: "398 KB",
    status: "final",
  },
  {
    id: "DOC-2024-0184",
    processoId: "PROC-2024-085",
    titulo: "TR — Aquisição de Veículos Oficiais",
    tipo: "TR",
    formato: "DOCX + PDF",
    geradoEm: "2024-07-01T11:18:00",
    tamanho: "425 KB",
    status: "final",
  },
  {
    id: "DOC-2024-0171",
    processoId: "PROC-2024-079",
    titulo: "ETP — Serviços de Vigilância Armada",
    tipo: "ETP",
    formato: "DOCX + PDF",
    geradoEm: "2024-06-25T09:55:00",
    tamanho: "266 KB",
    status: "rascunho",
  },
  {
    id: "DOC-2024-0168",
    processoId: "PROC-2024-078",
    titulo: "Mapa de Riscos — TI 2024",
    tipo: "Mapa",
    formato: "PDF",
    geradoEm: "2024-06-24T14:30:00",
    tamanho: "128 KB",
    status: "final",
  },
];

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
