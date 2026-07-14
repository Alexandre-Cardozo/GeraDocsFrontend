/**
 * Monetary field with a fixed "R$" prefix. The component owns the pt-BR mask
 * (thousand grouping while typing, two decimals on blur), so `onChange` hands
 * back the formatted string rather than the event.
 */
export interface MoneyInputProps {
  /** Formatted value, e.g. "500.000,00". */
  value?: string;
  /** Receives the already-masked string — not a ChangeEvent. */
  onChange?: (valor: string) => void;
  placeholder?: string;
  style?: React.CSSProperties;
}

/** Quantity field — same mask as MoneyInput, with an optional unit suffix. */
export interface QuantityInputProps extends MoneyInputProps {
  /** Unit rendered inside the right edge of the field, e.g. "un", "m²". */
  suffix?: string;
}

/** Mask applied on each keystroke: digits + one comma, thousands grouped, max 2 decimals. */
export declare function mascaraValorBR(texto: string): string;
/** "485.000,00" → 485000. Tolerates dirty text; empty or invalid → 0. */
export declare function parseValorBR(texto: string): number;
/** "500.000" → "500.000,00". Empty stays empty. */
export declare function normalizaValorBR(texto: string): string;
