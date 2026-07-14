import React from "react";

const base = {
  width: "100%", padding: "10px 13px", border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-md)", fontSize: 14, color: "var(--text-body)",
  background: "#FFFFFF", outline: "none", fontFamily: "var(--font-body)", boxSizing: "border-box",
};

const affix = {
  position: "absolute", top: "50%", transform: "translateY(-50%)",
  fontSize: 13, fontWeight: 600, color: "var(--color-slate)",
};

/**
 * pt-BR money mask, applied on every keystroke: keeps digits and one decimal
 * comma, groups thousands, caps at two decimal places. It does NOT pad the
 * decimals — that would fight the user mid-typing; `normalizaValorBR` does it
 * on blur.
 */
export function mascaraValorBR(texto) {
  const limpo = String(texto).replace(/[^\d,]/g, "");
  const [primeiro, ...resto] = limpo.split(",");
  const inteiro = primeiro.replace(/^0+(?=\d)/, "");
  const agrupado = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  if (resto.length === 0) return agrupado;
  return `${agrupado || "0"},${resto.join("").slice(0, 2)}`;
}

/** "485.000,00" → 485000. Tolerates dirty text ("R$ 485.000,00"); empty → 0. */
export function parseValorBR(texto) {
  return Number.parseFloat(String(texto).replace(/[^\d,]/g, "").replace(",", ".")) || 0;
}

/** Closes the field in the canonical form: "500.000" → "500.000,00". Empty stays empty. */
export function normalizaValorBR(texto) {
  if (String(texto).trim() === "") return "";
  return new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    .format(parseValorBR(texto));
}

/**
 * Currency field — fixed "R$" prefix. The component owns the formatting, so
 * `onChange` receives the already-formatted string, not the event.
 */
export function MoneyInput({ value, onChange, placeholder = "0,00", style, ...rest }) {
  return (
    <div style={{ position: "relative" }}>
      <span style={{ ...affix, left: 12 }}>R$</span>
      <input
        value={value}
        onChange={(e) => onChange && onChange(mascaraValorBR(e.target.value))}
        onBlur={(e) => onChange && onChange(normalizaValorBR(e.target.value))}
        placeholder={placeholder}
        inputMode="decimal"
        style={{ ...base, paddingLeft: 36, ...style }}
        {...rest}
      />
    </div>
  );
}

/** Quantity field — same mask as MoneyInput, with an optional unit suffix. */
export function QuantityInput({ value, onChange, placeholder = "0,00", suffix, style, ...rest }) {
  return (
    <div style={{ position: "relative" }}>
      <input
        value={value}
        onChange={(e) => onChange && onChange(mascaraValorBR(e.target.value))}
        onBlur={(e) => onChange && onChange(normalizaValorBR(e.target.value))}
        placeholder={placeholder}
        inputMode="decimal"
        style={{ ...base, paddingRight: suffix ? 40 : 13, ...style }}
        {...rest}
      />
      {suffix && <span style={{ ...affix, right: 12, fontWeight: 500, color: "var(--text-muted)" }}>{suffix}</span>}
    </div>
  );
}
