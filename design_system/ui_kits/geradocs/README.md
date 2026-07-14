# GeraDocs UI Kit

Interactive recreation of the GeraDocs prototype (source: `GeraDocs SaaS Platform Prototype (Copy)/src/`), composing the design-system components from `components/`.

## Screens
- `DashboardScreen.jsx` — greeting, 4 KPI stat cards, recent-process table, pending approvals, dark quick-actions panel.
- `ProcessListScreen.jsx` — search + status FilterTabs, full process table (modalidade/ETP/TR pills), pagination.
- `NewProcessScreen.jsx` — 3-step wizard: modalidade choice cards + Adesão de ATA toggle (motivo + ATA modes), identificação (DFD upload OR objeto), documentos a gerar + optional phases (Verificação DFD pela IA, Retificação).
  > **Out of date vs. the app.** In the app, step 3 lists the documents **in flow order and filtered by modalidade**: the ones required by that modalidade come pre-checked and locked, and non-applicable types are hidden (direct contracting has no Edital). See `docs/fluxo-contratacao.md` in the app repo.
- `ETPFormScreen.jsx` — 280px section rail with progress, section forms, ATA banner + AI review panel on section 6.

`index.html` wires them with Sidebar + Header into a click-through app.

Not recreated (exist in original prototype, omitted here): Approvals, Documents, Settings, DFDReview — index.html shows labeled placeholders.
