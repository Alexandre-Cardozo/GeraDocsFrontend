/** 60px white top bar with page title, ⌘K search, notification bell and optional primary CTA. */
export interface HeaderProps {
  title: string;
  /** Label for the primary CTA (e.g. "Novo Processo"); omit to hide. */
  cta?: string;
  onCta?: () => void;
  children?: React.ReactNode;
}
