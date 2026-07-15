Dashboard KPI card; `ProgressBar` (same file) is the gradient completion bar.

**Standardized style — the component owns it.** A StatCard is a tinted flat card with a big faded watermark icon bleeding out of the bottom-right corner, a label, and a large stat number. The caller passes a **`tone`** (which sets both the tint background and the watermark color) and the **icon as a component reference** (`icon={IconFile}`, not `<IconFile/>`) — the card renders it at the fixed watermark size (130px). Never pass raw background/icon classes or a pre-sized icon; that let cards drift apart (e.g. an admin panel that ended up with tiny icons). Use the same `StatCard` on every dashboard.

```jsx
<StatCard label="Processos Ativos"     value="24"  icon={IconFile}        tone="royal" />
<StatCard label="Aguardando Aprovação" value="7"   icon={IconClock}       tone="warning" />
<StatCard label="Documentos Gerados"   value="139" icon={IconDownload}    tone="teal" />
<StatCard label="ETPs Concluídos"      value="61"  icon={IconCheckCircle} tone="success" />
<ProgressBar percent={25} label="Progresso do ETP" sub="3 de 12 seções concluídas" />
```

`tone` ∈ `royal` · `warning` · `teal` · `success` · `slate`. Each maps to a fixed tint (`bg-tint-*-bg` / `bg-doc-tr-bg` / `bg-status-done-bg` / `bg-ice`) + a `text-*/15` watermark. Add a new tone in the component's `STAT_TONES` map, never inline at the call site.
