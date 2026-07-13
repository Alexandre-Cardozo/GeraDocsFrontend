"use client"

import { useParams, useRouter } from "next/navigation"
import { useRef, useState } from "react"

import { Button, ChoiceCard, FileUpload, FormField, InfoBanner, Input, ProgressBar, SectionBlock, Select, Textarea, ValidationMsg } from "@/components/ui"
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

const statusRail: Record<StatusDocumento, { dot: string; chip: string; fg: string }> = {
  "Completo": { dot: "var(--color-success)", chip: "var(--tint-success-bg)", fg: "var(--tint-success-fg)" },
  "Em andamento": { dot: "var(--status-waiting-dot)", chip: "var(--tint-royal-bg)", fg: "var(--color-royal-hover)" },
  "Em revisão": { dot: "var(--color-warning)", chip: "var(--tint-warning-chip-bg)", fg: "var(--tint-warning-fg)" },
  "Rejeitado": { dot: "var(--color-danger)", chip: "var(--tint-danger-bg)", fg: "var(--tint-danger-fg)" },
  "Não iniciado": { dot: "var(--color-text-muted)", chip: "var(--color-border-soft)", fg: "var(--color-slate-strong)" },
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
    salvar.mutate(
      { secaoId: active.id, conteudo: rascunho },
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
      <div className="gd-page">
        <div style={{ background: "var(--surface-card)", border: "var(--border-default)", borderRadius: "var(--radius-card)" }}>
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
    <div className="gd-split">
      {/* Rail de seções — 280px no laptop; faixa horizontal rolável no celular */}
      <div className="gd-etp-rail">
        <div style={{ paddingTop: 18, paddingInline: 18, paddingBottom: 14, borderBottom: "var(--border-soft)" }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--color-text-muted)" }}>{processo.data.id}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-body)", marginTop: 2, lineHeight: 1.3 }}>
              {processo.data.objeto}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 3 }}>{processo.data.secretaria}</div>
          </div>
          <ProgressBar
            percent={progress}
            label="Progresso do ETP"
            sub={`${completedCount} de ${lista.length} seções concluídas`}
          />
        </div>

        <div className="gd-etp-list">
          {lista.map((s) => {
            const cfg = statusRail[s.status]
            const isActive = activeSection === s.id
            return (
              <button
                key={s.id}
                type="button"
                className="gd-etp-item"
                onClick={() => trocarSecao(s.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: 10,
                  borderRadius: "var(--radius-md)",
                  border: isActive ? "var(--border-tint-royal)" : "var(--border-transparent)",
                  background: isActive ? "var(--tint-royal-bg)" : "transparent",
                  cursor: "pointer",
                  textAlign: "left",
                  marginBottom: 2,
                  transition: "all 0.1s",
                }}
              >
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "var(--radius-sm)",
                    background: cfg.chip,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    fontSize: 10,
                    fontWeight: 700,
                    color: cfg.fg,
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {s.status === "Completo" ? (
                    <span style={{ display: "flex", color: cfg.dot }}>
                      <IconCheck size={11} strokeWidth={3} />
                    </span>
                  ) : (
                    s.id
                  )}
                </span>
                <span style={{ flex: 1, minWidth: 0, display: "block" }}>
                  <span
                    style={{
                      display: "block",
                      fontSize: 12,
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? "var(--color-royal-hover)" : "var(--text-label)",
                      lineHeight: 1.3,
                    }}
                  >
                    {s.titulo}
                    {!s.obrigatoria && <span style={{ fontSize: 10, color: "var(--color-text-muted)", marginLeft: 5 }}>Opt.</span>}
                  </span>
                </span>
                <span style={{ width: 6, height: 6, borderRadius: "var(--radius-full)", background: cfg.dot, flexShrink: 0 }} />
              </button>
            )
          })}
        </div>
      </div>

      {/* Área do formulário */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--surface-app)" }}>
        {/* Toolbar */}
        <div
          style={{
            background: "var(--color-surface)",
            borderBottom: "var(--border-default)",
            paddingBlock: 14,
            paddingInline: 16,
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexShrink: 0,
            flexWrap: "wrap",
          }}
        >
          <div style={{ flexGrow: 1, flexShrink: 1, flexBasis: 220, minWidth: 0 }}>
            <div style={{ fontSize: 11, color: "var(--color-text-muted)", marginBottom: 2 }}>
              Seção {active?.id} de {lista.length} · {active?.incisoArt18}
            </div>
            <h2 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "var(--text-body)" }}>
              {active?.titulo}
            </h2>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
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
        <div className="gd-split-content" style={{ flex: 1, overflowY: "auto" }}>
          {active && (active.id === "4" || active.id === "5") ? (
            <EstimativasSecao rascunho={rascunho} setRascunho={setRascunho} />
          ) : active ? (
            <SectionBlock title={active.titulo} hint={active.hint}>
              {active.status === "Completo" && rascunho === active.conteudo && active.conteudo !== "" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div
                    style={{
                      background: "var(--tint-success-bg)",
                      border: "var(--border-tint-success)",
                      borderRadius: "var(--radius-xl)",
                      paddingBlock: 16,
                      paddingInline: 18,
                      display: "flex",
                      gap: 12,
                      alignItems: "flex-start",
                    }}
                  >
                    <span style={{ flexShrink: 0, marginTop: 1, display: "flex", color: "var(--color-success)" }}>
                      <IconCheckCircle size={18} strokeWidth={2.5} />
                    </span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--tint-success-fg)" }}>Seção Concluída</div>
                      <p style={{ margin: 0, marginTop: 4, fontSize: 13, color: "var(--tint-success-fg-soft)" }}>
                        Esta seção foi preenchida e validada. Edite o conteúdo abaixo para revisar.
                      </p>
                    </div>
                  </div>
                  <Textarea value={rascunho} onChange={(e) => setRascunho(e.target.value)} rows={6} />
                  <ValidationMsg type="ok" msg="Texto suficiente para fundamentar a seção." />
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <Textarea
                    value={rascunho}
                    onChange={(e) => setRascunho(e.target.value)}
                    rows={6}
                    placeholder="Preencha o conteúdo desta seção..."
                  />
                  {rascunho.trim() === "" ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                      <Button
                        variant="dark"
                        size="sm"
                        icon={<IconSparkles size={13} />}
                        disabled={gerar.isPending}
                        onClick={handleGerarIA}
                      >
                        {gerar.isPending ? "Gerando com IA..." : "Gerar com IA"}
                      </Button>
                      <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
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
            <div style={{ marginTop: 20 }}>
              <div
                className="gd-on-dark"
                style={{
                  background: "var(--gradient-panel)",
                  borderRadius: "var(--radius-card)",
                  paddingBlock: 18,
                  paddingInline: 20,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 16,
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    width: 36,
                    height: 36,
                    background: "var(--on-dark-electric-chip)",
                    borderRadius: "var(--radius-lg)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    color: "var(--color-electric)",
                  }}
                >
                  <IconFileText size={18} />
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--on-dark-text)", fontFamily: "var(--font-display)", marginBottom: 4 }}>
                    A solução proposta é Adesão de ATA?
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: "var(--on-dark-text-65)" }}>
                    Se o ETP concluir que a solução mais vantajosa é a Adesão de Ata de Registro de Preços, configure a ATA aqui para que o modelo possa validar ou encontrar opções adequadas.
                  </p>
                </div>
                <Button size="sm" onClick={() => setShowATAPanel(!showATAPanel)}>
                  {showATAPanel ? "Fechar" : "Configurar ATA"}
                </Button>
              </div>

              {showATAPanel && (
                <div
                  style={{
                    background: "var(--surface-card)",
                    border: "var(--border-default)",
                    borderRadius: "var(--radius-card)",
                    paddingBlock: 20,
                    paddingInline: 22,
                    marginTop: 10,
                  }}
                >
                  <h4 style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: "var(--text-body)", margin: 0, marginBottom: 4 }}>
                    Gestão da Ata de Registro de Preços
                  </h4>
                  <p style={{ margin: 0, marginBottom: 16, fontSize: 13, color: "var(--text-secondary)" }}>
                    Escolha como deseja proceder com a ATA para este processo.
                  </p>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
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
                    <div style={{ marginBottom: 16 }}>
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
                            <div style={{ marginTop: 10 }}>
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
                            <div style={{ marginTop: 10 }}>
                              <InlineSpinner label="Analisando ATA... aguarde." />
                            </div>
                          )}
                          {ataReview === "done" && (
                            <div
                              style={{
                                background: "var(--tint-success-bg)",
                                border: "var(--border-tint-success)",
                                borderRadius: "var(--radius-xl)",
                                paddingBlock: 14,
                                paddingInline: 16,
                                marginTop: 10,
                              }}
                            >
                              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                                <span style={{ display: "flex", color: "var(--color-success)" }}>
                                  <IconCheckCircle size={16} strokeWidth={2.5} />
                                </span>
                                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--tint-success-fg)" }}>
                                  Parecer da IA — ATA Válida
                                </span>
                              </div>
                              <p style={{ margin: 0, fontSize: 12, color: "var(--tint-success-fg-soft)", lineHeight: 1.6 }}>
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
                    <div style={{ marginTop: 14 }}>
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
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24, gap: 10, flexWrap: "wrap" }}>
            <Button
              variant="secondary"
              disabled={activeSection === "1"}
              onClick={() => {
                const idx = lista.findIndex((s) => s.id === activeSection)
                const anterior = lista[idx - 1]
                if (anterior) trocarSecao(anterior.id)
              }}
              style={{ opacity: activeSection === "1" ? 0.4 : 1 }}
            >
              ← Seção Anterior
            </Button>
            <div style={{ display: "flex", gap: 10 }}>
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
  const [qty, setQty] = useState("150")
  const [valorUnit, setValorUnit] = useState("3.233,33")

  // Total derivado dos campos ao lado (quantidade × valor unitário).
  const qtyNumero = Number.parseFloat(qty.replace(/\./g, "").replace(",", ".")) || 0
  const valorUnitNumero = Number.parseFloat(valorUnit.replace(/\./g, "").replace(",", ".")) || 0
  const valorTotal = qtyNumero * valorUnitNumero

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SectionBlock
        title="Estimativa das Quantidades"
        hint="Informe as quantidades estimadas com base no histórico de consumo, demanda projetada ou levantamentos realizados pela área técnica."
      >
        <div className="gd-form-grid-3">
          <FormField label="Quantidade Estimada" required>
            <Input value={qty} onChange={(e) => setQty(e.target.value)} />
          </FormField>
          <FormField label="Unidade de Medida" required>
            <Select defaultValue="Unidade">
              <option>Unidade</option>
              <option>Serviço</option>
              <option>Metro Quadrado</option>
              <option>Licença</option>
            </Select>
          </FormField>
          <FormField label="Período de Vigência" required>
            <Select defaultValue="12 meses">
              <option>12 meses</option>
              <option>24 meses</option>
              <option>36 meses</option>
              <option>48 meses</option>
              <option>60 meses</option>
            </Select>
          </FormField>
        </div>

        <div style={{ marginTop: 16 }}>
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
        <div className="gd-form-grid-2">
          <FormField label="Valor Unitário Estimado (R$)" required>
            <Input prefix="R$" value={valorUnit} onChange={(e) => setValorUnit(e.target.value)} />
          </FormField>
          <FormField label="Valor Total Estimado (R$)">
            <div
              style={{
                width: "100%",
                paddingBlock: 10,
                paddingInline: 13,
                border: "var(--border-default)",
                borderRadius: "var(--radius-md)",
                fontSize: 14,
                background: "var(--color-ice)",
                display: "flex",
                alignItems: "center",
                color: "var(--color-petroleum)",
                fontWeight: 700,
                fontFamily: "var(--font-mono)",
              }}
            >
              {formatBRL(valorTotal)}
            </div>
          </FormField>
        </div>
        <div style={{ marginTop: 16 }}>
          <FormField label="Fonte de Pesquisa de Preços" required>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                "Painel de Preços do Governo Federal (paineldeprecos.economia.gov.br)",
                "Contratos similares celebrados por outros entes",
                "Cotações com fornecedores",
              ].map((opt) => (
                <label key={opt} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 13, color: "var(--text-label)" }}>
                  <input
                    type="checkbox"
                    defaultChecked={opt.includes("Painel")}
                    style={{ width: 15, height: 15, accentColor: "var(--color-royal)" }}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </FormField>
        </div>
      </SectionBlock>
    </div>
  )
}
