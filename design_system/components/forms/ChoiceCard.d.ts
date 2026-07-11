/** Selectable option card used in wizards (modalidade, ATA modes, docs to generate). */
export interface ChoiceCardProps {
  selected?: boolean;
  onClick?: () => void;
  /** Monochrome line icon (20px SVG, stroke="currentColor") — rendered in royal. Emoji not allowed. */
  icon?: React.ReactNode;
  title: string;
  desc?: string;
  size?: "normal" | "small";
}
