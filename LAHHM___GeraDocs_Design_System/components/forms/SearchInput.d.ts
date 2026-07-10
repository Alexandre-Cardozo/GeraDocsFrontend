/** 36px bordered search field with magnifier icon and optional kbd chip. */
export interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: any) => void;
  /** Keyboard chip text, e.g. "⌘K" (header search only). */
  kbd?: string;
  width?: number | string;
  background?: string;
}
