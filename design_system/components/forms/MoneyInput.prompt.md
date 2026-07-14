Currency field with a fixed "R$" prefix. `QuantityInput` (same file) is the identical field for quantities, with an optional unit suffix instead of the prefix.

**These components own their formatting — the caller never masks.** Digits are grouped as they are typed and the value is closed to two decimals on blur: typing `500000` shows `500.000` while typing and becomes `500.000,00` on blur. Pasted text is accepted and cleaned (`R$ 485.000,00` → `485.000,00`). Because of that, `onChange` hands back the **already-formatted string**, not the event — the same contract as `Select`/`Dropdown`. Never render a raw number into these fields.

Use them for **every** monetary and quantity field. A plain `<Input prefix="R$">` does not mask and must not be used for money.

```jsx
<MoneyInput value={valor} onChange={setValor} />              // "500.000,00"
<QuantityInput value={qtd} onChange={setQtd} suffix="un" />   // "1.500,00 un"
```

To get the number back for calculations, parse the string — do not re-implement the parsing:

```js
parseValorBR("500.000,00")  // 500000
formatNumeroBR(500000)      // "500.000,00"  (no currency symbol)
formatBRL(500000)           // "R$ 500.000,00"
```

Read-only monetary results (totals, estimates) are **not** inputs: render them with `formatBRL` in monospace (`font-mono`, petroleum), as in the "Valor Total Estimado" box.
