/**
 * Action button.
 * @startingPoint section="Components" subtitle="Primary, secondary, dark, success and ghost buttons" viewport="700x260"
 */
export interface ButtonProps {
  /** Visual style. Default "primary" (royal #2563EB, hover #1D4ED8). */
  variant?: "primary" | "secondary" | "dark" | "success" | "ghost";
  /** md = 36px header control; lg = 14px text prominent CTA; sm = compact. */
  size?: "sm" | "md" | "lg";
  /** Optional leading icon (SVG element, stroke currentColor). */
  icon?: React.ReactNode;
  disabled?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}
