Form text input; `Textarea` and `Select` (same file) share the identical field styling.

```jsx
<Input placeholder="Ex: Art. 75, II, Lei 14.133/21" />
<Input prefix="R$" value="3.233,33" />
<Input type="password" autoComplete="current-password" />
<Input value={formatCPF(cpf)} disabled title="O CPF não pode ser alterado." />
<Select placeholder="Selecione a secretaria..." options={["Secretaria de Educação", "Secretaria de Saúde"]} />
<Textarea rows={3} placeholder="Descreva a necessidade..." />
```

Props: `prefix` (bold slate prefix, e.g. "R$"), `type` (`text`/`password`/`email`), `autoComplete`, `disabled` (read-only, non-focusable, muted — use for immutable fields like CPF; also silences React's "value without onChange" warning). A `value` field that is not editable must be `disabled` (or have `onChange`).
