"use client"

import { useParams, useRouter } from "next/navigation"
import { useRef, useState } from "react"

import { Button, ChoiceCard, Dropdown, FileUpload, FormField, InfoBanner, Input, MoneyInput, ProgressBar, QuantityInput, SectionBlock, Textarea, ValidationMsg } from "@/components/ui"
import {
  IconCheck,
  IconCheckCircle,
  IconDownload,
  IconFileText,
  IconHelp,
  IconSave,
  IconSparkles,
} from "@/components/ui/icons"
import { ErrorState, InlineSpinner, LoadingState } from "@/components/shared/estados"
import { useToast } from "@/components/shared/providers"
import { useAtualizarSecaoETP, useGerarSecaoETP, useProcesso, useSecoesETP } from "@/lib/api/hooks"
import { formatBRL } from "@/lib/format"
import type { ModoATA, SecaoETP, StatusDocumento } from "@/lib/types"

/** Classes de cor do rail por status da seção. */
const statusRail: Record<StatusDocumento, { dot: string; chip: string }> = {
  "Completo": { dot: "bg-success", chip: "bg-tint-success-bg text-tint-success-fg" },
  "Em andamento": { dot: "bg-status-waiting-dot", chip: "bg-tint-royal-bg text-royal-hover" },
  "Em revisão": { dot: "bg-warning", chip: "bg-tint-warning-chip-bg text-tint-warning-fg" },
  "Rejeitado": { dot: "bg-danger", chip: "bg-tint-danger-bg text-tint-danger-fg" },
  "Não iniciado": { dot: "bg-text-muted", chip: "bg-border-soft text-slate-strong" },
}

const modosATA: Array<{ key: ModoATA; label: string; desc: string }> = [
  { key: "anexar", label: "Anexar ATA para revisão pela IA", desc: "Envie a ATA que deseja utilizar. A IA verificará validade, compatibilidade e emitirá parecer." },
  { key: "delegar", label: "Delegar ao modelo a busca de ATAs válidas", desc: "A IA buscará ATAs compatíveis com o objeto. Você visualizará as origens e selecionará a desejada." },
  { key: "combinado", label: "Anexar ATA e buscar outras opções", desc: "A IA revisará sua ATA e também sugerirá alternativas encontradas para comparação." },
]

export default function EditorETP() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const showToast = useToast()
  const processoId = params.id

  const processo = useProcesso(processoId)
  const secoes = useSecoesETP(processoId)
  const salvar = useAtualizarSecaoETP(processoId)
  const gerar = useGerarSecaoETP(processoId)

  const [activeSection, setActiveSection] = useState("1")
  const [rascunho, setRascunho] = useState("")
  const [saved, setSaved] = useState(false)
  // Espelho da seção ativa para callbacks assíncronos (evita closure stale).
  const secaoAtivaRef = useRef("1")
  const trocarSecao = (id: string) => {
    secaoAtivaRef.current = id
    setActiveSection(id)
  }

  // Painel de ATA (seção 6 — Soluções Disponíveis no Mercado)
  const [showATAPanel, setShowATAPanel] = useState(false)
  const [ataMode, setATAMode] = useState<ModoATA | "">("")
  const [ataFile, setATAFile] = useState<string | null>(null)
  const [ataReview, setATAReview] = useState<null | "loading" | "done">(null)

  const lista = secoes.data ?? []
  const active: SecaoETP | undefined = lista.find((s) => s.id === activeSection)

  // Ressincroniza o rascunho SÓ na troca de seção (padrão "adjusting state when
  // a prop changes"). Nunca por mudança de conteúdo vinda do servidor — o refetch
  // pós-salvamento não pode sobrescrever o que o usuário digitou nesse intervalo.
  const [secaoSincronizada, setSecaoSincronizada] = useState<string | null>(null)
  if (secoes.isSuccess && activeSection !== secaoSincronizada) {
    setSecaoSincronizada(activeSection)
    setRascunho(active?.conteudo ?? "")
  }

  const completedCount = lista.filter((s) => s.status === "Completo").length
  const progress = lista.length > 0 ? Math.round((completedCount / lista.length) * 100) : 0

  const handleSave = (avancar = false) => {
    if (!active) return
    // Ao avançar, a seção é dada como concluída mesmo sem conteúdo — preencher
    // todas as seções não é obrigatório; visitar e continuar já marca o check.
    salvar.mutate(
      { secaoId: active.id, conteudo: rascunho, ...(avancar ? { status: "Completo" as const } : {}) },
      {
        onSuccess: () => {
          setSaved(true)
          setTimeout(() => setSaved(false), 2500)
          if (avancar) {
            const idx = lista.findIndex((s) => s.id === activeSection)
            const proxima = lista[idx + 1]
            if (proxima) trocarSecao(proxima.id)
          }
        },
      }
    )
  }

  const handleGerarIA = () => {
    if (!active) return
    const secaoId = active.id
    gerar.mutate(secaoId, {
      onSuccess: (secaoGerada) => {
        // Preenche o editor com o texto gerado apenas se a seção ainda é a ativa —
        // se o usuário navegou durante a geração, não sobrescreve o rascunho da outra.
        if (secaoAtivaRef.current === secaoId) setRascunho(secaoGerada.conteudo)
      },
    })
  }

  if (processo.isPending || secoes.isPending) {
    return <LoadingState label="Carregando Estudo Técnico Preliminar..." />
  }
  if (processo.isError || secoes.isError) {
    return (
      <div className="p-4 sm:p-5 lg:p-7">
        <div className="rounded-card border border-border bg-surface">
          <ErrorState
            message={processo.error?.message ?? secoes.error?.message}
            onRetry={() => {
              void processo.refetch()
              void secoes.refetch()
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:h-full lg:flex-row lg:overflow-hidden">
      {/* Rail de seções — 280px no laptop; faixa horizontal rolável no celular */}
      <div className="flex w-full shrink-0 flex-col overflow-hidden border-b border-border bg-surface lg:w-70 lg:min-w-70 lg:border-r lg:border-b-0">
        <div className="border-b border-border-soft px-4.5 pt-4.5 pb-3.5">
          <div className="mb-3.5">
            <div className="font-mono text-xs text-text-muted">{processo.data.id}</div>
            <div className="mt-0.5 text-base leading-snug font-bold text-text-1">{processo.data.objeto}</div>
            <div className="mt-0.75 text-xs text-text-3">{processo.data.secretaria}</div>
          </div>
          <ProgressBar
            percent={progress}
            label="Progresso do ETP"
            sub={`${completedCount} de ${lista.length} seções concluídas`}
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto p-2.5 lg:block lg:flex-1 lg:overflow-x-hidden lg:overflow-y-auto">
          {lista.map((s) => {
            const cfg = statusRail[s.status]
            const isActive = activeSection === s.id
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => trocarSecao(s.id)}
                className={`mb-0.5 flex w-60 shrink-0 cursor-pointer items-center gap-2.5 rounded-md p-2.5 text-left transition-colors lg:w-full ${
                  isActive ? "border border-tint-royal-border bg-tint-royal-bg" : "border border-transparent bg-transparent"
                }`}
              >
                <span
                  className={`flex size-5.5 shrink-0 items-center justify-center rounded-sm font-mono text-2xs font-bold ${cfg.chip}`}
                >
                  {s.status === "Completo" ? (
                    <span className="flex text-success">
                      <IconCheck size={11} strokeWidth={3} />
                    </span>
                  ) : (
                    s.id
                  )}
                </span>
                <span className="block min-w-0 flex-1">
                  <span
                    className={`block text-sm leading-snug ${isActive ? "font-semibold text-royal-hover" : "font-medium text-text-2"}`}
                  >
                    {s.titulo}
                    {!s.obrigatoria && <span className="ml-1.25 text-2xs text-text-muted">Opt.</span>}
                  </span>
                </span>
                <span className={`size-1.5 shrink-0 rounded-full ${cfg.dot}`} />
              </button>
            )
          })}
        </div>
      </div>

      {/* Área do formulário */}
      <div className="flex flex-1 flex-col overflow-hidden bg-ice">
        {/* Toolbar */}
        <div className="flex shrink-0 flex-wrap items-center gap-3 border-b border-border bg-surface px-4 py-3.5">
          <div className="min-w-0 flex-[1_1_220px]">
            <div className="mb-0.5 text-xs text-text-muted">
              Seção {active?.id} de {lista.length} · {active?.incisoArt18}
            </div>
            <h2 className="m-0 font-display text-panel font-bold text-text-1">{active?.titulo}</h2>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={<IconHelp size={13} />}
              onClick={() => showToast(active?.hint ?? "Preencha a seção conforme as orientações metodológicas do ETP.")}
            >
              Orientações
            </Button>
            <Button
              variant={saved ? "success" : "primary"}
              size="sm"
              icon={saved ? <IconCheck size={13} strokeWidth={3} /> : <IconSave size={13} />}
              disabled={salvar.isPending}
              onClick={() => handleSave()}
            >
              {saved ? "Salvo!" : salvar.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {active && (active.id === "4" || active.id === "5") ? (
            <EstimativasSecao rascunho={rascunho} setRascunho={setRascunho} />
          ) : active ? (
            <SectionBlock title={active.titulo} hint={active.hint}>
              {active.status === "Completo" && rascunho === active.conteudo && active.conteudo !== "" ? (
                <div className="flex flex-col gap-3.5">
                  <div className="flex items-start gap-3 rounded-xl border border-tint-success-border bg-tint-success-bg px-4.5 py-4">
                    <span className="mt-px flex shrink-0 text-success">
                      <IconCheckCircle size={18} strokeWidth={2.5} />
                    </span>
                    <div>
                      <div className="text-md font-bold text-tint-success-fg">Seção Concluída</div>
                      <p className="m-0 mt-1 text-base text-tint-success-fg-soft">
                        Esta seção foi preenchida e validada. Edite o conteúdo abaixo para revisar.
                      </p>
                    </div>
                  </div>
                  <Textarea value={rascunho} onChange={(e) => setRascunho(e.target.value)} rows={6} />
                  <ValidationMsg type="ok" msg="Texto suficiente para fundamentar a seção." />
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Textarea
                    value={rascunho}
                    onChange={(e) => setRascunho(e.target.value)}
                    rows={6}
                    placeholder="Preencha o conteúdo desta seção..."
                  />
                  {rascunho.trim() === "" ? (
                    <div className="flex flex-wrap items-center gap-3">
                      <Button
                        variant="dark"
                        size="sm"
                        icon={<IconSparkles size={13} />}
                        disabled={gerar.isPending}
                        onClick={handleGerarIA}
                      >
                        {gerar.isPending ? "Gerando com IA..." : "Gerar com IA"}
                      </Button>
                      <span className="text-sm text-text-muted">
                        A IA redige a seção com base no DFD, no PCA e nos dados do processo.
                      </span>
                    </div>
                  ) : (
                    <ValidationMsg type="ok" msg="Texto suficiente para fundamentar a seção." />
                  )}
                  {gerar.isPending && <InlineSpinner label="Gerando conteúdo da seção... aguarde." />}
                </div>
              )}
            </SectionBlock>
          ) : null}

          {/* Banner de ATA — seção 6 (Soluções Disponíveis no Mercado) */}
          {activeSection === "6" && (
            <div className="mt-5">
              <div className="on-dark flex flex-wrap items-start gap-4 rounded-card px-5 py-4.5 gradient-panel">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-on-dark-electric-chip text-electric">
                  <IconFileText size={18} />
                </span>
                <div className="flex-1">
                  <div className="mb-1 font-display text-md font-bold text-on-dark">
                    A solução proposta é Adesão de ATA?
                  </div>
                  <p className="m-0 text-base text-on-dark-65">
                    Se o ETP concluir que a solução mais vantajosa é a Adesão de Ata de Registro de Preços, configure a ATA aqui para que o modelo possa validar ou encontrar opções adequadas.
                  </p>
                </div>
                <Button size="sm" onClick={() => setShowATAPanel(!showATAPanel)}>
                  {showATAPanel ? "Fechar" : "Configurar ATA"}
                </Button>
              </div>

              {showATAPanel && (
                <div className="mt-2.5 rounded-card border border-border bg-surface px-5.5 py-5">
                  <h4 className="m-0 mb-1 font-display text-md font-bold text-text-1">
                    Gestão da Ata de Registro de Preços
                  </h4>
                  <p className="m-0 mb-4 text-base text-text-3">Escolha como deseja proceder com a ATA para este processo.</p>

                  <div className="mb-4 flex flex-col gap-2">
                    {modosATA.map((opt) => (
                      <ChoiceCard
                        key={opt.key}
                        size="small"
                        selected={ataMode === opt.key}
                        onClick={() => setATAMode(opt.key)}
                        title={opt.label}
                        desc={opt.desc}
                      />
                    ))}
                  </div>

                  {(ataMode === "anexar" || ataMode === "combinado") && (
                    <div className="mb-4">
                      <FormField label="Anexar ATA" required>
                        <div>
                          <FileUpload
                            file={ataFile}
                            onChange={(f) => {
                              setATAFile(f)
                              if (f === null) setATAReview(null)
                            }}
                            placeholder="Clique para selecionar a ATA (PDF ou DOCX)"
                            accept=".pdf,.docx"
                          />
                          {ataFile && ataReview === null && (
                            <div className="mt-2.5">
                              <Button
                                size="sm"
                                onClick={() => {
                                  setATAReview("loading")
                                  setTimeout(() => setATAReview("done"), 2200)
                                }}
                              >
                                Enviar para revisão pela IA
                              </Button>
                            </div>
                          )}
                          {ataReview === "loading" && (
                            <div className="mt-2.5">
                              <InlineSpinner label="Analisando ATA... aguarde." />
                            </div>
                          )}
                          {ataReview === "done" && (
                            <div className="mt-2.5 rounded-xl border border-tint-success-border bg-tint-success-bg px-4 py-3.5">
                              <div className="mb-2 flex items-center gap-2">
                                <span className="flex text-success">
                                  <IconCheckCircle size={16} strokeWidth={2.5} />
                                </span>
                                <span className="text-base font-bold text-tint-success-fg">Parecer da IA — ATA Válida</span>
                              </div>
                              <p className="m-0 text-sm leading-[1.6] text-tint-success-fg-soft">
                                A ATA analisada está vigente, com objeto compatível ao ETP e dentro dos limites legais para adesão (Art. 86 da Lei 14.133/21). Prazo de vigência: 30/11/2025. Órgão gerenciador: Governo do Estado de São Paulo. Nenhuma irregularidade identificada.
                              </p>
                            </div>
                          )}
                        </div>
                      </FormField>
                    </div>
                  )}

                  {ataMode === "delegar" && (
                    <InfoBanner tone="info" icon={<IconCheck size={14} strokeWidth={2.5} />}>
                      O modelo realizará a busca de ATAs compatíveis após a confirmação. Os resultados — com origem, órgão gerenciador e validade — ficarão disponíveis neste processo para sua seleção.
                    </InfoBanner>
                  )}

                  {ataMode !== "" && (
                    <div className="mt-3.5">
                      <Button variant="dark" onClick={() => showToast("Configuração da ATA registrada no processo.")}>
                        Confirmar configuração da ATA
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Navegação entre seções */}
          <div className="mt-6 flex flex-wrap justify-between gap-2.5">
            <Button
              variant="secondary"
              disabled={activeSection === "1"}
              onClick={() => {
                const idx = lista.findIndex((s) => s.id === activeSection)
                const anterior = lista[idx - 1]
                if (anterior) trocarSecao(anterior.id)
              }}
              className={activeSection === "1" ? "opacity-40" : ""}
            >
              ← Seção Anterior
            </Button>
            <div className="flex gap-2.5">
              {activeSection === lista[lista.length - 1]?.id ? (
                <Button
                  variant="success"
                  icon={<IconDownload size={14} strokeWidth={2.5} />}
                  onClick={() => router.push("/documentos")}
                >
                  Finalizar e Gerar Documento
                </Button>
              ) : (
                <Button disabled={salvar.isPending} onClick={() => handleSave(true)}>
                  Salvar e Avançar →
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Seções 4 e 5 do protótipo — Estimativa das Quantidades e do Valor. */
function EstimativasSecao({
  rascunho,
  setRascunho,
}: {
  rascunho: string
  setRascunho: (v: string) => void
}) {
  const [qty, setQty] = useState("150,00")
  const [unidade, setUnidade] = useState("Unidade")
  const [vigencia, setVigencia] = useState("12 meses")
  const [valorUnit, setValorUnit] = useState("3.233,33")
  const [fontes, setFontes] = useState<Record<string, boolean>>({ painel: true, contratos: false, cotacoes: false, outro: false })
  const [outroTexto, setOutroTexto] = useState("")

  // Total derivado dos campos ao lado (quantidade × valor unitário).
  const qtyNumero = Number.parseFloat(qty.replace(/\./g, "").replace(",", ".")) || 0
  const valorUnitNumero = Number.parseFloat(valorUnit.replace(/\./g, "").replace(",", ".")) || 0
  const valorTotal = qtyNumero * valorUnitNumero

  const fontesOpcoes = [
    { key: "painel", label: "Painel de Preços do Governo Federal (gov.br/compras)" },
    { key: "contratos", label: "Contratos similares celebrados por outros entes" },
    { key: "cotacoes", label: "Cotações com fornecedores" },
    { key: "outro", label: "Outro" },
  ]

  return (
    <div className="flex flex-col gap-5">
      <SectionBlock
        title="Estimativa das Quantidades"
        hint="Informe as quantidades estimadas com base no histórico de consumo, demanda projetada ou levantamentos realizados pela área técnica."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FormField label="Quantidade Estimada" required>
            <QuantityInput value={qty} onChange={(e) => setQty(e.target.value)} />
          </FormField>
          <FormField label="Unidade de Medida" required>
            <Dropdown
              value={unidade}
              onChange={setUnidade}
              ariaLabel="Unidade de medida"
              options={["Unidade", "Serviço", "Metro Quadrado", "Licença"].map((o) => ({ value: o, label: o }))}
            />
          </FormField>
          <FormField label="Período de Vigência" required>
            <Dropdown
              value={vigencia}
              onChange={setVigencia}
              ariaLabel="Período de vigência"
              options={["12 meses", "24 meses", "36 meses", "48 meses", "60 meses"].map((o) => ({ value: o, label: o }))}
            />
          </FormField>
        </div>

        <div className="mt-4">
          <FormField label="Memória de Cálculo" hint="Descreva a metodologia utilizada para estimar as quantidades">
            <Textarea
              value={rascunho}
              onChange={(e) => setRascunho(e.target.value)}
              rows={4}
              placeholder="Ex: Quantidade estimada com base no levantamento realizado junto às 30 unidades escolares da rede municipal. Média de 5 equipamentos por unidade, considerando substituição de equipamentos com mais de 8 anos de uso..."
            />
          </FormField>
        </div>
      </SectionBlock>

      <SectionBlock
        title="Estimativa do Valor"
        hint="Baseie-se em pesquisas de mercado, contratos anteriores ou painel de preços do governo federal."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Valor Unitário Estimado" required>
            <MoneyInput value={valorUnit} onChange={(e) => setValorUnit(e.target.value)} />
          </FormField>
          <FormField label="Valor Total Estimado">
            <div className="flex w-full items-center rounded-md border border-border bg-ice px-3.25 py-2.5 font-mono text-md font-bold text-petroleum">
              {formatBRL(valorTotal)}
            </div>
          </FormField>
        </div>
        <div className="mt-4">
          <FormField label="Fonte de Pesquisa de Preços" required>
            <div className="flex flex-col gap-2">
              {fontesOpcoes.map((opt) => (
                <label key={opt.key} className="flex cursor-pointer items-center gap-2.5 text-base text-text-2">
                  <input
                    type="checkbox"
                    checked={fontes[opt.key] ?? false}
                    onChange={(e) => setFontes((f) => ({ ...f, [opt.key]: e.target.checked }))}
                    className="size-3.75 accent-royal"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
            {fontes.outro && (
              <div className="mt-2.5">
                <Input
                  value={outroTexto}
                  onChange={(e) => setOutroTexto(e.target.value)}
                  placeholder="Informe qual foi o meio utilizado na pesquisa de preços"
                />
              </div>
            )}
          </FormField>
        </div>
      </SectionBlock>
    </div>
  )
}
