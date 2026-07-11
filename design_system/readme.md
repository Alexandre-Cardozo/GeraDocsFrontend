# LAHHM · GeraDocs Design System

GeraDocs is LAHHM's GovTech SaaS product: a web platform used by Brazilian municipal governments (prefeituras) and public agencies to automate the drafting of public-procurement planning documents — chiefly the Estudo Técnico Preliminar (ETP), the Termo de Referência (TR), plus Cotação de Mercado and Mapa de Riscos. It replaces manual Word files and scattered templates with a guided, step-by-step flow: create a contratação process, attach/verify the DFD with AI feedback, fill the ETP/TR section by section with automatic validations, manage ATA adhesion (attach an ATA for AI review and/or delegate ATA search to the model), route for review/approval (including an optional Retificação phase), and export final DOCX/PDF with the municipality's letterhead.

**Users:** municipal procurement staff, requesting secretarias, contracting commissions, legal, and approving managers. The UI must convey trust, security, organization, and institutional professionalism — modern corporate SaaS, not an institutional website.

## Sources

- Codebase (ground truth): mounted local folder `GeraDocs SaaS Platform Prototype (Copy)/` — Vite + React + TS prototype (`src/components/{Sidebar,Header,StatusBadge}.tsx`, `src/views/{Dashboard,ProcessList,NewProcess,ETPForm,Approvals,Documents,Settings,DFDReview}.tsx`, `src/index.css`). Styling is inline-style-based; `index.css` holds the palette and font imports.
- Logos: `uploads/geradocs_logo_.jpeg` (product mark), `uploads/laam_logo_.jpeg` (LAHHM company wordmark) → copied to `assets/`.
- Original prototype prompts (product spec) provided by the user in chat.

Note: the prototype's sidebar wordmark reads "ContrataDoc"; per the user, the product name is **GeraDocs** and the company is **LAHHM** — the design system uses GeraDocs/LAHHM.

## CONTENT FUNDAMENTALS

- **Language:** Brazilian Portuguese, formal-institutional but friendly. Title Case for headings/labels ("Processos de Contratação", "Novo Processo").
- **Voice:** system addresses the user as *você* implicitly; imperative verbs for actions ("Selecione a Modalidade", "Salvar e Avançar →", "Anexar ATA"). Greeting is warm and first-name: "Bom dia, Maria".
- **Legal precision:** cites law verbatim — "Art. 75, II, Lei 14.133/21", "Art. 86 da Lei 14.133/21". Never paraphrases legal references.
- **Guidance-heavy:** every field/section has a hint sentence explaining what to write and why ("Baseie-se em pesquisas de mercado, contratos anteriores ou painel de preços…"). The user should always know the next step ("Após a criação você será direcionado ao preenchimento do ETP.").
- **IDs & money:** monospace, exact formats — `PROC-2024-089`, `R$ 485.000,00`, dates `05/07/2024`.
- **Micro-labels:** uppercase 10px with wide tracking ("ÓRGÃO ATUAL", "PRINCIPAL", table headers).
- **Arrows in CTAs:** "Continuar →", "Ver todos →", "← Seção Anterior".
- **Emoji:** not used. All icons are monochrome Lucide-style line SVGs (stroke currentColor).
- **Status vocabulary (fixed):** Rascunho, Em Revisão, Aguardando, Aprovado, Rejeitado, Concluído; doc states: Completo, Em andamento, Em revisão, Não iniciado, Rejeitado; tags: Obrigatório, Opcional, Recomendado, Urgente.

## VISUAL FOUNDATIONS

- **Palette:** deep navy `#071A3D` (sidebar, headings), petroleum `#0D3B66` (money values, dark panels), royal `#2563EB` (primary actions/links/active), electric `#38BDF8` (accents, active-item tick, gradients), slate `#64748B` (secondary text), ice `#F8FAFC` (app bg), border `#E2E8F0`. Semantic: success `#10B981`, warning `#F59E0B`, danger `#EF4444`.
- **Type:** Plus Jakarta Sans (700/800) for headings with negative tracking (−0.3/−0.5px); Inter for UI text; JetBrains Mono for IDs, money, kbd. Base UI size 13px; inputs 14px; stat numbers 30px/800. **Heading ramp (fixed):** page headings 20px/800 −0.5px · toolbar/header titles 17px/700 −0.3px · card titles 15px/700 · body 13px.
- **Backgrounds:** flat ice-white app canvas; white cards; navy sidebar & occasional navy/petroleum dark panels (`linear-gradient(135deg,#1E3A5F,#0D3B66)`); no imagery, no textures.
- **Gradients:** small and purposeful only — brand logo chip `135deg #2563EB→#38BDF8`, avatar `135deg #0D3B66→#2563EB`, progress bar `90deg #2563EB→#38BDF8`.
- **Cards:** white, 1px `#E2E8F0` border, radius 12px, **no drop shadows** — the system is flat; borders carry separation. Inner section dividers use softer `#F1F5F9`.
- **Radii scale:** 12px cards/tables, 8px inputs/buttons/nav, 6px pills/small chips, 999px badges/toggles/avatars.
- **Buttons:** fixed heights — sm 32px · md 36px · lg 40px; radius 8px; 13–14px/600 labels.
- **Hover states:** background shifts, not shadows — rows/list items to `#F8FAFC`; primary button `#2563EB→#1D4ED8`; sidebar items to `rgba(255,255,255,0.06)` + white text. Transitions `0.15s` (bg) / `0.2s` (toggles, progress).
- **Selected states:** 2px royal border + `#EFF6FF` tint fill + check circle; sidebar active = `rgba(37,99,235,0.18)` fill + 3×20px electric left bar (rounded right).
- **Press states:** none distinct from hover in source; keep it that way.
- **On-dark surfaces:** white at alpha steps — text 1.0/0.65/0.55/0.4/0.35/0.3, fills 0.06/0.08/0.1 borders.
- **Focus:** inputs use `outline: none` in the source; no visible focus ring system (prototype-level; flag for accessibility work).
- **Shadows:** only the toggle knob (`0 1px 3px rgba(0,0,0,0.2)`).
- **Density/layout:** fixed 240px navy sidebar, 60px white header, 28px page padding, max-width 1200px content (880px for wizards); ETP editor adds a 280px white section rail. Tables: uppercase 11px headers on `#F8FAFC`, 13–14px rows.
- **Animation:** subtle and functional only — 0.15–0.2s eases, 0.5s progress width, 1s spinner. No bounces, no entrance animations.
- **Scrollbars:** 5px thin, `#CBD5E1` rounded thumb.

## ICONOGRAPHY

- **System:** inline SVG line icons, 24×24 viewBox, `stroke="currentColor"`, stroke-width 2 (2.5 for small/bold marks, 1.5 for large empty-state), round caps/joins — visually equivalent to **Feather/Lucide**. Rendered at 13–20px.
- No icon font, no PNG icons. Use Lucide from CDN (or copy the same paths inline) when composing new screens — same stroke weight.
- Check marks: white 3–3.5 stroke polyline `20 6 9 17 4 12` inside filled royal/green circles/squares.
- Emoji are not used anywhere; quick-action and modalidade rows use the same monochrome line icons (royal on white surfaces, electric #38BDF8 on navy).
- Unicode arrows (→ ←) inside button/link labels are standard.
- **Logos** (`assets/`): `geradocs-logo.png` — blue gradient document mark with check; `lahhm-mark.png` — royal square "L" mark; `lahhm-logo.png` — mark + LAHHM wordmark. Transparent PNGs. In the app sidebar chrome, the mark is a 34px gradient chip + wordmark text, not the raster logo.

## Fonts

All three families are Google Fonts, loaded via `@import` in `tokens/typography.css` (as in the source prototype): Plus Jakarta Sans, Inter, JetBrains Mono. No local binaries were provided; if offline use is needed, supply .woff2 files and we'll switch to local `@font-face`.

## Index

- `styles.css` — global entry; imports everything under `tokens/`.
- `tokens/` — `colors.css`, `typography.css`, `layout.css` (spacing, radii, borders, motion).
- `assets/` — `geradocs-logo.png`, `lahhm-mark.png`, `lahhm-logo.png`.
- `components/core/` — Button, StatusBadge, DocPill, Tag, Toggle, Input, Textarea, Select, FormField, FileUpload, ChoiceCard, StatCard, SectionBlock, ValidationMsg, StepIndicator, ProgressBar, SearchInput, FilterTabs.
- `components/chrome/` — Sidebar, Header (app shell).
- `ui_kits/geradocs/` — interactive recreation of the app (Dashboard, Processos, Novo Processo wizard, ETP editor).
- `guidelines/` — foundation specimen cards shown in the Design System tab.
- `SKILL.md` — agent skill entry point.

### Intentional additions

- `ProgressBar`, `SearchInput`, `FilterTabs` — extracted from repeated inline patterns in the source views (ETP progress, header/list search, ProcessList status filter), not inventions.

### Known gaps

- No focus-ring system in source (accessibility gap to resolve with product).
- Approvals/Documents/Settings/DFDReview views exist in source but are not yet recreated in the UI kit.
