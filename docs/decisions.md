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

## 2. Estilização: inline styles com tokens, sem CSS-in-JS nem Tailwind

O DS LAHHM/GeraDocs é distribuído como componentes com estilos inline referenciando tokens (`var(--...)`). Mantivemos esse padrão nos ports TSX e nas views:

- **Cores/fontes/radii/espaçamentos de chrome**: sempre `var(--token)`. Hex e px crus vivem **somente** em `app/globals.css` (tokens + extensões).
- **Dimensões pontuais**: números JS (React aplica `px`), nunca strings `"NNpx"`.
- **Tints e bordas compostas do protótipo** que não constavam nos tokens de origem foram **tokenizados** num bloco "Extensões do app" em `globals.css` (ex.: `--tint-royal-bg`, `--border-row`, `--gradient-hero`), em vez de hex espalhado no TSX.
- **Pseudo-estados** que exigiam handlers JS no protótipo (hover de linha, nav da sidebar) viraram classes globais (`.gd-row`, `.gd-nav-item`) — menos JS, mesmo visual.

## 3. Enforcement de aderência

- `eslint.config.mjs`: `eslint-config-next` (flat, nativo no Next 16) + `no-restricted-syntax` com severidade **error** proibindo hex cru, px cru em strings e `fontFamily` fora dos três tokens de fonte. Escopo: `app/`, `components/`, `lib/`.
- `.oxlintrc.json`: derivado do `_adherence.oxlintrc.json` do DS. O oxlint atual não suporta `no-restricted-syntax`; essas regras rodam no ESLint, e a validação de props dos componentes do DS é garantida pelo TypeScript strict (os ports são tipados). Mantido no oxlint o `no-restricted-imports` (importar DS só via `@/components/ds`).
- CI (`.github/workflows/ci.yml`): `lint` + `lint:ds` + `tsc --noEmit` + `next build`.

## 4. Camada de dados: mock em memória com contrato de API estável

- `lib/types.ts` — modelo de domínio congelado (Processo, SecaoETP, AchadoDFD, TransicaoAprovacao, Tenant, papéis).
- `lib/mocks/fixtures.ts` — dados do protótipo. **Nunca** importado por componentes.
- `lib/api/client.ts` — funções assíncronas com latência simulada (300–700 ms) sobre um "banco" em memória mutável (criação de processo, salvar/gerar seção, decidir aprovação e parecer do DFD persistem durante a sessão). As assinaturas espelham o futuro cliente OpenAPI do Spring Boot: a integração troca apenas o corpo das funções.
- `lib/api/hooks.ts` — hooks TanStack Query (`useProcessos`, `useProcesso`, `useCriarProcesso`, `useParecerDFD`/`useAnalisarDFD`, `useSecoesETP`, `useAtualizarSecaoETP`, `useGerarSecaoETP`, `useFilaAprovacoes`, `useDecidirAprovacao`, `useDocumentos`, `useConfigTenant`...). Única porta de entrada das views.
- MSW foi dispensado nesta fase: o client mockado cumpre o mesmo papel com menos infraestrutura; se a integração preferir interceptação HTTP, basta trocar o corpo do client.

## 5. Server vs Client Components

Dados são mock no cliente → todas as views são Client Components (`"use client"`). Layouts (`app/layout.tsx`, `app/(app)/layout.tsx`) e `not-found.tsx` são Server Components. Estados de loading/erro/empty são tratados dentro das views via TanStack Query (com `components/estados.tsx`); `loading.tsx` de rota não se aplica porque não há fetch no servidor.

## 6. Modalidade "Credenciamento"

O modelo congelado da spec lista 4 modalidades; o wizard do protótipo exibe 5 (inclui Credenciamento). Para não regredir visualmente, o union `Modalidade` inclui `"Credenciamento"` como superset documentado. O rótulo do card usa "Dispensa de Licitação" (como no protótipo), mas o valor de domínio é `"Dispensa Art. 75"` (vocabulário da spec).

## 7. Correções obrigatórias aplicadas (seção 3.3)

1. **Wordmark GeraDocs** na sidebar (chip gradiente 34px `--gradient-brand` + texto), substituindo "ContrataDoc". O rodapé configurável do tenant também diz "plataforma GeraDocs".
2. **Zero emoji**: ações rápidas, modalidades, cards de Documentos e metadados de Aprovações usam ícones de linha inline estilo Lucide (`components/ds/icons.tsx` — 24×24, stroke 2, round caps). Setas Unicode (→ ←) e ⌘K permanecem, conforme o DS.
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

## 10. Protótipo preservado

O protótipo Vite original foi mantido em `prototype/` como referência visual durante a migração e **removido do repositório** após a conclusão das 8 telas (permanece disponível no histórico do git, commit `131c240`). A especificação visual vigente é o design system em `design_system/` (renomeado de `LAHHM___GeraDocs_Design_System/`).
