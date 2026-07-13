# Decisões de Arquitetura — Frontend GeraDocs (Fase 1)

Registro curto das decisões relevantes da industrialização do protótipo (Vite → Next.js), conforme seção 9 do prompt da fase.

## 1. Estrutura de rotas (App Router)

Route group `(app)` para o shell autenticado (Sidebar + Header); `app/layout.tsx` só carrega fonts, providers e `globals.css`.

| Rota | View |
|---|---|
| `/` | Dashboard |
| `/processos` | Lista de processos |
| `/processos/novo` | Wizard de novo processo |
| `/processos/[id]/dfd` | Verificação do DFD pela IA |
| `/processos/[id]/etp` | Editor de ETP (12 seções — seção ativa é estado local, não sub-rota) |
| `/aprovacoes` · `/documentos` · `/configuracoes` | Aprovações · Documentos · Configurações |

A sub-rota opcional `/etp/[secao]` foi dispensada nesta fase: a troca de seção é instantânea (estado local) e o deep-link relevante é para o processo, não para a seção.

## 2. Estilização: Tailwind CSS v4 utility-first sobre os tokens do DS

> **Atualizado (jul/2026):** a estilização migrou para **Tailwind CSS v4 utility-first**. A decisão detalhada e a garantia de fonte única de verdade estão no **item 10**; o guia prático em `docs/estilizacao.md`. O texto abaixo descreve a abordagem original (inline styles), preservado como histórico.

~~O DS LAHHM/GeraDocs é distribuído como componentes com estilos inline referenciando tokens (`var(--...)`). Mantivemos esse padrão nos ports TSX e nas views~~ — substituído por classes utilitárias do Tailwind, cujos valores vêm do `@theme` (mesmos tokens). Os tints/gradientes que eram "Extensões do app" em `globals.css` viraram tokens do `@theme`; os pseudo-estados que eram classes `gd-*` viraram utilities `hover:*`.

## 3. Enforcement de aderência

- `eslint.config.mjs`: `eslint-config-next` (flat, nativo no Next 16) + `no-restricted-syntax` com severidade **error** proibindo hex cru, px cru em strings e `fontFamily` fora dos três tokens de fonte. Escopo: `app/`, `components/`, `lib/`.
- `.oxlintrc.json`: derivado do `_adherence.oxlintrc.json` do DS. O oxlint atual não suporta `no-restricted-syntax`; essas regras rodam no ESLint, e a validação de props dos componentes do DS é garantida pelo TypeScript strict (os ports são tipados). Mantido no oxlint o `no-restricted-imports` (importar DS só via `@/components/ui`).
- CI (`.github/workflows/ci.yml`): `lint` + `lint:ds` + `tsc --noEmit` + `next build`.

## 4. Camada de dados: mock em memória com contrato de API estável

- `lib/types.ts` — modelo de domínio congelado (Processo, SecaoETP, AchadoDFD, TransicaoAprovacao, Tenant, papéis).
- `lib/mocks/fixtures.ts` — dados do protótipo. **Nunca** importado por componentes.
- `lib/api/client.ts` — funções assíncronas com latência simulada (300–700 ms) sobre um "banco" em memória mutável (criação de processo, salvar/gerar seção, decidir aprovação e parecer do DFD persistem durante a sessão). As assinaturas espelham o futuro cliente OpenAPI do Spring Boot: a integração troca apenas o corpo das funções.
- `lib/api/hooks.ts` — hooks TanStack Query (`useProcessos`, `useProcesso`, `useCriarProcesso`, `useParecerDFD`/`useAnalisarDFD`, `useSecoesETP`, `useAtualizarSecaoETP`, `useGerarSecaoETP`, `useFilaAprovacoes`, `useDecidirAprovacao`, `useDocumentos`, `useConfigTenant`...). Única porta de entrada das views.
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
