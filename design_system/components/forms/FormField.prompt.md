Field wrapper adding the 13px/600 label, red asterisk and 12px hint line.

```jsx
<FormField label="Objeto da Contratação" required hint="Obrigatório quando o DFD não é inserido">
  <Textarea rows={3} />
</FormField>
<FormField label="CPF" tip="O CPF não pode ser alterado."> {/* ⓘ info icon + tooltip beside the label */}
  <Input value={cpf} disabled />
</FormField>
```

`hint` = a persistent line under the label; `tip` = a short note shown only on hover, as an info icon (ⓘ) next to the label. Prefer `tip` for terse "why" notes that shouldn't take vertical space.
