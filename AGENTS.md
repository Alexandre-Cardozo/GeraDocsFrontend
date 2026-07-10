# GeraDocs — Frontend (Next.js)

Aplicação Next.js 16 (App Router) + React 19 + TypeScript strict + TanStack Query. Fase 1: interface completa sobre camada de dados mockada (sem backend). Veja `README.md` (arquitetura e convenções) e `docs/decisions.md` (decisões da fase).

## Comandos

- `npm run dev` — servidor de desenvolvimento
- `npm run check` — lint (ESLint + oxlint de aderência) + type-check; rode ao final de qualquer alteração
- `npm run build` — build de produção

## Regras essenciais

- **Design System é normativo**: antes de qualquer tarefa de UI, leia `LAHHM___GeraDocs_Design_System/readme.md` e o `.prompt.md` do componente relevante. Em conflito entre protótipo e DS, o DS vence.
- **Tokens sempre**: nenhum hex cru ou string `"NNpx"` em TSX (o lint falha). Tokens vivem em `app/globals.css`; dimensões pontuais como números JS.
- **Componentes do DS** importados só de `@/components/ds` (barrel). Ícones: `components/ds/icons.tsx` (linha estilo Lucide) — zero emoji na interface.
- **Dados só via hooks** de `lib/api/hooks.ts`; nunca importe `lib/mocks` em componentes. Trate loading/erro/empty em toda tela.
- **Conteúdo pt-BR**: Title Case em títulos, imperativos em ações, referências legais literais ("Art. 75, II, Lei 14.133/21"), IDs e valores monetários em monospace (`PROC-2024-089`, `R$ 485.000,00`), vocabulário de status fixo (Rascunho, Em Revisão, Aguardando, Aprovado, Rejeitado, Concluído).
- `prototype/` é o protótipo Vite original — referência visual somente; não participa de build/lint e não deve ser editado.
