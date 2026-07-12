"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import {
  Button,
  ChoiceCard,
  FileUpload,
  FormField,
  InfoBanner,
  Input,
  Select,
  StepIndicator,
  Tag,
  Textarea,
  Toggle,
  ValidationMsg,
} from "@/components/ds"
import { IconBuilding, IconCart, IconCheck, IconClipboard, IconFile, IconLock, IconZap } from "@/components/ds/icons"
import { useConfigTenant, useCriarProcesso, useProximoNumeroProcesso } from "@/lib/api/hooks"
import type { Modalidade, ModoATA } from "@/lib/types"

const modalidades: Array<{ key: string; valor: Modalidade; label: string; desc: string; icon: React.ReactNode }> = [
  { key: "pregao", valor: "Pregão Eletrônico", label: "Pregão Eletrônico", desc: "Para aquisição de bens e serviços comuns", icon: <IconCart size={22} /> },
  { key: "concorrencia", valor: "Concorrência", label: "Concorrência", desc: "Para obras, serviços e compras de grande vulto", icon: <IconBuilding size={22} /> },
  { key: "dispensa", valor: "Dispensa Art. 75", label: "Dispensa de Licitação", desc: "Casos previstos no Art. 75 da Lei 14.133/21", icon: <IconZap size={22} /> },
  { key: "inexigibilidade", valor: "Inexigibilidade", label: "Inexigibilidade", desc: "Quando a competição é inviável", icon: <IconLock size={22} /> },
  { key: "credenciamento", valor: "Credenciamento", label: "Credenciamento", desc: "Para seleção de prestadores de serviços", icon: <IconClipboard size={22} /> },
]

const modosATA: Array<{ key: ModoATA; label: string; desc: string }> = [
  { key: "anexar", label: "Anexar ATA para revisão pela IA", desc: "A plataforma analisará a ATA enviada e verificará sua compatibilidade com o objeto." },
  { key: "delegar", label: "Delegar ao modelo a busca de ATAs válidas", desc: "A IA buscará ATAs compatíveis; você poderá visualizar as origens e selecionar." },
  { key: "combinado", label: "Anexar ATA e também buscar outras opções", desc: "A IA revisa sua ATA e ainda sugere alternativas encontradas." },
]

const documentosGeraveis = [
  { key: "etp", titulo: "Estudo Técnico Preliminar (ETP)", desc: "Fundamenta a necessidade e os requisitos técnicos da contratação", obrig: true, secoes: 12, color: "var(--doc-etp)", bg: "var(--doc-etp-bg)" },
  { key: "tr", titulo: "Termo de Referência (TR)", desc: "Define as condições para execução do objeto da licitação", obrig: true, secoes: 15, color: "var(--doc-tr)", bg: "var(--doc-tr-bg)" },
  { key: "cotacao", titulo: "Cotação de Mercado", desc: "Pesquisa de preços com fornecedores para embasar a estimativa de valor", obrig: false, secoes: 4, color: "var(--doc-cotacao)", bg: "var(--doc-cotacao-bg)" },
  { key: "mapa", titulo: "Mapa de Riscos", desc: "Avaliação e classificação dos riscos envolvidos na contratação", obrig: false, secoes: 5, color: "var(--doc-mapa)", bg: "var(--doc-mapa-bg)" },
] as const

const headingStyle = {
  fontFamily: "var(--font-display)",
  fontSize: "var(--text-2xl)",
  fontWeight: 800,
  color: "var(--text-body)",
  margin: 0,
  marginBottom: 6,
  letterSpacing: "var(--tracking-tight)",
} as const

const subtextStyle = { margin: 0, marginBottom: 24, fontSize: 14, color: "var(--text-secondary)" } as const
const labelStyle = { fontSize: 13, fontWeight: 600, color: "var(--text-label)" } as const

export default function NovoProcesso() {
  const router = useRouter()
  const { data: tenant } = useConfigTenant()
  const { data: proximoNumero } = useProximoNumeroProcesso()
  const criarProcesso = useCriarProcesso()

  const [step, setStep] = useState(1)

  // Passo 1 — modalidade e opções de ATA
  const [modalidade, setModalidade] = useState("")
  const [isAdesaoATA, setIsAdesaoATA] = useState(false)
  const [ataMode, setATAMode] = useState<ModoATA | "">("")
  const [ataFile, setATAFile] = useState<string | null>(null)
  const [ataMotivo, setATAMotivo] = useState("")

  // Passo 2 — identificação
  const [secretaria, setSecretaria] = useState("")
  const [objeto, setObjeto] = useState("")
  const [dfdFile, setDFDFile] = useState<string | null>(null)
  const [valorRef, setValorRef] = useState("")
  const [fundamento, setFundamento] = useState("")

  // Passo 3 — documentos e fases
  const [docsSelected, setDocsSelected] = useState<Record<string, boolean>>({ etp: true, tr: true, cotacao: false, mapa: false })
  const [includeDFDVerification, setIncludeDFDVerification] = useState(false)
  const [includeRetificacao, setIncludeRetificacao] = useState(false)

  const toggleDoc = (key: string) => {
    if (key === "etp" || key === "tr") return
    setDocsSelected((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const dfdOrObjeto = dfdFile !== null || objeto.trim() !== ""

  const canProceed =
    (step === 1 && modalidade !== "" && (!isAdesaoATA || (ataMode !== "" && ataMotivo.trim() !== ""))) ||
    (step === 2 && secretaria !== "" && dfdOrObjeto) ||
    step === 3

  const numeroProcesso = proximoNumero ?? "PROC-2024-090"

  const handleCreate = () => {
    const modalidadeSelecionada = modalidades.find((m) => m.key === modalidade)
    if (!modalidadeSelecionada) return
    const valorNumerico = Number.parseFloat(valorRef.replace(/[^\d,]/g, "").replace(",", ".")) || 0
    criarProcesso.mutate(
      {
        objeto: objeto.trim(),
        modalidade: modalidadeSelecionada.valor,
        secretaria,
        valorEstimado: valorNumerico,
        fundamentoLegal: fundamento.trim() || undefined,
        dfdArquivo: dfdFile,
        ata: isAdesaoATA && ataMode !== "" ? { modo: ataMode, motivo: ataMotivo.trim(), arquivo: ataFile } : null,
        documentos: [
          ...(docsSelected.etp ? (["ETP"] as const) : []),
          ...(docsSelected.tr ? (["TR"] as const) : []),
          ...(docsSelected.cotacao ? (["Cotação"] as const) : []),
          ...(docsSelected.mapa ? (["Mapa"] as const) : []),
        ],
        fases: { verificacaoDFD: includeDFDVerification, retificacao: includeRetificacao },
      },
      {
        onSuccess: (processo) => {
          router.push(includeDFDVerification ? `/processos/${processo.id}/dfd` : `/processos/${processo.id}/etp`)
        },
      }
    )
  }

  return (
    <div className="gd-page" style={{ maxWidth: "var(--content-max-wizard)" }}>
      <div style={{ marginBottom: 32 }}>
        <StepIndicator steps={["Modalidade", "Identificação", "Documentos"]} current={step} />
      </div>

      {/* ── Passo 1 ── */}
      {step === 1 && (
        <div>
          <h2 style={headingStyle}>Selecione a Modalidade</h2>
          <p style={subtextStyle}>Escolha a modalidade de licitação de acordo com o objeto e os valores estimados.</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
            {modalidades.map((m) => (
              <ChoiceCard
                key={m.key}
                selected={modalidade === m.key}
                onClick={() => setModalidade(m.key)}
                icon={m.icon}
                title={m.label}
                desc={m.desc}
              />
            ))}
          </div>

          {/* Adesão de ATA antecipada */}
          <div style={{ background: "var(--surface-card)", border: "var(--border-default)", borderRadius: "var(--radius-card)", paddingBlock: 18, paddingInline: 20 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{ paddingTop: 2 }}>
                <Toggle checked={isAdesaoATA} onChange={setIsAdesaoATA} label="Processo como Adesão de ATA" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-body)", fontFamily: "var(--font-display)" }}>
                  Este processo será instaurado como Adesão de Ata de Registro de Preços
                </div>
                <p style={{ margin: 0, marginTop: 4, fontSize: 13, color: "var(--text-secondary)" }}>
                  Ative caso a solução já seja previamente definida como Adesão de ATA. O modelo será orientado a gerar o ETP com essa conclusão.
                </p>
              </div>
            </div>

            {isAdesaoATA && (
              <div style={{ marginTop: 18, borderTop: "var(--border-soft)", paddingTop: 18, display: "flex", flexDirection: "column", gap: 16 }}>
                <FormField label="Motivo da decisão prévia pela Adesão de ATA" required hint="Justifique por que a Adesão de ATA já foi definida antes do ETP">
                  <Textarea
                    value={ataMotivo}
                    onChange={(e) => setATAMotivo(e.target.value)}
                    rows={3}
                    placeholder="Ex: Existe ATA vigente do PNCP com objeto compatível e condições vantajosas devidamente comprovadas..."
                  />
                </FormField>

                <div>
                  <span style={labelStyle}>Gestão da ATA</span>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
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
                </div>

                {(ataMode === "anexar" || ataMode === "combinado") && (
                  <FormField label="Anexar ATA" hint="Formatos aceitos: PDF, DOCX">
                    <FileUpload
                      file={ataFile}
                      onChange={setATAFile}
                      placeholder="Clique para selecionar a ATA ou arraste o arquivo"
                      accept=".pdf,.docx"
                    />
                  </FormField>
                )}

                {ataMode === "delegar" && (
                  <InfoBanner tone="info">
                    O modelo realizará a busca de ATAs após o processo ser criado. Os resultados ficarão disponíveis na aba de Processos para sua análise e seleção.
                  </InfoBanner>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Passo 2 ── */}
      {step === 2 && (
        <div>
          <h2 style={headingStyle}>Identificação do Processo</h2>
          <p style={subtextStyle}>Informe os dados básicos. É obrigatório preencher ao menos o DFD ou o Objeto da Contratação.</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <FormField label="Secretaria Requisitante" required>
              <Select value={secretaria} onChange={(e) => setSecretaria(e.target.value)}>
                <option value="">Selecione a secretaria...</option>
                {(tenant?.secretarias ?? []).map((s) => (
                  <option key={s.id} value={s.nome}>
                    {s.nome}
                  </option>
                ))}
              </Select>
            </FormField>

            {/* Upload do DFD */}
            <div style={{ background: "var(--surface-card)", border: "var(--border-default)", borderRadius: "var(--radius-card)", paddingBlock: 18, paddingInline: 20 }}>
              <div style={{ marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-label)", display: "inline-flex", alignItems: "center", gap: 8 }}>
                  Documento de Formalização de Demanda (DFD)
                  <Tag tone="warning">Recomendado</Tag>
                </span>
                <p style={{ margin: 0, marginTop: 4, fontSize: 12, color: "var(--text-secondary)" }}>
                  O DFD alimentará automaticamente as seções do ETP. Caso não possua, preencha o campo Objeto abaixo.
                </p>
              </div>
              <FileUpload
                file={dfdFile}
                onChange={setDFDFile}
                placeholder="Clique para selecionar o DFD ou arraste o arquivo aqui"
                accept=".pdf,.docx,.doc"
              />
              {dfdFile && (
                <InfoBanner tone="success" icon={<IconCheck size={14} strokeWidth={2.5} />} style={{ marginTop: 10 }}>
                  DFD anexado — o ETP será gerado com base neste documento.
                </InfoBanner>
              )}
            </div>

            <FormField
              label="Objeto da Contratação"
              required={!dfdFile}
              hint={dfdFile ? "Opcional quando o DFD é inserido — use como complemento ou detalhamento" : "Obrigatório quando o DFD não é inserido"}
            >
              <Textarea
                value={objeto}
                onChange={(e) => setObjeto(e.target.value)}
                placeholder="Ex: Aquisição de equipamentos de informática para as unidades escolares da rede municipal..."
                rows={3}
              />
            </FormField>

            {!dfdOrObjeto && <ValidationMsg type="error" msg="Preencha ao menos o DFD ou o Objeto da Contratação para continuar." />}

            <div className="gd-form-grid-2">
              <FormField label="Valor de Referência Estimado">
                <Input value={valorRef} onChange={(e) => setValorRef(e.target.value)} placeholder="R$ 0,00" />
              </FormField>
              <FormField label="Fundamento Legal">
                <Input value={fundamento} onChange={(e) => setFundamento(e.target.value)} placeholder="Ex: Art. 75, II, Lei 14.133/21" />
              </FormField>
            </div>
          </div>
        </div>
      )}

      {/* ── Passo 3 ── */}
      {step === 3 && (
        <div>
          <h2 style={headingStyle}>Configurar Processo</h2>
          <p style={subtextStyle}>Selecione os documentos a gerar e configure as fases opcionais do processo.</p>

          <div style={{ marginBottom: 24 }}>
            <span style={{ ...labelStyle, display: "block", marginBottom: 12 }}>Documentos a Gerar</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {documentosGeraveis.map((d) => {
                const selected = docsSelected[d.key] === true
                return (
                  <button
                    key={d.key}
                    type="button"
                    onClick={() => toggleDoc(d.key)}
                    aria-pressed={selected}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 16,
                      paddingBlock: 16,
                      paddingInline: 18,
                      borderRadius: "var(--radius-card)",
                      border: selected ? `2px solid ${d.color}` : "var(--border-default)",
                      background: selected ? d.bg : "var(--color-surface)",
                      cursor: d.obrig ? "default" : "pointer",
                      textAlign: "left",
                      transition: "var(--transition-fast)",
                      width: "100%",
                    }}
                  >
                    <span
                      style={{
                        width: 38,
                        height: 38,
                        background: selected ? d.bg : "var(--color-ice)",
                        borderRadius: "var(--radius-lg)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: 2,
                        border: selected ? `1px solid ${d.color}` : "var(--border-default)",
                        color: selected ? d.color : "var(--color-text-muted)",
                      }}
                    >
                      <IconFile size={17} />
                    </span>
                    <span style={{ flex: 1, display: "block" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-body)", fontFamily: "var(--font-display)" }}>
                          {d.titulo}
                        </span>
                        {d.obrig && <Tag tone="success">Obrigatório</Tag>}
                      </span>
                      <span style={{ display: "block", marginTop: 4, fontSize: 13, color: "var(--text-secondary)" }}>{d.desc}</span>
                      <span style={{ display: "block", marginTop: 5, fontSize: 11, color: "var(--color-text-muted)" }}>{d.secoes} seções</span>
                    </span>
                    <span
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: "var(--radius-sm)",
                        border: `2px solid ${selected ? d.color : "var(--color-border)"}`,
                        background: selected ? d.color : "var(--color-ice)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: 8,
                        transition: "var(--transition-fast)",
                        color: "var(--color-surface)",
                      }}
                    >
                      {selected && <IconCheck size={11} strokeWidth={3.5} />}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Fases opcionais */}
          <div style={{ marginBottom: 20 }}>
            <span style={{ ...labelStyle, display: "block", marginBottom: 12 }}>Fases Opcionais do Processo</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div
                style={{
                  background: "var(--surface-card)",
                  border: includeDFDVerification ? "var(--border-royal)" : "var(--border-default)",
                  borderRadius: "var(--radius-card)",
                  paddingBlock: 16,
                  paddingInline: 18,
                  transition: "border 0.15s",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ paddingTop: 2 }}>
                    <Toggle checked={includeDFDVerification} onChange={setIncludeDFDVerification} label="Verificação do DFD pela IA" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-body)", fontFamily: "var(--font-display)" }}>
                        Verificação do DFD pela IA
                      </span>
                      <Tag tone="info">Antes do ETP</Tag>
                    </div>
                    <p style={{ margin: 0, marginTop: 4, fontSize: 13, color: "var(--text-secondary)" }}>
                      Antes de iniciar o ETP, o DFD será analisado pela IA que fornecerá parecer sobre qualidade, completude e compatibilidade com a legislação.
                    </p>
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: "var(--surface-card)",
                  border: includeRetificacao ? "var(--border-violet)" : "var(--border-default)",
                  borderRadius: "var(--radius-card)",
                  paddingBlock: 16,
                  paddingInline: 18,
                  transition: "border 0.15s",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ paddingTop: 2 }}>
                    <Toggle checked={includeRetificacao} onChange={setIncludeRetificacao} color="var(--color-violet)" label="Fase de Retificação" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-body)", fontFamily: "var(--font-display)" }}>
                        Fase de Retificação
                      </span>
                      <Tag tone="violet">Opcional</Tag>
                    </div>
                    <p style={{ margin: 0, marginTop: 4, fontSize: 13, color: "var(--text-secondary)" }}>
                      Inclui uma fase de retificação no fluxo do processo, permitindo a correção de documentos após a geração quando identificadas inconsistências ou necessidade de ajustes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <InfoBanner tone="warning">
            O processo será criado com o número <strong style={{ fontFamily: "var(--font-mono)" }}>{numeroProcesso}</strong>.{" "}
            {includeDFDVerification
              ? "Após a criação você será direcionado à verificação do DFD pela IA."
              : "Após a criação você será direcionado ao preenchimento do ETP."}
          </InfoBanner>
        </div>
      )}

      {/* Ações */}
      <div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
        {step > 1 && (
          <Button variant="secondary" size="lg" onClick={() => setStep((s) => s - 1)}>
            Voltar
          </Button>
        )}
        <Button
          size="lg"
          disabled={!canProceed || criarProcesso.isPending}
          onClick={() => {
            if (step < 3) setStep((s) => s + 1)
            else handleCreate()
          }}
        >
          {criarProcesso.isPending
            ? "Criando processo..."
            : step === 3
              ? includeDFDVerification
                ? "Criar Processo e Verificar DFD →"
                : "Criar Processo e Iniciar ETP →"
              : "Continuar →"}
        </Button>
      </div>
    </div>
  )
}
