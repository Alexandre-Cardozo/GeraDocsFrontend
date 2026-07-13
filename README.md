# GeraDocs — Frontend

Aplicação web do **GeraDocs**, SaaS GovTech da **LAHHM** que automatiza, com IA, os documentos de planejamento da contratação pública sob a **Lei 14.133/2021** (DFD → ETP/TR → aprovação → exportação DOCX/PDF com timbre do município).

Esta é a **Fase 1 (somente interface)**: a industrialização do protótipo Vite como aplicação **Next.js (App Router)** de produção. Não há backend — toda a interface funciona de ponta a ponta sobre uma camada de dados mockada, arquitetada para a integração com o backend Spring Boot (via OpenAPI) ser plugada tela a tela, sem retrabalho.

## Stack

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript strict**
- **TanStack Query 5** — dados via hooks, mocks com latência simulada
- **Design System LAHHM/GeraDocs** — tokens CSS + componentes portados a TSX (sem bibliotecas de UI de terceiros)
- Fontes via `next/font`: Plus Jakarta Sans (display), Inter (UI), JetBrains Mono (IDs/valores)

## Comandos

```bash
npm install
npm run dev        # desenvolvimento (http://localhost:3000)
npm run build      # build de produção
npm start          # servir o build
npm run lint       # eslint-config-next + regras de aderência ao DS (hex/px/fonte)
npm run lint:ds    # oxlint com o config de aderência do DS
npm run typecheck  # tsc --noEmit
npm run check      # tudo acima
```

## Estrutura

> Documentação completa da organização de pastas, com o porquê de cada diretório e o fluxo "onde colocar meu código": **[docs/estrutura.md](docs/estrutura.md)**.

```
app/                    # ROTAS (App Router) — cada pasta = um segmento de URL
  layout.tsx            # fonts (next/font), metadata, Providers (Query + Toast)
  globals.css           # tokens do DS + extensões + reset + focus ring + classes gd-*
  not-found.tsx         # 404
  (app)/                # shell autenticado: Sidebar 240px navy + Header 60px
    page.tsx            # Dashboard                       /
    processos/          # Lista, wizard (novo/), DFD e ETP ([id]/dfd, [id]/etp)
    aprovacoes/         # Fila + trilha de auditoria      /aprovacoes
    documentos/         # Repositório de documentos       /documentos
    configuracoes/      # Tenant, secretarias, PCA        /configuracoes
components/             # INTERFACE REUTILIZÁVEL
  ui/                   # Design System em TSX — importe SEMPRE de "@/components/ui"
  layout/               # Moldura da aplicação: AppShell, Sidebar, Header
  shared/               # Apoios: providers (Query+Toast), estados (loading/erro/vazio), tabela
lib/                    # DADOS E DOMÍNIO (TypeScript puro)
  types.ts              # modelo de domínio congelado (Processo, SecaoETP, ...)
  format.ts             # formatBRL ("R$ 485.000,00"), formatData, formatDataHora
  mocks/fixtures.ts     # dados — nunca importar em componentes
  api/client.ts         # client mock (assinaturas = futuro cliente OpenAPI)
  api/hooks.ts          # hooks TanStack Query (única porta das views)
design_system/          # DS fonte (tokens, .prompt.md, guidelines) — normativo
docs/                   # estrutura.md (organização) e decisions.md (decisões)
```

## Convenções

- **Tokens sempre**: nenhum hex ou `"NNpx"` cru em TSX — o ESLint falha o build. Cores/bordas/fontes via `var(--token)` (tokens em `app/globals.css`); dimensões pontuais como números JS.
- **Dados só via hooks**: views nunca importam `lib/mocks`; tudo passa por `lib/api/hooks.ts`, com loading/erro/empty tratados.
- **DS via barrel**: componentes do DS importados de `@/components/ui` (regra de lint). Antes de mexer em UI, consulte o `readme.md` do DS e o `.prompt.md` do componente.
- **Conteúdo pt-BR**: Title Case em títulos, imperativos em ações, referências legais literais ("Art. 75, II, Lei 14.133/21"), IDs/valores em monospace, vocabulário de status fixo.
- **Zero emoji**: ícones de linha estilo Lucide em `components/ui/icons.tsx`.
- **Responsivo mobile-first**: layouts que variam por viewport usam as classes `gd-*` de `app/globals.css` (breakpoints 480/640/768/1024). Sidebar vira drawer abaixo de 1024px; tabelas largas rolam dentro de `.gd-table-wrap`; nunca deixe a página estourar horizontalmente.

## Como plugar o backend depois

1. Gere o cliente TypeScript do OpenAPI do Spring Boot.
2. Substitua **apenas os corpos** das funções de `lib/api/client.ts` por chamadas HTTP — as assinaturas e os tipos de `lib/types.ts` já espelham o contrato.
3. Os hooks, as views e os estados de loading/erro continuam intactos; remova as fixtures quando a última função migrar.
4. Autenticação/middleware e exportação DOCX/PDF real entram em fases seguintes (os botões já existem com toasts explicativos).

## Fluxo completo simulável com mocks

Criar processo (wizard) → anexar DFD → checklist da IA (parecer persistido) → preencher/gerar seções do ETP (IA simulada) → enviar/decidir aprovação com comentário obrigatório (Aprovar / Rejeitar / Solicitar Retificação, trilha de auditoria) → ver documentos em Documentos Gerados.
