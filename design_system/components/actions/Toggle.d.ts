/** Pill toggle switch (40×22) used for optional phases and settings. */
export interface ToggleProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  /** Track color when on. Default royal #2563EB; Retificação uses #7C3AED. */
  color?: string;
}
