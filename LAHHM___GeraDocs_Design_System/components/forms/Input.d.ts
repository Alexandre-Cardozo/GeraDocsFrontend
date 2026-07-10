/** Text input matching GeraDocs form styling (14px, 8px radius, #E2E8F0 border). */
export interface InputProps {
  /** Bold slate prefix rendered inside the field, e.g. "R$". */
  prefix?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: any) => void;
  style?: React.CSSProperties;
}
