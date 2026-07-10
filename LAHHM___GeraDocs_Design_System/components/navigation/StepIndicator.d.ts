/** Numbered wizard step indicator (Novo Processo flow). */
export interface StepIndicatorProps {
  /** Step labels in order, e.g. ["Modalidade", "Identificação", "Documentos"]. */
  steps: string[];
  /** 1-based current step. */
  current: number;
}
