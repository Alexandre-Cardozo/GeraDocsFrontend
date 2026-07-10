import { useState } from "react"
import type { View } from "../App"

interface Props {
  navigate: (view: View, id?: string) => void
}

const modalidades = [
  { key: "pregao", label: "Pregão Eletrônico", desc: "Para aquisição de bens e serviços comuns", icon: "🛒" },
  { key: "concorrencia", label: "Concorrência", desc: "Para obras, serviços e compras de grande vulto", icon: "🏗️" },
  { key: "dispensa", label: "Dispensa de Licitação", desc: "Casos previstos no Art. 75 da Lei 14.133/21", icon: "⚡" },
  { key: "inexigibilidade", label: "Inexigibilidade", desc: "Quando a competição é inviável", icon: "🔒" },
  { key: "credenciamento", label: "Credenciamento", desc: "Para seleção de prestadores de serviços", icon: "📋" },
]

const secretarias = [
  "Secretaria de Educação",
  "Secretaria de Saúde",
  "Secretaria de Obras e Infraestrutura",
  "Secretaria de Administração",
  "Secretaria de Finanças",
  "Secretaria de Meio Ambiente",
  "Secretaria de Assistência Social",
  "Frota Municipal",
  "Administração Central",
]

const steps = [
  { n: 1, label: "Modalidade" },
  { n: 2, label: "Identificação" },
  { n: 3, label: "Documentos" },
]

type ATAMode = "attach" | "delegate" | "both" | ""

export default function NewProcess({ navigate }: Props) {
  const [step, setStep] = useState(1)

  // Step 1
  const [modalidade, setModalidade] = useState("")
  const [isAdeSaoATA, setIsAdesaoATA] = useState(false)
  const [ataModeStep1, setATAModeStep1] = useState<ATAMode>("")
  const [ataFileStep1, setATAFileStep1] = useState<string | null>(null)
  const [ataMotivo, setATAMotivo] = useState("")

  // Step 2
  const [secretaria, setSecretaria] = useState("")
  const [objeto, setObjeto] = useState("")
  const [dfdFile, setDFDFile] = useState<string | null>(null)
  const [valorRef, setValorRef] = useState("")
  const [fundamento, setFundamento] = useState("")

  // Step 3 docs selection
  const [docsSelected, setDocsSelected] = useState<Record<string, boolean>>({
    etp: true, tr: true, cotacao: false, mapa: false,
  })
  const [includeDFDVerification, setIncludeDFDVerification] = useState(false)
  const [includeRetificacao, setIncludeRetificacao] = useState(false)

  const toggleDoc = (key: string) => {
    if (key === "etp" || key === "tr") return
    setDocsSelected((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const dfdOrObjeto = dfdFile !== null || objeto.trim() !== ""

  const canProceed =
    (step === 1 && modalidade !== "" && (!isAdeSaoATA || (ataModeStep1 !== "" && ataMotivo.trim() !== ""))) ||
    (step === 2 && secretaria !== "" && dfdOrObjeto) ||
    step === 3

  const handleCreate = () => {
    if (includeDFDVerification) {
      navigate("dfd-review", "PROC-2024-090")
    } else {
      navigate("etp-form", "PROC-2024-090")
    }
  }

  return (
    <div style={{ padding: "28px", maxWidth: 880 }}>
      {/* Step indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 36 }}>
        {steps.map((s, i) => (
          <div key={s.n} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 32, height: 32, borderRadius: 999,
                  background: step > s.n ? "#10B981" : step === s.n ? "#2563EB" : "#E2E8F0",
                  color: step >= s.n ? "#FFFFFF" : "#94A3B8",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 700, flexShrink: 0, transition: "all 0.2s",
                }}
              >
                {step > s.n ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : s.n}
              </div>
              <span style={{ fontSize: 13, fontWeight: step === s.n ? 700 : 500, color: step === s.n ? "#071A3D" : "#94A3B8" }}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ width: 60, height: 2, background: step > s.n ? "#10B981" : "#E2E8F0", margin: "0 12px", transition: "background 0.2s" }} />
            )}
          </div>
        ))}
      </div>

      {/* ── STEP 1 ── */}
      {step === 1 && (
        <div>
          <h2 style={headingStyle}>Selecione a Modalidade</h2>
          <p style={subtextStyle}>Escolha a modalidade de licitação de acordo com o objeto e os valores estimados.</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
            {modalidades.map((m) => (
              <button key={m.key} onClick={() => setModalidade(m.key)} style={choiceCard(modalidade === m.key)}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{m.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#071A3D", fontFamily: "Plus Jakarta Sans, sans-serif" }}>{m.label}</div>
                  <div style={{ fontSize: 13, color: "#64748B", marginTop: 2 }}>{m.desc}</div>
                </div>
                {modalidade === m.key && <CheckMark />}
              </button>
            ))}
          </div>

          {/* Adesão de ATA antecipada */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 12, padding: "18px 20px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{ paddingTop: 2 }}>
                <Toggle checked={isAdeSaoATA} onChange={setIsAdesaoATA} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#071A3D", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                  Este processo será instaurado como Adesão de Ata de Registro de Preços
                </div>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748B" }}>
                  Ative caso a solução já seja previamente definida como Adesão de ATA. O modelo será orientado a gerar o ETP com essa conclusão.
                </p>
              </div>
            </div>

            {isAdeSaoATA && (
              <div style={{ marginTop: 18, borderTop: "1px solid #F1F5F9", paddingTop: 18, display: "flex", flexDirection: "column", gap: 16 }}>
                <FormField label="Motivo da decisão prévia pela Adesão de ATA" required hint="Justifique por que a Adesão de ATA já foi definida antes do ETP">
                  <textarea
                    value={ataMotivo}
                    onChange={(e) => setATAMotivo(e.target.value)}
                    rows={3}
                    placeholder="Ex: Existe ATA vigente do PNCP com objeto compatível e condições vantajosas devidamente comprovadas..."
                    style={{ ...inputStyle, resize: "vertical" }}
                  />
                </FormField>

                <div>
                  <label style={labelStyle}>Gestão da ATA</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                    {[
                      { key: "attach" as ATAMode, label: "Anexar ATA para revisão pela IA", desc: "A plataforma analisará a ATA enviada e verificará sua compatibilidade com o objeto." },
                      { key: "delegate" as ATAMode, label: "Delegar ao modelo a busca de ATAs válidas", desc: "A IA buscará ATAs compatíveis; você poderá visualizar as origens e selecionar." },
                      { key: "both" as ATAMode, label: "Anexar ATA e também buscar outras opções", desc: "A IA revisa sua ATA e ainda sugere alternativas encontradas." },
                    ].map((opt) => (
                      <button key={opt.key} onClick={() => setATAModeStep1(opt.key)} style={choiceCard(ataModeStep1 === opt.key, "small")}>
                        <div style={{ flex: 1, textAlign: "left" }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#071A3D", fontFamily: "Plus Jakarta Sans, sans-serif" }}>{opt.label}</div>
                          <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>{opt.desc}</div>
                        </div>
                        {ataModeStep1 === opt.key && <CheckMark small />}
                      </button>
                    ))}
                  </div>
                </div>

                {(ataModeStep1 === "attach" || ataModeStep1 === "both") && (
                  <FormField label="Anexar ATA" hint="Formatos aceitos: PDF, DOCX">
                    <FileUpload
                      file={ataFileStep1}
                      onChange={setATAFileStep1}
                      placeholder="Clique para selecionar a ATA ou arraste o arquivo"
                      accept=".pdf,.docx"
                    />
                  </FormField>
                )}

                {ataModeStep1 === "delegate" && (
                  <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 10, padding: "12px 14px", display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <p style={{ margin: 0, fontSize: 12, color: "#1D4ED8" }}>
                      O modelo realizará a busca de ATAs após o processo ser criado. Os resultados ficarão disponíveis na aba de Processos para sua análise e seleção.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── STEP 2 ── */}
      {step === 2 && (
        <div>
          <h2 style={headingStyle}>Identificação do Processo</h2>
          <p style={subtextStyle}>Informe os dados básicos. É obrigatório preencher ao menos o DFD ou o Objeto da Contratação.</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <FormField label="Secretaria Requisitante" required>
              <select value={secretaria} onChange={(e) => setSecretaria(e.target.value)} style={inputStyle}>
                <option value="">Selecione a secretaria...</option>
                {secretarias.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>

            {/* DFD Upload */}
            <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 12, padding: "18px 20px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>
                    Documento de Formalização de Demanda (DFD)
                    <span style={{ fontSize: 11, background: "#FFFBEB", color: "#92400E", borderRadius: 6, padding: "2px 7px", fontWeight: 600, marginLeft: 8 }}>Recomendado</span>
                  </label>
                  <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748B" }}>
                    O DFD alimentará automaticamente as seções do ETP. Caso não possua, preencha o campo Objeto abaixo.
                  </p>
                </div>
              </div>
              <FileUpload
                file={dfdFile}
                onChange={setDFDFile}
                placeholder="Clique para selecionar o DFD ou arraste o arquivo aqui"
                accept=".pdf,.docx,.doc"
              />
              {dfdFile && (
                <div style={{ marginTop: 10, background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: 8, padding: "8px 12px", display: "flex", gap: 8, alignItems: "center" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span style={{ fontSize: 12, color: "#065F46", fontWeight: 600 }}>DFD anexado — o ETP será gerado com base neste documento.</span>
                </div>
              )}
            </div>

            {/* Objeto */}
            <FormField
              label="Objeto da Contratação"
              required={!dfdFile}
              hint={dfdFile ? "Opcional quando o DFD é inserido — use como complemento ou detalhamento" : "Obrigatório quando o DFD não é inserido"}
            >
              <textarea
                value={objeto}
                onChange={(e) => setObjeto(e.target.value)}
                placeholder="Ex: Aquisição de equipamentos de informática para as unidades escolares da rede municipal..."
                rows={3}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </FormField>

            {!dfdOrObjeto && (
              <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "10px 14px", display: "flex", gap: 8, alignItems: "center" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span style={{ fontSize: 12, color: "#991B1B", fontWeight: 500 }}>Preencha ao menos o DFD ou o Objeto da Contratação para continuar.</span>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <FormField label="Valor de Referência Estimado">
                <input value={valorRef} onChange={(e) => setValorRef(e.target.value)} placeholder="R$ 0,00" style={inputStyle} />
              </FormField>
              <FormField label="Fundamento Legal">
                <input value={fundamento} onChange={(e) => setFundamento(e.target.value)} placeholder="Ex: Art. 75, II, Lei 14.133/21" style={inputStyle} />
              </FormField>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 3 ── */}
      {step === 3 && (
        <div>
          <h2 style={headingStyle}>Configurar Processo</h2>
          <p style={subtextStyle}>Selecione os documentos a gerar e configure as fases opcionais do processo.</p>

          {/* Documents */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ ...labelStyle, display: "block", marginBottom: 12 }}>Documentos a Gerar</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { key: "etp", title: "Estudo Técnico Preliminar (ETP)", desc: "Fundamenta a necessidade e os requisitos técnicos da contratação", obrig: true, sections: 12, color: "#2563EB", bg: "#EFF6FF" },
                { key: "tr", title: "Termo de Referência (TR)", desc: "Define as condições para execução do objeto da licitação", obrig: true, sections: 15, color: "#0D9488", bg: "#F0FDFA" },
                { key: "cotacao", title: "Cotação de Mercado", desc: "Pesquisa de preços com fornecedores para embasar a estimativa de valor", obrig: false, sections: 4, color: "#7C3AED", bg: "#F5F3FF" },
                { key: "mapa", title: "Mapa de Riscos", desc: "Avaliação e classificação dos riscos envolvidos na contratação", obrig: false, sections: 5, color: "#B45309", bg: "#FFFBEB" },
              ].map((d) => {
                const selected = docsSelected[d.key]
                return (
                  <button
                    key={d.key}
                    onClick={() => toggleDoc(d.key)}
                    style={{
                      display: "flex", alignItems: "flex-start", gap: 16, padding: "16px 18px",
                      borderRadius: 12, border: selected ? `2px solid ${d.color}` : "1px solid #E2E8F0",
                      background: selected ? d.bg : "#FFFFFF", cursor: d.obrig ? "default" : "pointer",
                      textAlign: "left", transition: "all 0.15s",
                    }}
                  >
                    <div style={{ width: 38, height: 38, background: selected ? d.bg : "#F8FAFC", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2, border: `1px solid ${selected ? d.color + "30" : "#E2E8F0"}` }}>
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={selected ? d.color : "#94A3B8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#071A3D", fontFamily: "Plus Jakarta Sans, sans-serif" }}>{d.title}</span>
                        {d.obrig && <span style={{ fontSize: 10, background: "#ECFDF5", color: "#065F46", borderRadius: 6, padding: "2px 6px", fontWeight: 700 }}>Obrigatório</span>}
                      </div>
                      <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748B" }}>{d.desc}</p>
                      <p style={{ margin: "5px 0 0", fontSize: 11, color: "#94A3B8" }}>{d.sections} seções</p>
                    </div>
                    <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${selected ? d.color : "#E2E8F0"}`, background: selected ? d.color : "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 8, transition: "all 0.15s" }}>
                      {selected && (
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Optional phases */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ ...labelStyle, display: "block", marginBottom: 12 }}>Fases Opcionais do Processo</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

              {/* DFD Verification phase */}
              <div style={{ background: "#FFFFFF", border: `1px solid ${includeDFDVerification ? "#2563EB" : "#E2E8F0"}`, borderRadius: 12, padding: "16px 18px", transition: "border 0.15s" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ paddingTop: 2 }}>
                    <Toggle checked={includeDFDVerification} onChange={setIncludeDFDVerification} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#071A3D", fontFamily: "Plus Jakarta Sans, sans-serif" }}>Verificação do DFD pela IA</span>
                      <span style={{ fontSize: 10, background: "#EFF6FF", color: "#1D4ED8", borderRadius: 6, padding: "2px 7px", fontWeight: 700 }}>Antes do ETP</span>
                    </div>
                    <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748B" }}>
                      Antes de iniciar o ETP, o DFD será analisado pela IA que fornecerá parecer sobre qualidade, completude e compatibilidade com a legislação.
                    </p>
                  </div>
                </div>
              </div>

              {/* Retification phase */}
              <div style={{ background: "#FFFFFF", border: `1px solid ${includeRetificacao ? "#7C3AED" : "#E2E8F0"}`, borderRadius: 12, padding: "16px 18px", transition: "border 0.15s" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ paddingTop: 2 }}>
                    <Toggle checked={includeRetificacao} onChange={setIncludeRetificacao} color="#7C3AED" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#071A3D", fontFamily: "Plus Jakarta Sans, sans-serif" }}>Fase de Retificação</span>
                      <span style={{ fontSize: 10, background: "#F5F3FF", color: "#6D28D9", borderRadius: 6, padding: "2px 7px", fontWeight: 700 }}>Opcional</span>
                    </div>
                    <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748B" }}>
                      Inclui uma fase de retificação no fluxo do processo, permitindo a correção de documentos após a geração quando identificadas inconsistências ou necessidade de ajustes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10, padding: "14px 16px", display: "flex", gap: 10, alignItems: "flex-start" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#92400E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p style={{ margin: 0, fontSize: 13, color: "#92400E" }}>
              O processo será criado com o número <strong>PROC-2024-090</strong>.{" "}
              {includeDFDVerification ? "Após a criação você será direcionado à verificação do DFD pela IA." : "Após a criação você será direcionado ao preenchimento do ETP."}
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
        {step > 1 && (
          <button onClick={() => setStep((s) => s - 1)} style={btnSecondary}>
            Voltar
          </button>
        )}
        <button
          disabled={!canProceed}
          onClick={() => {
            if (step < 3) setStep((s) => s + 1)
            else handleCreate()
          }}
          style={{
            padding: "11px 28px", border: "none", borderRadius: 9,
            background: canProceed ? "#2563EB" : "#E2E8F0",
            fontSize: 14, fontWeight: 600,
            color: canProceed ? "#FFFFFF" : "#94A3B8",
            cursor: canProceed ? "pointer" : "not-allowed", transition: "all 0.15s",
          }}
        >
          {step === 3
            ? includeDFDVerification
              ? "Criar Processo e Verificar DFD →"
              : "Criar Processo e Iniciar ETP →"
            : "Continuar →"}
        </button>
      </div>
    </div>
  )
}

// ── Shared styles ──────────────────────────────────────────────────────────────
const headingStyle: React.CSSProperties = {
  fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 20, fontWeight: 800,
  color: "#071A3D", margin: "0 0 6px", letterSpacing: "-0.5px",
}
const subtextStyle: React.CSSProperties = { margin: "0 0 24px", fontSize: 14, color: "#64748B" }
const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: "#374151" }
const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 13px", border: "1px solid #E2E8F0", borderRadius: 8,
  fontSize: 14, color: "#071A3D", background: "#FFFFFF", outline: "none", fontFamily: "Inter, sans-serif",
  boxSizing: "border-box",
}
const btnSecondary: React.CSSProperties = {
  padding: "11px 24px", border: "1px solid #E2E8F0", borderRadius: 9,
  background: "#FFFFFF", fontSize: 14, fontWeight: 600, color: "#64748B", cursor: "pointer",
}

function choiceCard(selected: boolean, size: "normal" | "small" = "normal"): React.CSSProperties {
  return {
    display: "flex", alignItems: "center", gap: 14,
    padding: size === "small" ? "12px 16px" : "16px 20px",
    borderRadius: 12, border: selected ? "2px solid #2563EB" : "1px solid #E2E8F0",
    background: selected ? "#EFF6FF" : "#FFFFFF", cursor: "pointer",
    textAlign: "left", transition: "all 0.15s", width: "100%",
  }
}

// ── Sub-components ─────────────────────────────────────────────────────────────
function CheckMark({ small }: { small?: boolean }) {
  const s = small ? 16 : 20
  return (
    <div style={{ width: s, height: s, borderRadius: 999, background: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <svg width={small ? 9 : 11} height={small ? 9 : 11} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
  )
}

function Toggle({ checked, onChange, color = "#2563EB" }: { checked: boolean; onChange: (v: boolean) => void; color?: string }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: 40, height: 22, borderRadius: 999, border: "none", cursor: "pointer", padding: 0,
        background: checked ? color : "#CBD5E1", transition: "background 0.2s", position: "relative", flexShrink: 0,
      }}
    >
      <div style={{
        position: "absolute", top: 3, left: checked ? 21 : 3,
        width: 16, height: 16, borderRadius: 999, background: "#FFFFFF", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
      }} />
    </button>
  )
}

function FormField({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
        {label}
        {required && <span style={{ color: "#EF4444", marginLeft: 4 }}>*</span>}
      </label>
      {hint && <p style={{ margin: "0 0 8px", fontSize: 12, color: "#94A3B8" }}>{hint}</p>}
      {children}
    </div>
  )
}

function FileUpload({ file, onChange, placeholder, accept }: { file: string | null; onChange: (v: string | null) => void; placeholder: string; accept: string }) {
  return (
    <div>
      {file ? (
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 8, padding: "10px 14px" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <span style={{ flex: 1, fontSize: 13, color: "#374151", fontWeight: 500 }}>{file}</span>
          <button onClick={() => onChange(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", padding: 2, display: "flex" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      ) : (
        <label style={{ display: "block", cursor: "pointer" }}>
          <input
            type="file"
            accept={accept}
            style={{ display: "none" }}
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) onChange(f.name)
            }}
          />
          <div style={{
            border: "2px dashed #CBD5E1", borderRadius: 8, padding: "18px 20px",
            textAlign: "center", transition: "all 0.15s", background: "#FAFAFA",
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 8px", display: "block" }}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p style={{ margin: 0, fontSize: 13, color: "#64748B" }}>{placeholder}</p>
            <p style={{ margin: "4px 0 0", fontSize: 11, color: "#94A3B8" }}>{accept.replace(/\./g, "").toUpperCase().replace(/,/g, ", ")}</p>
          </div>
        </label>
      )}
    </div>
  )
}
