/** Dashed drop-zone → file chip once selected (DFD, ATA, PCA uploads). */
export interface FileUploadProps {
  /** Selected file name; null renders the drop-zone. */
  file: string | null;
  onChange?: (fileName: string | null) => void;
  placeholder?: string;
  /** Comma-separated extensions, default ".pdf,.docx". */
  accept?: string;
}
