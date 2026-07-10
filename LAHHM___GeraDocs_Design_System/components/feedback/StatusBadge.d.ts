/** Process status pill with colored dot (fixed vocabulary). */
export interface StatusBadgeProps {
  status: "rascunho" | "em_revisao" | "aguardando" | "aprovado" | "rejeitado" | "concluido";
  size?: "sm" | "md";
}
