import { redirect } from "next/navigation"

/**
 * O ETP passou a usar o editor genérico de documentos, como os demais tipos.
 * Esta rota permanece só para não quebrar links já existentes.
 */
export default async function EtpLegado({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  redirect(`/processos/${id}/documento/etp`)
}
