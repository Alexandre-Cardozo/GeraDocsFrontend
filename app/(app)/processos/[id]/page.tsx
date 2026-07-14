"use client"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"

import { Button, Dropdown, FileUpload, InfoBanner, ProgressBar, StatusBadge, Tag, Textarea } from "@/components/ui"
import {
  IconArrowRight,
  IconCheckCircle,
  IconEye,
  IconFile,
  IconFileText,
  IconPlus,
} from "@/components/ui/icons"
import { ErrorState, LoadingState } from "@/components/shared/estados"
import { useToast } from "@/components/shared/providers"
import {
  useAtualizarProcesso,
  useConfigTenant,
  useDocumentos,
  useGerarDocumento,
  useParecerDFD,
  useProcesso,
  useSecoes,
} from "@/lib/api/hooks"
import { formatBRL, formatData } from "@/lib/format"
import type { TipoDocumento } from "@/lib/types"

const TIPOS: TipoDocumento[] = ["ETP", "TR", "Cotação", "Mapa"]

/** Slug de URL do editor de seções por tipo (ETP tem editor próprio e rico). */
const SLUG: Record<TipoDocumento, string> = { ETP: "etp", TR: "tr", "Cotação": "cotacao", Mapa: "mapa" }

/** Metadados de apresentação por tipo (cores do DS + rótulo completo). */
const META_DOC: Record<TipoDocumento, { titulo: string; chip: string }> = {
  ETP: { titulo: "Estudo Técnico Preliminar", chip: "bg-doc-etp-bg text-doc-etp" },
  TR: { titulo: "Termo de Referência", chip: "bg-doc-tr-bg text-doc-tr" },
  "Cotação": { titulo: "Cotação de Mercado", chip: "bg-doc-cotacao-bg text-doc-cotacao" },
  Mapa: { titulo: "Mapa de Riscos", chip: "bg-doc-mapa-bg text-doc-mapa" },
}

export default function HubProcesso() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const showToast = useToast()
  const processoId = params.id

  const processo = useProcesso(processoId)
  const documentos = useDocumentos()
  const parecer = useParecerDFD(processoId)
  const { data: tenant } = useConfigTenant()
  const atualizar = useAtualizarProcesso()
  const gerar = useGerarDocumento()

  // Seções de cada tipo (ordem fixa — respeita as regras dos hooks) para o progresso dos cards.
  const secoesPorTipo: Record<TipoDocumento, ReturnType<typeof useSecoes>> = {
    ETP: useSecoes(processoId, "ETP"),
    TR: useSecoes(processoId, "TR"),
    "Cotação": useSecoes(processoId, "Cotação"),
    Mapa: useSecoes(processoId, "Mapa"),
  }

  const [editando, setEditando] = useState(false)
  const [objeto, setObjeto] = useState("")
  const [objetoDemanda, setObjetoDemanda] = useState("")
  const [secretaria, setSecretaria] = useState("")
  const [dfd, setDfd] = useState<string | null>(null)

  const abrirEdicao = () => {
    if (!processo.data) return
    setObjeto(processo.data.objeto)
    setObjetoDemanda(processo.data.objetoDemanda ?? "")
    setSecretaria(processo.data.secretaria)
    setDfd(processo.data.dfdArquivo ?? null)
    setEditando(true)
  }

  const salvarEdicao = () => {
    atualizar.mutate(
      {
        id: processoId,
        objeto: objeto.trim() || undefined,
        objetoDemanda: objetoDemanda.trim(),
        secretaria,
        dfdArquivo: dfd,
      },
      {
        onSuccess: () => {
          setEditando(false)
          showToast("Dados do processo atualizados.")
        },
      }
    )
  }

  if (processo.isPending) return <LoadingState label="Carregando processo..." />
  if (processo.isError || !processo.data) {
    return (
      <div className="p-4 sm:p-5 lg:p-7">
        <div className="rounded-card border border-border bg-surface">
          <ErrorState message={processo.error?.message} onRetry={() => void processo.refetch()} />
        </div>
      </div>
    )
  }

  const proc = processo.data
  const docsGerados = (documentos.data ?? []).filter((d) => d.processoId === processoId)

  const adicionarDocumento = (tipo: TipoDocumento) => {
    atualizar.mutate(
      { id: processoId, documentos: [...proc.documentos, tipo] },
      { onSuccess: () => showToast(`${tipo} adicionado ao processo.`) }
    )
  }

  const gerarDireto = (tipo: TipoDocumento) => {
    gerar.mutate(
      { processoId, tipo },
      { onSuccess: () => showToast(`${tipo} gerado e disponível em Documentos.`) }
    )
  }

  const tiposDisponiveis = TIPOS.filter((t) => !proc.documentos.includes(t))
  const dfdVerificado = parecer.data != null

  return (
    <div className="max-w-content p-4 sm:p-5 lg:p-7">
      <Link href="/processos" className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-text-3 no-underline">
        <span className="rotate-180">
          <IconArrowRight size={13} strokeWidth={2.5} />
        </span>
        Voltar aos Processos
      </Link>

      {/* Cabeçalho do processo */}
      <div className="mb-6 rounded-card border border-border bg-surface p-5 lg:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-xs text-text-muted">{proc.id}</span>
              <StatusBadge status={proc.status} size="sm" />
              <Tag tone="info">{proc.modalidade}</Tag>
            </div>
            {!editando ? (
              <h1 className="mt-2 mb-0 font-display text-2xl font-extrabold tracking-tight text-text-1">{proc.objeto}</h1>
            ) : (
              <div className="mt-3 max-w-xl">
                <label className="mb-1 block text-sm font-semibold text-text-2">Descrição do Processo</label>
                <p className="mb-1.5 text-xs text-text-muted">Nomenclatura que identifica o processo no painel e nas listagens.</p>
                <Textarea value={objeto} onChange={(e) => setObjeto(e.target.value)} rows={2} />
              </div>
            )}
          </div>
          {!editando ? (
            <Button variant="secondary" size="sm" icon={<IconFile size={13} />} onClick={abrirEdicao}>
              Editar Dados
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => setEditando(false)}>
                Cancelar
              </Button>
              <Button size="sm" disabled={atualizar.isPending} onClick={salvarEdicao}>
                {atualizar.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          )}
        </div>

        <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-2xs font-semibold tracking-caps text-text-muted uppercase">Secretaria</dt>
            {!editando ? (
              <dd className="m-0 mt-0.5 text-base text-text-1">{proc.secretaria}</dd>
            ) : (
              <dd className="m-0 mt-1">
                <Dropdown
                  value={secretaria}
                  onChange={setSecretaria}
                  ariaLabel="Secretaria requisitante"
                  options={(tenant?.secretarias ?? []).map((s) => ({ value: s.nome, label: s.nome }))}
                />
              </dd>
            )}
          </div>
          <div>
            <dt className="text-2xs font-semibold tracking-caps text-text-muted uppercase">Valor Estimado</dt>
            <dd className="m-0 mt-0.5 font-mono text-base font-semibold text-petroleum">{formatBRL(proc.valorEstimado)}</dd>
          </div>
          <div>
            <dt className="text-2xs font-semibold tracking-caps text-text-muted uppercase">Responsável</dt>
            <dd className="m-0 mt-0.5 text-base text-text-1">{proc.responsavel}</dd>
          </div>
          <div>
            <dt className="text-2xs font-semibold tracking-caps text-text-muted uppercase">Atualizado em</dt>
            <dd className="m-0 mt-0.5 text-base text-text-1">{formatData(proc.atualizadoEm)}</dd>
          </div>

          {/* Objeto da Demanda — trabalha junto com o DFD, alimenta o ETP */}
          <div className="sm:col-span-2 lg:col-span-4">
            <dt className="text-2xs font-semibold tracking-caps text-text-muted uppercase">Objeto da Demanda</dt>
            {!editando ? (
              <dd className="m-0 mt-0.5 text-base text-text-1">
                {proc.objetoDemanda ? proc.objetoDemanda : <span className="text-text-faint">Não informado</span>}
              </dd>
            ) : (
              <dd className="m-0 mt-1.5 max-w-2xl">
                <p className="mb-1.5 text-xs text-text-muted">Objeto da contratação em si — trabalha junto com o DFD e alimenta as seções do ETP.</p>
                <Textarea
                  value={objetoDemanda}
                  onChange={(e) => setObjetoDemanda(e.target.value)}
                  rows={3}
                  placeholder="Ex: Aquisição de 150 microcomputadores tipo desktop e periféricos para os laboratórios..."
                />
              </dd>
            )}
          </div>

          <div className="sm:col-span-2 lg:col-span-4">
            <dt className="text-2xs font-semibold tracking-caps text-text-muted uppercase">
              Documento de Formalização de Demanda (DFD)
            </dt>
            {!editando ? (
              <dd className="m-0 mt-0.5 text-base text-text-1">
                {proc.dfdArquivo ? <span className="font-mono text-sm">{proc.dfdArquivo}</span> : <span className="text-text-faint">Não anexado</span>}
              </dd>
            ) : (
              <dd className="m-0 mt-1.5 max-w-xl">
                <FileUpload file={dfd} onChange={setDfd} placeholder="Anexar ou substituir o DFD (PDF ou DOCX)" accept=".pdf,.docx,.doc" />
              </dd>
            )}
          </div>
        </dl>
      </div>

      {/* Fase de verificação do DFD (quando configurada) */}
      {proc.fases.verificacaoDFD && (
        <button
          type="button"
          onClick={() => router.push(`/processos/${processoId}/dfd`)}
          className="mb-4 flex w-full items-center gap-4 rounded-card border border-border bg-surface px-5 py-4 text-left transition-colors hover:bg-ice"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-tint-royal-bg text-royal">
            <IconFileText size={18} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-display text-md font-bold text-text-1">Verificação do DFD pela IA</span>
            <span className="block text-sm text-text-3">
              {dfdVerificado ? "Parecer emitido — clique para revisar os achados." : "Fase opcional — analise o DFD antes de elaborar o ETP."}
            </span>
          </span>
          {dfdVerificado ? <Tag tone="success">Concluída</Tag> : <Tag tone="info">Disponível</Tag>}
          <span className="flex text-text-muted">
            <IconArrowRight size={16} strokeWidth={2.5} />
          </span>
        </button>
      )}

      {/* Documentos do processo */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="m-0 font-display text-lg font-bold text-text-1">Documentos do Processo</h2>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {proc.documentos.map((tipo) => {
          const meta = META_DOC[tipo]
          const gerado = docsGerados.find((d) => d.tipo === tipo)
          const finalizado = gerado != null
          const secoesLista = secoesPorTipo[tipo].data ?? []
          const concluidas = secoesLista.filter((s) => s.status === "Completo").length
          const total = secoesLista.length
          const progresso = finalizado ? 100 : total > 0 ? Math.round((concluidas / total) * 100) : 0
          const completo = total > 0 && concluidas === total
          const editorHref = `/processos/${processoId}/${tipo === "ETP" ? "etp" : `documento/${SLUG[tipo]}`}`

          return (
            <div key={tipo} className="flex flex-col rounded-card border border-border bg-surface p-5">
              <div className="mb-3 flex items-start gap-3">
                <span className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${meta.chip}`}>
                  <IconFileText size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-display text-md font-bold text-text-1">{meta.titulo}</div>
                  <div className="mt-0.5 font-mono text-xs text-text-muted">{tipo}</div>
                </div>
                {finalizado ? (
                  <span className="flex items-center gap-1 text-sm font-semibold text-success">
                    <IconCheckCircle size={15} strokeWidth={2.5} />
                    Finalizado
                  </span>
                ) : (
                  <span className="text-sm font-semibold text-text-3">{progresso}%</span>
                )}
              </div>

              <ProgressBar percent={progresso} />

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {finalizado ? (
                  <>
                    <Button size="sm" variant="secondary" icon={<IconEye size={13} />} onClick={() => router.push("/documentos")}>
                      Visualizar Documento
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => router.push(editorHref)}>
                      Revisar Seções
                    </Button>
                  </>
                ) : completo ? (
                  <>
                    <Button size="sm" disabled={gerar.isPending} onClick={() => gerarDireto(tipo)}>
                      {gerar.isPending ? "Gerando..." : "Gerar Documento"}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => router.push(editorHref)}>
                      Revisar Seções
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    icon={<IconArrowRight size={13} strokeWidth={2.5} />}
                    onClick={() => router.push(editorHref)}
                  >
                    {progresso > 0 ? `Continuar ${tipo}` : `Elaborar ${tipo}`}
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Adicionar novos documentos */}
      {tiposDisponiveis.length > 0 && (
        <div className="mt-4 rounded-card border border-dashed border-border bg-surface px-5 py-4">
          <div className="mb-2.5 text-sm font-semibold text-text-2">Adicionar documento ao processo</div>
          <div className="flex flex-wrap gap-2">
            {tiposDisponiveis.map((tipo) => (
              <button
                key={tipo}
                type="button"
                disabled={atualizar.isPending}
                onClick={() => adicionarDocumento(tipo)}
                className="flex items-center gap-1.5 rounded-md border border-border bg-ice px-3 py-1.75 text-sm font-semibold text-text-2 transition-colors hover:bg-surface disabled:opacity-50"
              >
                <IconPlus size={13} strokeWidth={2.5} />
                {META_DOC[tipo].titulo}
              </button>
            ))}
          </div>
        </div>
      )}

      {proc.documentos.length === 0 && (
        <InfoBanner tone="info" className="mt-4">
          Nenhum documento solicitado para este processo. Adicione um documento acima para começar.
        </InfoBanner>
      )}
    </div>
  )
}
