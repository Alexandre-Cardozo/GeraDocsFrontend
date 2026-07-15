"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"

/**
 * O ETP passou a usar o editor genérico de documentos, como os demais tipos.
 * Esta rota permanece só para não quebrar links já existentes, redirecionando
 * para o editor de documento com o tipo `etp`.
 */
export default function RedirectEtp() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get("id") ?? ""

  useEffect(() => {
    router.replace(`/processos/documento?id=${encodeURIComponent(id)}&tipo=etp`)
  }, [id, router])

  return null
}
