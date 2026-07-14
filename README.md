# GeraDocs — Frontend

Aplicação web do **GeraDocs**, SaaS GovTech da **LAHHM** que automatiza, com IA, os documentos da fase preparatória da contratação pública sob a **Lei 14.133/2021**: o DFD é anexado e verificado, e a plataforma gera **Cotação de Mercado → ETP → Mapa de Riscos → TR → Edital → Contrato**, na ordem do fluxo real, até a aprovação e a exportação DOCX/PDF com timbre do município.

> Que documentos existem, em que ordem, com que fundamento legal e quais são as lacunas conhecidas: **[docs/fluxo-contratacao.md](docs/fluxo-contratacao.md)** — leia antes de mexer em documentos, wizard ou hub do processo.

Esta é a **Fase 1 (somente interface)**: a industrialização do protótipo Vite como aplicação **Next.js (App Router)** de produção. Não há backend — toda a interface funciona de ponta a ponta sobre uma camada de dados mockada, arquitetada para a integração com o backend Spring Boot (via OpenAPI) ser plugada tela a tela, sem retrabalho.

## Stack

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript strict**
- **Tailwind CSS v4** utility-first — tokens do DS mapeados via `@theme` (fonte única de verdade); ver [docs/estilizacao.md](docs/estilizacao.md)
- **TanStack Query 5** — dados via hooks, mocks com latência simulada
- **Design System LAHHM/GeraDocs** — componentes portados a TSX (sem bibliotecas de UI de terceiros)
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
    processos/          # Lista, wizard (novo/), hub ([id]), DFD ([id]/dfd) e
                        #   editor de documentos ([id]/documento/[tipo])
    aprovacoes/         # Fila + trilha de auditoria      /aprovacoes
    documentos/         # Repositório de documentos       /documentos
    configuracoes/      # Tenant, secretarias, PCA        /configuracoes
components/             # INTERFACE REUTILIZÁVEL
  ui/                   # Design System em TSX — importe SEMPRE de "@/components/ui"
  layout/               # Moldura da aplicação: AppShell, Sidebar, Header
  documentos/           # Painéis de domínio do editor (ATA, quantidades, valor)
  shared/               # Apoios: providers (Query+Toast), estados (loading/erro/vazio), tabela
lib/                    # DADOS E DOMÍNIO (TypeScript puro)
  types.ts              # modelo de domínio congelado (Processo, SecaoDocumento, ...)
  documentos/           # CATÁLOGO: ordem, dependências, regras por modalidade e seções
  format.ts             # formatBRL ("R$ 485.000,00"), formatData, formatDataHora
  mocks/fixtures.ts     # dados — nunca importar em componentes
  api/client.ts         # client mock (assinaturas = futuro cliente OpenAPI)
  api/hooks.ts          # hooks TanStack Query (única porta das views)
design_system/          # DS fonte (tokens, .prompt.md, guidelines) — normativo
docs/                   # estrutura.md · decisions.md · fluxo-contratacao.md (domínio)
```

## Convenções

- **Tailwind sobre tokens**: estilo por classes de token (`bg-royal`, `text-lg`); nenhuma cor hex/arbitrária — o ESLint falha o build. Tokens no `@theme` de `app/globals.css`. Ver [docs/estilizacao.md](docs/estilizacao.md).
- **Dados só via hooks**: views nunca importam `lib/mocks`; tudo passa por `lib/api/hooks.ts`, com loading/erro/empty tratados.
- **DS via barrel**: componentes do DS importados de `@/components/ui` (regra de lint). Antes de mexer em UI, consulte o `readme.md` do DS e o `.prompt.md` do componente.
- **Conteúdo pt-BR**: Title Case em títulos, imperativos em ações, referências legais literais ("Art. 75, II, Lei 14.133/21"), IDs/valores em monospace, vocabulário de status fixo.
- **Valores nunca crus**: monetários e quantidades sempre com milhar e duas casas (`500.000,00`). Exibir → `formatBRL`/`formatNumeroBR`; digitar → `MoneyInput`/`QuantityInput`, que mascaram sozinhos. Nunca refaça a máscara ou o parse na tela.
- **Zero emoji**: ícones de linha estilo Lucide em `components/ui/icons.tsx`.
- **Responsivo mobile-first**: variantes Tailwind `xs`(480)/`sm`(640)/`md`(768)/`lg`(1024) no `className`. Sidebar vira drawer abaixo de `lg`; tabelas largas rolam dentro de `overflow-x-auto` com `min-w-[...]`; nunca deixe a página estourar horizontalmente.

## Como plugar o backend depois

1. Gere o cliente TypeScript do OpenAPI do Spring Boot.
2. Substitua **apenas os corpos** das funções de `lib/api/client.ts` por chamadas HTTP — as assinaturas e os tipos de `lib/types.ts` já espelham o contrato.
3. Os hooks, as views e os estados de loading/erro continuam intactos; remova as fixtures quando a última função migrar.
4. Autenticação/middleware e exportação DOCX/PDF real entram em fases seguintes (os botões já existem com toasts explicativos).

## Fluxo completo simulável com mocks

Criar processo no wizard (os documentos oferecidos dependem da modalidade — contratação direta não tem Edital) → anexar DFD → checklist da IA (parecer persistido) → elaborar os documentos na ordem do fluxo, preenchendo ou gerando cada seção com IA simulada, com as dependências travando o que ainda não pode começar (o TR espera o ETP; o Edital espera o TR) → finalizar cada documento, o que exige só as seções obrigatórias → enviar/decidir aprovação com comentário obrigatório (Aprovar / Rejeitar / Solicitar Retificação, trilha de auditoria) → ver os documentos em Documentos Gerados.

Ordem, fundamento legal de cada documento e **lacunas conhecidas** (retificação, versionamento, envio para aprovação, parecer jurídico): [docs/fluxo-contratacao.md](docs/fluxo-contratacao.md).
