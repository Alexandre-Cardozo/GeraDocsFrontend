/** Label + hint + required-asterisk wrapper around any form control. */
export interface FormFieldProps {
  label: string;
  required?: boolean;
  /** Guidance sentence rendered under the label — GeraDocs uses these heavily. */
  hint?: string;
  children?: React.ReactNode;
}
