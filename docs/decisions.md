# Decisões de Arquitetura — Frontend GeraDocs (Fase 1)

Registro curto das decisões relevantes da industrialização do protótipo (Vite → Next.js), conforme seção 9 do prompt da fase.

## 1. Estrutura de rotas (App Router)

Route group `(app)` para o shell autenticado (Sidebar + Header); `app/layout.tsx` só carrega fonts, providers e `globals.css`.

| Rota | View |
|---|---|
| `/` | Dashboard |
| `/processos` | Lista de processos |
| `/processos/novo` | Wizard de novo processo |
| `/processos/[id]` | Hub do processo (dados + pipeline de documentos) |
| `/processos/[id]/dfd` | Verificação do DFD pela IA |
| `/processos/[id]/documento/[tipo]` | Editor de seções — atende os seis tipos de documento (ver §13) |
| `/processos/[id]/etp` | Redirect para `/processos/[id]/documento/etp` (compatibilidade — ver §14) |
| `/aprovacoes` · `/documentos` · `/configuracoes` | Aprovações · Documentos · Configurações |

A sub-rota opcional `/[tipo]/[secao]` foi dispensada nesta fase: a troca de seção é instantânea (estado local) e o deep-link relevante é para o processo, não para a seção.

## 2. Estilização: Tailwind CSS v4 utility-first sobre os tokens do DS

> **Atualizado (jul/2026):** a estilização migrou para **Tailwind CSS v4 utility-first**. A decisão detalhada e a garantia de fonte única de verdade estão no **item 10**; o guia prático em `docs/estilizacao.md`. O texto abaixo descreve a abordagem original (inline styles), preservado como histórico.

~~O DS LAHHM/GeraDocs é distribuído como componentes com estilos inline referenciando tokens (`var(--...)`). Mantivemos esse padrão nos ports TSX e nas views~~ — substituído por classes utilitárias do Tailwind, cujos valores vêm do `@theme` (mesmos tokens). Os tints/gradientes que eram "Extensões do app" em `globals.css` viraram tokens do `@theme`; os pseudo-estados que eram classes `gd-*` viraram utilities `hover:*`.

## 3. Enforcement de aderência

- `eslint.config.mjs`: `eslint-config-next` (flat, nativo no Next 16) + `no-restricted-syntax` com severidade **error** proibindo hex cru, px cru em strings e `fontFamily` fora dos três tokens de fonte. Escopo: `app/`, `components/`, `lib/`.
- `.oxlintrc.json`: derivado do `_adherence.oxlintrc.json` do DS. O oxlint atual não suporta `no-restricted-syntax`; essas regras rodam no ESLint, e a validação de props dos componentes do DS é garantida pelo TypeScript strict (os ports são tipados). Mantido no oxlint o `no-restricted-imports` (importar DS só via `@/components/ui`).
- CI (`.github/workflows/ci.yml`): `lint` + `lint:ds` + `tsc --noEmit` + `next build`.

## 4. Camada de dados: mock em memória com contrato de API estável

- `lib/types.ts` — modelo de domínio congelado (Processo, SecaoDocumento, AchadoDFD, TransicaoAprovacao, Tenant, papéis).
- `lib/documentos/` — catálogo de documentos e estrutura seccional (ver §13). É domínio, não mock.
- `lib/mocks/fixtures.ts` — dados do protótipo. **Nunca** importado por componentes.
- `lib/api/client.ts` — funções assíncronas com latência simulada (300–700 ms) sobre um "banco" em memória mutável (criação de processo, salvar/gerar seção, decidir aprovação e parecer do DFD persistem durante a sessão). As assinaturas espelham o futuro cliente OpenAPI do Spring Boot: a integração troca apenas o corpo das funções.
- `lib/api/hooks.ts` — hooks TanStack Query (`useProcessos`, `useProcesso`, `useCriarProcesso`, `useParecerDFD`/`useAnalisarDFD`, `useSecoes`, `useAtualizarSecao`, `useGerarSecao`, `useGerarDocumento`, `useFilaAprovacoes`, `useDecidirAprovacao`, `useDocumentos`, `useConfigTenant`...). Única porta de entrada das views. Os hooks de seção são genéricos por `TipoDocumento` — não há hook por tipo.
- MSW foi dispensado nesta fase: o client mockado cumpre o mesmo papel com menos infraestrutura; se a integração preferir interceptação HTTP, basta trocar o corpo do client.

## 5. Server vs Client Components

Dados são mock no cliente → todas as views são Client Components (`"use client"`). Layouts (`app/layout.tsx`, `app/(app)/layout.tsx`) e `not-found.tsx` são Server Components. Estados de loading/erro/empty são tratados dentro das views via TanStack Query (com `components/shared/estados.tsx`); `loading.tsx` de rota não se aplica porque não há fetch no servidor.

## 6. Modalidade "Credenciamento"

O modelo congelado da spec lista 4 modalidades; o wizard do protótipo exibe 5 (inclui Credenciamento). Para não regredir visualmente, o union `Modalidade` inclui `"Credenciamento"` como superset documentado. O rótulo do card usa "Dispensa de Licitação" (como no protótipo), mas o valor de domínio é `"Dispensa Art. 75"` (vocabulário da spec).

## 7. Correções obrigatórias aplicadas (seção 3.3)

1. **Wordmark GeraDocs** na sidebar (chip gradiente 34px `--gradient-brand` + texto), substituindo "ContrataDoc". O rodapé configurável do tenant também diz "plataforma GeraDocs".
2. **Zero emoji**: ações rápidas, modalidades, cards de Documentos e metadados de Aprovações usam ícones de linha inline estilo Lucide (`components/ui/icons.tsx` — 24×24, stroke 2, round caps). Setas Unicode (→ ←) e ⌘K permanecem, conforme o DS.
3. **Focus ring global** via `:focus-visible` em `globals.css` (2px royal, offset 2px; electric sobre superfícies navy via `.gd-on-dark`).

## 8. Aprovações além do protótipo

O protótipo tinha só Aprovar/Rejeitar. A fase exige comentário obrigatório, ação de Solicitar Retificação e trilha de auditoria — implementados sobre `TransicaoAprovacao` (máquina de estados Rascunho → Em Revisão → (Retificação →) Aprovado | Rejeitado → Concluído), com histórico renderizado por processo e decisões persistidas no mock.

## 9. Responsividade mobile-first (camada `gd-*`)

A partir desta fase o app é compatível com celulares, tablets e laptops (pedido do produto; substitui o "desktop-first ≥1280px" do plano original). Como o estilo é inline com tokens (padrão do DS) e inline styles não suportam media queries, todo layout que varia por viewport vive numa camada de classes `gd-*` em `app/globals.css` — mobile-first, breakpoints 480 / 640 / 768 / 1024 px:

- **Shell**: abaixo de 1024px a sidebar vira drawer off-canvas (`.gd-sidebar`) aberto pelo hambúrguer do Header (`AppShell` guarda o estado; fecha ao navegar ou tocar no backdrop). No laptop permanece fixa de 240px.
- **Header**: busca global oculta abaixo de 768px (`.gd-hide-sm`); CTA "Novo Processo" vira só ícone abaixo de 640px (`.gd-hide-xs`); título com ellipsis.
- **Grids**: stats 1→2→4 colunas (`.gd-stats-grid`), infos de Aprovações 2→4 (`.gd-info-grid`), formulários 1→2/3 (`.gd-form-grid-2/3`), dashboard empilha a coluna lateral abaixo de 1080px.
- **Tabelas**: envolvidas em `.gd-table-wrap` (scroll horizontal) com `minWidth` na tabela — nada estoura a página.
- **Dois painéis** (`.gd-split`): ETP e Aprovações empilham no celular; o rail de seções do ETP vira faixa horizontal rolável de chips (`.gd-etp-list/.gd-etp-item`).
- **Wizard**: conectores do StepIndicator encolhem e só o rótulo do passo ativo aparece abaixo de 480px.
- Padding de página 16→20→28 (`.gd-page`); heros/banners com `flex-wrap`.

Verificação: screenshots via Chrome headless em 375 (via harness de iframe — o headless impõe janela mínima de 500px), 768 e 1366 px em todas as rotas.

## 10. Tailwind CSS v4 — adotado (utility-first sobre os tokens do DS)

**Decisão (jul/2026, a pedido do produto): migrar toda a estilização para Tailwind CSS v4, utility-first, mantendo os tokens do DS como fonte única de verdade.** Substitui a abordagem anterior (estilos inline com `var(--...)` + camada `gd-*`). Guia completo em `docs/estilizacao.md`.

Como a fonte única de verdade foi preservada:
- O bloco **`@theme`** de `app/globals.css` declara cada token do DS (cores, fontes, escala tipográfica, raios, breakpoints, larguras máximas). O Tailwind v4 gera as utilities correspondentes, cada uma resolvendo para a mesma CSS variable — trocar `--color-royal` no `@theme` muda o app inteiro. Não há duplicação de valores.
- Nenhum utilitário de cor "de prateleira" do Tailwind é usado (`text-slate-500` etc.): a paleta do tema é **só** a do DS, então as utilities disponíveis são as dos tokens (`bg-royal`, `text-tint-success-fg`).
- **Enforcement (lint, severidade error)**: `eslint.config.mjs` proíbe cor hex crua, cor arbitrária (`bg-[#...]`, `-[rgb...]`) e tamanho de fonte arbitrário (`text-[NNpx]`). Valores estruturais pontuais em brackets (`min-w-[560px]` de tabela rolável) são permitidos — equivalem às "dimensões pontuais" que antes eram números JS. O `no-restricted-imports` (barrel `@/components/ui`) segue no oxlint.
- **Exceções tokenizadas**: dois tamanhos do protótipo fora da escala fixa (16px de títulos de painel, 28px da nota do DFD) viraram tokens `--text-panel`/`--text-score` no `@theme`, em vez de valores arbitrários — mantêm a fonte única.
- **Responsividade**: migrada da camada `gd-*` para variantes nativas (`xs`/`sm`/`md`/`lg` = 480/640/768/1024). Mesmos breakpoints, mesmo comportamento (sidebar→drawer, tabelas com scroll, painéis que empilham).
- **Componentes reutilizáveis preservados**: cada componente do DS manteve sua API de props (variantes/tamanhos); só o interior mudou de objeto de estilo para mapa de classes utilitárias. Quem consome (`<Button variant="primary">`) não muda.
- **shadcn/ui** (skill instalada): continua **não adotado** — traria componentes Radix com estética própria, conflitando com "os componentes vêm do DS" e com o sistema flat. Tailwind é usado só como camada de estilização dos componentes do próprio DS.

**Anti-regressão**: `tsc`, ESLint, oxlint e `next build` verdes; screenshots headless em 1366/768/375 px comparados com o baseline pré-migração — sem regressão visual. Verificado que zero classes `gd-*` e zero `var(--...)`/hex sobraram no TSX.

## 11. Auditoria com skills instaladas (jul/2026)

Revisão multi-ângulo (skill code-review) usando as skills do repo (`.agents/skills/`) como critérios — `vercel-react-best-practices`, `web-design-guidelines`, `frontend-design`. Correções aplicadas: IDs de aprovações desalinhados com processos nas fixtures (contaminação cruzada de status), race do rascunho do ETP com refetch pós-salvamento (ressincroniza só na troca de seção + ref para callbacks), status "Completo" mantido ao esvaziar seção, página do DFD sem tratamento de erro/id inexistente, "Valor Total Estimado" fixo → derivado de quantidade × valor unitário, comentário de Aprovações apagado por onSuccess tardio, reseed do formulário de Configurações com o tenant canônico pós-mutação, `import "client-only"` no mock (impede vazamento de estado entre requests se algum RSC importar), `prefers-reduced-motion`, e deduplicações: `SettingsCard`→`SectionBlock` do DS, opções de ATA→`ChoiceCard`, `Th` compartilhado (4 páginas), `InlineSpinner` compartilhado, `formatDataHora` em lib/format. Pendências registradas (não bloqueiam a fase): título do Header por contexto de rota em vez de regex, associação programática label↔input no FormField.

## 12. Protótipo preservado

O protótipo Vite original foi mantido em `prototype/` como referência visual durante a migração e **removido do repositório** após a conclusão das 8 telas (permanece disponível no histórico do git, commit `131c240`). A especificação visual vigente é o design system em `design_system/` (renomeado de `LAHHM___GeraDocs_Design_System/`).

## 13. Catálogo de documentos como fonte única (`lib/documentos/`)

Ao acrescentar Edital e Contrato, os metadados por tipo estavam **duplicados em seis lugares** (`TIPOS`/`SLUG`/`META_DOC` no hub, `SLUG_TIPO` no editor, `META_FASE` no DFD, `documentosGeraveis` no wizard, `tiposDoc` em Documentos, `TAMANHO_POR_TIPO` no client), com contagens de seções escritas à mão. Dois tipos novos significariam manter seis mapas em sincronia.

Criado `lib/documentos/`:

- **`catalogo.ts`** — `CATALOGO` (slug, título, descrição, ordem, fundamento, chip de cor, dependências, formato, tamanho), `ORDEM_FLUXO`, `REGRA_MODALIDADE` e os helpers `porSlug`, `ordenar`, `pendencias`, `totalSecoes`, `documentosDaModalidade`, `ehObrigatorio`.
- **`secoes.ts`** — a estrutura seccional de cada documento. **Saiu de `lib/mocks/fixtures.ts`**: a estrutura de um ETP é domínio legal, não dado de demonstração. O que sobrou em fixtures é o conteúdo já redigido do processo de referência (`conteudoDemoETP`).

Todas as telas passaram a ler daqui. Só permanece local no wizard o mapa de classes do estado selecionado (`CLASSES_SELECAO`), porque o Tailwind não enxerga classe montada em tempo de execução — as strings precisam ser literais.

**Ordem canônica e dependências** ficaram declaradas no catálogo e são a espinha do fluxo (Cotação → ETP → Mapa → TR → Edital → Contrato; TR requer ETP, Edital e Contrato requerem TR). Fundamentação em [`fluxo-contratacao.md`](fluxo-contratacao.md).

Uma dependência **só bloqueia se o processo contiver aquele documento**: no Leilão o Edital é obrigatório e não há TR, e ele não pode ficar preso esperando um documento que o processo nunca terá.

## 14. Editor de documentos unificado; rota `/etp` vira redirect

`/processos/[id]/etp` era um editor próprio, ~90% duplicado de `documento/[tipo]` (mesmo rail, mesmo save/advance, mesmo fluxo de regeração). Com seis tipos, a duplicação seria insustentável.

O editor genérico passou a ser o único. Os dois trechos que só o ETP tinha viraram **painéis acionados por metadado da seção** (`SecaoDocumento.painel`), em `components/documentos/paineis.tsx` — antes eram disparados por comparação de **título** (`active.titulo === "Soluções Disponíveis no Mercado"`, `titulo.startsWith("Estimativa")`), o que quebraria ao renomear uma seção.

O antigo `EstimativasSecao` renderizava quantidades **e** valor num bloco só. Como são incisos distintos (Art. 18, § 1º, IV e VI) e agora são seções distintas, virou dois painéis: `quantidades` e `valor`.

A rota `/etp` permanece como `redirect()` para `documento/etp`, para não quebrar links existentes.

## 15. Geração travada só pelas seções obrigatórias

Antes, "Gerar Documento" exigia **todas** as seções concluídas. Isso é incompatível com o **Art. 18, § 2º**, que torna indispensáveis apenas os incisos I, IV, VI, VIII e XIII do ETP e permite dispensar os demais mediante justificativa.

O gate (no hub e no editor) passou a exigir apenas as seções `obrigatoria`. As opcionais em branco são omitidas do documento, com aviso na interface. A `ProgressBar` continua medindo sobre o total.

## 16. Edital e Contrato — tokens `doc-*`

Dois tokens novos em `@theme` (`app/globals.css`), seguindo o padrão dos quatro existentes. O Contrato usa **ardósia** (`#334155`), e não verde: o verde institucional já é o status "Concluído" (`--color-status-done-fg` é exatamente `#15803D`), e um chip verde no documento leria como badge de status.

## 17. Extensões do barrel registradas (pendência antiga)

`docs/estrutura.md` exige registrar aqui todo componente de `components/ui/` que não esteja no DS. Ficaram sem registro: **`Dropdown`** (+ `DropdownOption`), **`MoneyInput`**, **`QuantityInput`** e **`CheckMark`** — todos em uso e sem `.prompt.md` no DS. Ficam registrados como extensões aprovadas. `CardPanel` é o inverso: está especificado em `SectionBlock.prompt.md` e não é exportado pelo barrel.

> `MoneyInput` e `QuantityInput` deixaram de ser extensões não documentadas: ganharam spec no DS (`components/forms/MoneyInput.prompt.md`) ao virarem componentes com máscara — ver §18.

## 18. Campos valorados se formatam sozinhos

`MoneyInput` e `QuantityInput` eram `<input>` de texto **sem máscara**: o que o usuário digitasse ficava como veio (`500000` continuava `500000`), e cada tela refazia o parse à mão com uma regex própria — três implementações ligeiramente diferentes, todas frágeis.

A formatação passou a ser **do componente**, não do chamador: a máscara agrupa os milhares a cada tecla e o blur fecha o valor em duas casas (`500000` → `500.000,00`). Texto colado sujo é aceito (`R$ 485.000,00` → `485.000,00`).

Consequência no contrato: `onChange` entrega **a string já formatada**, e não o `ChangeEvent` — mesmo padrão que o `Dropdown` já usava. Foi uma quebra de API deliberada, com 4 pontos de uso, porque o contrato anterior permitia que uma tela esquecesse de mascarar (e permitia mesmo: era exatamente o bug).

As primitivas de formatação ficam em `lib/format.ts` (`mascaraValorBR`, `normalizaValorBR`, `parseValorBR`, `formatNumeroBR`), ao lado de `formatBRL` — **nenhuma tela deve reimplementar parse ou máscara de valor**. Valores só de leitura (totais, estimativas) não são campos: renderize com `formatBRL` em monospace.

## 19. Verificação do DFD desacoplada do ETP; toggle de retificação removido

Dois ajustes de conformidade no fluxo do wizard.

**Verificação do DFD pela IA** deixou de ser apresentada como "Antes do ETP". Ela é a **etapa inicial** de qualquer processo: o que se verifica é a qualidade da *demanda* (DFD), que fundamenta qualquer documento subsequente — não só o ETP. Passou a ser **gateada na presença do DFD anexado**, não na seleção do ETP: sem DFD anexado (só Objeto da Demanda), o card aparece desabilitado com dica para anexar. Todos os textos que citavam ETP foram desacoplados ("antes de elaborar os documentos"). A mecânica de redirect já era desacoplada (vai para o primeiro documento do fluxo). Fundamentação em [`fluxo-contratacao.md`](fluxo-contratacao.md#verificação-do-dfd-pela-ia--quando-aparece).

**"Fase de Retificação"** era um toggle no wizard que gravava `Processo.fases.retificacao` e **nunca era lido** — flag morto prometendo uma fase inexistente (retificação-com-versionamento é Fase 2, ver §12 do plano e as lacunas em `fluxo-contratacao.md`). O toggle foi **removido do wizard**; o campo permanece no domínio como slot da Fase 2 (sempre `false` por ora). Não confundir com "Solicitar Retificação" na tela de Aprovações, que é decisão de aprovação e **funciona** — essa permaneceu intacta.
