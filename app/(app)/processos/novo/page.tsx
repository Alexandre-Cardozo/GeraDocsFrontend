"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import {
  Button,
  ChoiceCard,
  Dropdown,
  FileUpload,
  FormField,
  InfoBanner,
  MoneyInput,
  Input,
  StepIndicator,
  Tag,
  Textarea,
  Toggle,
  ValidationMsg,
} from "@/components/ui"
import {
  IconBuilding,
  IconCart,
  IconCheck,
  IconClipboard,
  IconFile,
  IconGavel,
  IconLock,
  IconMessageCircle,
  IconTrophy,
  IconZap,
} from "@/components/ui/icons"
import { useConfigTenant, useCriarProcesso, useProximoNumeroProcesso } from "@/lib/api/hooks"
import type { Modalidade, ModoATA } from "@/lib/types"

const modalidades: Array<{ key: string; valor: Modalidade; label: string; desc: string; icon: React.ReactNode }> = [
  { key: "pregao", valor: "Pregão Eletrônico", label: "Pregão Eletrônico", desc: "Para aquisição de bens e serviços comuns", icon: <IconCart size={22} /> },
  { key: "concorrencia", valor: "Concorrência", label: "Concorrência", desc: "Para obras, serviços e compras de grande vulto", icon: <IconBuilding size={22} /> },
  { key: "concurso", valor: "Concurso", label: "Concurso", desc: "Para escolha de trabalho técnico, científico ou artístico", icon: <IconTrophy size={22} /> },
  { key: "leilao", valor: "Leilão", label: "Leilão", desc: "Para alienação de bens móveis ou imóveis", icon: <IconGavel size={22} /> },
  { key: "dialogo", valor: "Diálogo Competitivo", label: "Diálogo Competitivo", desc: "Para contratações de inovação técnica ou complexidade elevada", icon: <IconMessageCircle size={22} /> },
  { key: "dispensa", valor: "Dispensa Art. 75", label: "Dispensa de Licitação", desc: "Casos previstos no Art. 75 da Lei 14.133/21", icon: <IconZap size={22} /> },
  { key: "inexigibilidade", valor: "Inexigibilidade", label: "Inexigibilidade", desc: "Quando a competição é inviável", icon: <IconLock size={22} /> },
  { key: "credenciamento", valor: "Credenciamento", label: "Credenciamento", desc: "Para seleção de prestadores de serviços", icon: <IconClipboard size={22} /> },
]

const modosATA: Array<{ key: ModoATA; label: string; desc: string }> = [
  { key: "anexar", label: "Anexar ATA para revisão pela IA", desc: "A plataforma analisará a ATA enviada e verificará sua compatibilidade com o objeto." },
  { key: "delegar", label: "Delegar ao modelo a busca de ATAs válidas", desc: "A IA buscará ATAs compatíveis; você poderá visualizar as origens e selecionar." },
  { key: "combinado", label: "Anexar ATA e também buscar outras opções", desc: "A IA revisa sua ATA e ainda sugere alternativas encontradas." },
]

/** Cores por tipo de documento (tokens doc-* do DS via classes). */
const documentosGeraveis = [
  {
    key: "etp",
    titulo: "Estudo Técnico Preliminar (ETP)",
    desc: "Fundamenta a necessidade e os requisitos técnicos da contratação",
    obrig: true,
    secoes: 12,
    selecionado: "border-doc-etp bg-doc-etp-bg",
    chipSelecionado: "border-doc-etp bg-doc-etp-bg text-doc-etp",
    checkSelecionado: "border-doc-etp bg-doc-etp",
  },
  {
    key: "tr",
    titulo: "Termo de Referência (TR)",
    desc: "Define as condições para execução do objeto da licitação",
    obrig: true,
    secoes: 15,
    selecionado: "border-doc-tr bg-doc-tr-bg",
    chipSelecionado: "border-doc-tr bg-doc-tr-bg text-doc-tr",
    checkSelecionado: "border-doc-tr bg-doc-tr",
  },
  {
    key: "cotacao",
    titulo: "Cotação de Mercado",
    desc: "Pesquisa de preços com fornecedores para embasar a estimativa de valor",
    obrig: false,
    secoes: 4,
    selecionado: "border-doc-cotacao bg-doc-cotacao-bg",
    chipSelecionado: "border-doc-cotacao bg-doc-cotacao-bg text-doc-cotacao",
    checkSelecionado: "border-doc-cotacao bg-doc-cotacao",
  },
  {
    key: "mapa",
    titulo: "Mapa de Riscos",
    desc: "Avaliação e classificação dos riscos envolvidos na contratação",
    obrig: false,
    secoes: 5,
    selecionado: "border-doc-mapa bg-doc-mapa-bg",
    chipSelecionado: "border-doc-mapa bg-doc-mapa-bg text-doc-mapa",
    checkSelecionado: "border-doc-mapa bg-doc-mapa",
  },
] as const

const headingClasses = "m-0 mb-1.5 font-display text-2xl font-extrabold tracking-tight text-text-1"
const subtextClasses = "m-0 mb-6 text-md text-text-3"
const labelClasses = "text-base font-semibold text-text-2"

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

  const modalidadeSel = modalidades.find((m) => m.key === modalidade)
  const docsSelecionados = documentosGeraveis.filter((d) => docsSelected[d.key])

  return (
    <div className="max-w-content p-4 sm:p-5 lg:p-7">
      <div className="mb-8">
        <StepIndicator steps={["Modalidade", "Identificação", "Documentos"]} current={step} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
      {/* ── Passo 1 ── */}
      {step === 1 && (
        <div>
          <h2 className={headingClasses}>Selecione a Modalidade</h2>
          <p className={subtextClasses}>Escolha a modalidade de licitação de acordo com o objeto e os valores estimados.</p>

          <div className="mb-6 flex flex-col gap-2.5">
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
          <div className="rounded-card border border-border bg-surface px-5 py-4.5">
            <div className="flex items-start gap-3">
              <div className="pt-0.5">
                <Toggle checked={isAdesaoATA} onChange={setIsAdesaoATA} label="Processo como Adesão de ATA" />
              </div>
              <div className="flex-1">
                <div className="font-display text-md font-bold text-text-1">
                  Este processo será instaurado como Adesão de Ata de Registro de Preços
                </div>
                <p className="m-0 mt-1 text-base text-text-3">
                  Ative caso a solução já seja previamente definida como Adesão de ATA. O modelo será orientado a gerar o ETP com essa conclusão.
                </p>
              </div>
            </div>

            {isAdesaoATA && (
              <div className="mt-4.5 flex flex-col gap-4 border-t border-border-soft pt-4.5">
                <FormField label="Motivo da decisão prévia pela Adesão de ATA" required hint="Justifique por que a Adesão de ATA já foi definida antes do ETP">
                  <Textarea
                    value={ataMotivo}
                    onChange={(e) => setATAMotivo(e.target.value)}
                    rows={3}
                    placeholder="Ex: Existe ATA vigente do PNCP com objeto compatível e condições vantajosas devidamente comprovadas..."
                  />
                </FormField>

                <div>
                  <span className={labelClasses}>Gestão da ATA</span>
                  <div className="mt-2 flex flex-col gap-2">
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
          <h2 className={headingClasses}>Identificação do Processo</h2>
          <p className={subtextClasses}>Informe os dados básicos. É obrigatório preencher ao menos o DFD ou o Objeto da Contratação.</p>

          <div className="flex flex-col gap-4.5">
            <FormField label="Secretaria Requisitante" required>
              <Dropdown
                value={secretaria}
                onChange={setSecretaria}
                ariaLabel="Secretaria requisitante"
                options={[
                  { value: "", label: "Selecione a secretaria..." },
                  ...(tenant?.secretarias ?? []).map((s) => ({ value: s.nome, label: s.nome })),
                ]}
              />
            </FormField>

            {/* Upload do DFD */}
            <div className="rounded-card border border-border bg-surface px-5 py-4.5">
              <div className="mb-3">
                <span className="inline-flex items-center gap-2 text-base font-bold text-text-2">
                  Documento de Formalização de Demanda (DFD)
                  <Tag tone="warning">Recomendado</Tag>
                </span>
                <p className="m-0 mt-1 text-sm text-text-3">
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
                <InfoBanner tone="success" icon={<IconCheck size={14} strokeWidth={2.5} />} className="mt-2.5">
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Valor de Referência Estimado">
                <MoneyInput value={valorRef} onChange={(e) => setValorRef(e.target.value)} />
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
          <h2 className={headingClasses}>Configurar Processo</h2>
          <p className={subtextClasses}>Selecione os documentos a gerar e configure as fases opcionais do processo.</p>

          <div className="mb-6">
            <span className={`mb-3 block ${labelClasses}`}>Documentos a Gerar</span>
            <div className="flex flex-col gap-2.5">
              {documentosGeraveis.map((d) => {
                const selected = docsSelected[d.key] === true
                return (
                  <button
                    key={d.key}
                    type="button"
                    onClick={() => toggleDoc(d.key)}
                    aria-pressed={selected}
                    className={`flex w-full items-start gap-4 rounded-card px-4.5 py-4 text-left transition-colors ${
                      selected ? `border-2 ${d.selecionado} cursor-default` : "cursor-pointer border border-border bg-surface"
                    } ${d.obrig ? "cursor-default" : ""}`}
                  >
                    <span
                      className={`mt-0.5 flex size-9.5 shrink-0 items-center justify-center rounded-lg border ${
                        selected ? d.chipSelecionado : "border-border bg-ice text-text-muted"
                      }`}
                    >
                      <IconFile size={17} />
                    </span>
                    <span className="block flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-display text-md font-bold text-text-1">{d.titulo}</span>
                        {d.obrig && <Tag tone="success">Obrigatório</Tag>}
                      </span>
                      <span className="mt-1 block text-base text-text-3">{d.desc}</span>
                      <span className="mt-1.25 block text-xs text-text-muted">{d.secoes} seções</span>
                    </span>
                    <span
                      className={`mt-2 flex size-5.5 shrink-0 items-center justify-center rounded-sm border-2 text-surface transition-colors ${
                        selected ? d.checkSelecionado : "border-border bg-ice"
                      }`}
                    >
                      {selected && <IconCheck size={11} strokeWidth={3.5} />}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Fases opcionais */}
          <div className="mb-5">
            <span className={`mb-3 block ${labelClasses}`}>Fases Opcionais do Processo</span>
            <div className="flex flex-col gap-2.5">
              <div
                className={`rounded-card border bg-surface px-4.5 py-4 transition-colors ${
                  includeDFDVerification ? "border-royal" : "border-border"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="pt-0.5">
                    <Toggle checked={includeDFDVerification} onChange={setIncludeDFDVerification} label="Verificação do DFD pela IA" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-md font-bold text-text-1">Verificação do DFD pela IA</span>
                      <Tag tone="info">Antes do ETP</Tag>
                    </div>
                    <p className="m-0 mt-1 text-base text-text-3">
                      Antes de iniciar o ETP, o DFD será analisado pela IA que fornecerá parecer sobre qualidade, completude e compatibilidade com a legislação.
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`rounded-card border bg-surface px-4.5 py-4 transition-colors ${
                  includeRetificacao ? "border-violet" : "border-border"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="pt-0.5">
                    <Toggle checked={includeRetificacao} onChange={setIncludeRetificacao} tone="violet" label="Fase de Retificação" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-md font-bold text-text-1">Fase de Retificação</span>
                      <Tag tone="violet">Opcional</Tag>
                    </div>
                    <p className="m-0 mt-1 text-base text-text-3">
                      Inclui uma fase de retificação no fluxo do processo, permitindo a correção de documentos após a geração quando identificadas inconsistências ou necessidade de ajustes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <InfoBanner tone="warning">
            O processo será criado com o número <strong className="font-mono">{numeroProcesso}</strong>.{" "}
            {includeDFDVerification
              ? "Após a criação você será direcionado à verificação do DFD pela IA."
              : "Após a criação você será direcionado ao preenchimento do ETP."}
          </InfoBanner>
        </div>
      )}

      {/* Ações */}
      <div className="mt-8 flex flex-wrap gap-3">
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

        {/* Resumo do processo — acompanha as escolhas do wizard */}
        <aside className="lg:sticky lg:top-4 lg:self-start">
          <div className="rounded-card border border-border bg-surface p-5">
            <h3 className="m-0 mb-1 font-display text-base font-bold text-text-1">Resumo do Processo</h3>
            <p className="m-0 mb-4 text-sm text-text-3">
              Número <span className="font-mono font-semibold text-royal">{numeroProcesso}</span>
            </p>
            <dl className="flex flex-col gap-3">
              {[
                { rotulo: "Modalidade", valor: modalidadeSel?.label },
                { rotulo: "Secretaria", valor: secretaria },
                {
                  rotulo: "Objeto",
                  valor: objeto.trim() || (dfdFile ? "Definido pelo DFD anexado" : ""),
                },
                { rotulo: "Valor de referência", valor: valorRef.trim() ? `R$ ${valorRef}` : "" },
                {
                  rotulo: "Documentos",
                  valor: docsSelecionados.length ? docsSelecionados.map((d) => d.key.toUpperCase()).join(" · ") : "",
                },
              ].map((item) => (
                <div key={item.rotulo}>
                  <dt className="text-2xs font-semibold tracking-caps text-text-muted uppercase">{item.rotulo}</dt>
                  <dd className="m-0 mt-0.5 text-base text-text-1">
                    {item.valor ? item.valor : <span className="text-text-faint">Não definido</span>}
                  </dd>
                </div>
              ))}
              {(includeDFDVerification || includeRetificacao) && (
                <div>
                  <dt className="text-2xs font-semibold tracking-caps text-text-muted uppercase">Fases opcionais</dt>
                  <dd className="m-0 mt-1 flex flex-wrap gap-1.5">
                    {includeDFDVerification && <Tag tone="info">Verificação do DFD</Tag>}
                    {includeRetificacao && <Tag tone="violet">Retificação</Tag>}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </aside>
      </div>
    </div>
  )
}
