Authentication screen — rendered **outside** the app shell (no sidebar/header), in the `(auth)` route group.

Layout (Altavum-inspired, GeraDocs-styled): full-bleed navy→petroleum background (`gradient-hero`, no imagery — the flat GovTech look), a centered white flat card (1px border, radius 12, no shadow), product mark above the fields, and a credit line below.

```jsx
<div className="min-h-dvh grid place-items-center bg-navy gradient-hero px-4">
  <div className="w-full max-w-md">
    {/* Marca do produto */}
    <GeraDocsLogoWhite /> {/* /geradocs-logo-white.png + wordmark */}
    {/* Card */}
    <div className="rounded-card border border-on-dark-border bg-surface p-7">
      <h1>Acesse sua conta</h1>
      <FormField label="CPF"><Input placeholder="000.000.000-00" /></FormField>
      <FormField label="Senha"><Input type="password" /></FormField>
      <Button size="lg" className="w-full">Entrar</Button>
    </div>
    {/* Crédito: "GeraDocs é um produto LAHHM" + /lahhm-logo.png */}
  </div>
</div>
```

Rules:
- **CPF field:** mask `000.000.000-00`, validate check digits, generic error ("CPF ou senha inválidos" — never reveal which failed).
- **Product identity:** GeraDocs logo + wordmark on the card; the footer credits **LAHHM** ("GeraDocs é um produto LAHHM") with the LAHHM logo — the platform always attributes the parent company.
- **Slogan/tagline** above the form; keep it short and institutional.
- Password recovery link → a minimal recovery view (email → generic confirmation).
- Never use a photo background — the DS is flat; the navy gradient carries the mood.
