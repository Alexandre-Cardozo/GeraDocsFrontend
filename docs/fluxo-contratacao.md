# Fluxo de contratação — como o produto espelha a Lei 14.133/21

Este documento é a referência de domínio do GeraDocs: que documentos existem, em que ordem, com que fundamento e o que ainda falta. Quem for mexer no catálogo de documentos, no wizard ou no hub do processo lê isto antes.

A fonte de verdade em código é `lib/documentos/` — `catalogo.ts` (ordem, dependências, regras por modalidade) e `secoes.ts` (a estrutura seccional de cada documento, com o fundamento legal citado literalmente).

## Fases da contratação

A Lei 14.133/21 organiza a contratação em três fases. O GeraDocs atua na **primeira**.

| Fase | O que acontece | No produto |
|---|---|---|
| **Planejamento** (fase preparatória, Art. 18) | Formalização da demanda, estudos, pesquisa de preços, riscos, TR, edital e minuta contratual | **É o escopo do GeraDocs** |
| **Seleção do fornecedor** (Art. 17, II) | Publicação, propostas, julgamento, habilitação, adjudicação, homologação | Fora do escopo |
| **Execução contratual** | Assinatura, gestão, fiscalização, aditivos | Fora do escopo |

## Insumos que não são documentos gerados

- **PCA — Plano de Contratações Anual** (Art. 12, VII): toda contratação deve estar nele previstas. No produto é **configuração do órgão** (`Tenant.pca`), usada como contexto de conformidade — o ETP demonstra a previsão (inciso II) e a verificação do DFD cruza com ele.
- **DFD — Documento de Formalização da Demanda** (Art. 6º): é o artefato que **instaura** o processo, elaborado pelo setor requisitante. No produto é **anexo** + uma fase opcional de verificação por IA. Não é gerado pela plataforma.

## Ordem canônica dos documentos

Ordem declarada em `CATALOGO[tipo].ordem`. O hub do processo numera e ordena os cards por ela, e o wizard lista os documentos na mesma sequência.

| # | Documento | Fundamento | Por que nesta posição |
|---|---|---|---|
| 1 | **Cotação de Mercado** | Art. 23 + IN SEGES 65/2021 | É **insumo** da estimativa de valor do ETP: o Art. 18, § 1º, VI exige o valor "acompanhado dos preços unitários referenciais, das memórias de cálculo e dos documentos que lhe dão suporte" |
| 2 | **ETP** | Art. 18, § 1º | Consome a pesquisa de preços e fundamenta a contratação |
| 3 | **Mapa de Riscos** | Art. 18, X | Concomitante ao ETP; sua matriz de alocação (Art. 22) alimenta a cláusula correspondente do contrato |
| 4 | **TR** | Art. 6º, XXIII | Fundamenta-se no ETP (alínea "b") |
| 5 | **Edital** | Art. 25 | Tem o TR como anexo (Art. 25, § 1º) |
| 6 | **Contrato** (minuta) | Art. 89 a 95; cláusulas do Art. 92 | Anexo do edital, vinculado a ele e à proposta (Art. 92, II) |

### Dependências

Declaradas em `CATALOGO[tipo].requer` e aplicadas por `pendencias()`:

- **TR requer ETP** · **Edital requer TR** · **Contrato requer TR**
- Cotação e Mapa não travam nada — são concomitantes ao planejamento.

Uma dependência **só bloqueia se o processo de fato contiver aquele documento**. No Leilão, por exemplo, o Edital é obrigatório e não há TR (a avaliação do bem faz esse papel); o Edital não pode ficar esperando um documento que o processo nunca terá.

No hub, um documento com dependência pendente tem o botão de ação substituído por uma tag "Requer …" até que a dependência seja gerada.

## Matriz modalidade × documentos

Declarada em `REGRA_MODALIDADE`. O wizard só oferece os tipos cabíveis à modalidade escolhida — os obrigatórios já vêm marcados e travados.

| Modalidade | Obrigatórios | Opcionais |
|---|---|---|
| Pregão Eletrônico · Concorrência · Diálogo Competitivo · Credenciamento | ETP, TR, Edital | Cotação, Mapa, Contrato |
| Concurso | ETP, Edital | Cotação, Mapa, TR, Contrato |
| Leilão | Edital | Cotação, Mapa, ETP, TR, Contrato |
| **Dispensa Art. 75 · Inexigibilidade** | TR | ETP, Cotação, Mapa, Contrato — **sem Edital** |

**Contratação direta não gera edital de licitação.** O Art. 72 instrui o processo com DFD, ETP *quando for o caso*, TR, estimativa de despesa, parecer jurídico e autorização — por isso, nessas modalidades, o ETP é opcional (Art. 18, § 2º c/c Art. 72, I) e o Edital não é oferecido. No Credenciamento (Art. 79), o "Edital" é o de chamamento público.

## Seções obrigatórias e dispensáveis

Cada seção declara `obrigatoria`. **Só as obrigatórias travam a geração do documento** — as demais podem ficar em branco e são omitidas.

Isso reflete o **Art. 18, § 2º**: no ETP, apenas os incisos **I, IV, VI, VIII e XIII** são indispensáveis; os outros podem ser dispensados mediante justificativa. Daí o ETP ter 13 seções mas só 5 obrigatórias.

| Documento | Seções | Obrigatórias |
|---|---|---|
| Cotação de Mercado | 5 | 5 |
| ETP | 13 (uma por inciso do Art. 18, § 1º) | 5 (Art. 18, § 2º) |
| Mapa de Riscos | 6 | 5 |
| TR | 10 (alíneas "a" a "j" do Art. 6º, XXIII) | 10 |
| Edital | 14 | 13 |
| Contrato | 19 (cláusulas do Art. 92) | 16 |

O par `fundamentoLegal` + `hint` de cada seção é o que orienta o servidor na tela e, no backend, o que instruirá o modelo de IA a redigir a seção.

## Painéis especiais

Uma seção pode declarar `painel` e o editor genérico renderiza um formulário no lugar do textarea simples. Hoje: `quantidades` (ETP, inciso IV), `valor` (ETP, inciso VI — com as fontes de pesquisa na ordem de preferência da IN SEGES 65/2021, Art. 5º) e `ata` (ETP, inciso V — adesão a Ata de Registro de Preços, Art. 86). Ver `components/documentos/paineis.tsx`.

---

## Lacunas conhecidas — Fase 2

Levantadas na análise que originou esta fase e **deliberadamente não implementadas** aqui. São reais e comprometem a fidelidade do fluxo:

### Retificação não existe de fato
`Processo.fases.retificacao` é ligada no wizard e **nunca lida em lugar nenhum** — não há rota, card nem ramo de código. A fase que o wizard anuncia é um flag morto.

Como funciona na realidade, e o que o produto precisaria:

- **Na fase preparatória (interna):** o documento volta ao elaborador com apontamentos (do jurídico, da comissão, do controle interno), é corrigido e reenviado. Cada ciclo deveria gerar **nova versão** do documento e registrar os apontamentos **por seção** — hoje o parecer é um texto livre único.
- **Depois de publicado o edital:** vira republicação/errata. O Art. 55, § 1º exige nova divulgação e reabertura dos prazos, salvo se a alteração não afetar a formulação das propostas.
- **Durante a execução:** vira termo aditivo (Art. 124) ou apostilamento (Art. 136).

### Não há versionamento — e isso quebra a trilha
`gerarDocumento` (`lib/api/client.ts`) **substitui o documento no lugar** quando ele já existe. A retificação existe justamente para produzir rastreabilidade; sobrescrever destrói a trilha de auditoria que os órgãos de controle esperam. Fase 2: `DocumentoGerado.versao` + histórico de versões.

### O processo nunca é enviado para aprovação
Não existe a transição `envio` (`rascunho → em_revisao`) em lugar nenhum do código: processos criados ficam presos em `rascunho`, sem botão de submeter. E **nada produz `concluido`**. A máquina de estados está declarada só como comentário em `lib/types.ts`, sem tabela de transições nem guarda.

### A fila de aprovações é desacoplada
`db.aprovacoes` é uma fixture própria, não derivada de `db.processos` — aprovar um item não se reflete na lista de processos do usuário. E `ItemAprovacao.tipo` é uma **terceira taxonomia** (`"ETP" | "TR" | "ETP + TR"`), incompatível com `TipoDocumento` e que não escala para seis tipos.

### Falta o parecer jurídico (Art. 53)
O controle prévio de legalidade pela assessoria jurídica é **etapa obrigatória** antes da publicação do edital. O papel `juridico` está tipado em `PapelUsuario` e nunca é usado.

### Regime da Lei 13.303/16
Empresas estatais seguem regime próprio (RILC), não a 14.133/21. Hoje o produto assume 14.133 em todas as referências legais. Suportar estatais exigiria um campo de regime no `Tenant` e um mapa de fundamentos por regime.
