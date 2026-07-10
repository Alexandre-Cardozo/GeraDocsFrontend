/** Per-document state pill (ETP/TR table columns). */
export interface DocPillProps {
  /** One of the fixed doc states — Completo, Em andamento, Em revisão, Rejeitado, Não iniciado — or custom text with bg/color. */
  status: string;
  bg?: string;
  color?: string;
}
