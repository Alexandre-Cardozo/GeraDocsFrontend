/** Dashboard KPI card with icon chip, trend chip and 30px stat number. */
export interface StatCardProps {
  label: string;
  value: string;
  /** Trend chip text, e.g. "+3 este mês". */
  sub?: string;
  /** "up" renders green ↑ chip; "warn" renders amber ! chip. */
  trend?: "up" | "warn";
  icon?: React.ReactNode;
  /** Icon color / tint background. */
  color?: string;
  bg?: string;
}
