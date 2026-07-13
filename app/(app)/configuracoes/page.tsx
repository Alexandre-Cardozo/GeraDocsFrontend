"use client"

import { useState } from "react"

import { Button, FileUpload, FormField, InfoBanner, Input, SectionBlock, Select, Tag, Textarea, Toggle } from "@/components/ui"
import { IconCheck, IconFile, IconImage, IconPlus, IconTrash, IconUpload } from "@/components/ui/icons"
import { ErrorState, LoadingState } from "@/components/shared/estados"
import { Th } from "@/components/shared/tabela"
import { useToast } from "@/components/shared/providers"
import { useAtualizarConfigTenant, useConfigTenant } from "@/lib/api/hooks"
import type { Secretaria } from "@/lib/types"

const tabs = [
  { key: "identidade", label: "Identidade Visual" },
  { key: "cabecalho", label: "Cabeçalho e Rodapé" },
  { key: "secretarias", label: "Secretarias" },
  { key: "pca", label: "PCA — Plano de Contratações" },
  { key: "usuarios", label: "Usuários e Permissões" },
]

/** Cores dos avatares de usuário (ciclo por índice). */
const avatarCores = ["bg-royal", "bg-teal", "bg-violet", "bg-doc-mapa"]

/**
 * Pré-visualização ao vivo do documento timbrado (brasão + cabeçalho + rodapé).
 * Preenche a coluna direita das abas de identidade/cabeçalho e reflete o que está
 * sendo configurado. Reutilizável entre as duas abas.
 */
function PreviewDocumento({
  logoDataUrl,
  cabecalho,
  rodape,
  timbrado,
}: {
  logoDataUrl: string | null
  cabecalho: string
  rodape: string
  timbrado: boolean
}) {
  const rodapeResolvido = rodape
    .replace("{data}", "09/07/2025")
    .replace("{numero}", "PROC-2024-090")
    .replace("{pagina}", "1")

  return (
    <div className="lg:sticky lg:top-4">
      <div className="mb-2 text-2xs font-semibold tracking-caps text-text-muted uppercase">
        Pré-visualização do Documento
      </div>
      <div className="rounded-card border border-border bg-ice p-5">
        {/* Folha A4 estilizada */}
        <div className="mx-auto flex aspect-[1/1.414] w-full max-w-70 flex-col rounded-sm border border-border bg-surface p-5">
          {timbrado ? (
            <div className="flex items-start gap-2.5 border-b-2 border-navy pb-2.5">
              {logoDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- data URL local, sem otimização do next/image
                <img src={logoDataUrl} alt="" className="size-8 shrink-0 object-contain" />
              ) : (
                <div className="flex size-8 shrink-0 items-center justify-center rounded-sm bg-border-soft text-text-faint">
                  <IconImage size={16} strokeWidth={1.5} />
                </div>
              )}
              <div className="min-w-0 flex-1">
                {cabecalho.split("\n").map((line, i) => (
                  <div
                    key={i}
                    className={`truncate font-display leading-tight text-text-1 ${i === 0 ? "text-2xs font-bold" : "text-2xs font-medium text-text-3"}`}
                  >
                    {line || " "}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Corpo simulado */}
          <div className="mt-4 flex flex-1 flex-col gap-2">
            <div className="h-1.5 w-1/3 rounded-full bg-border-soft" />
            <div className="h-1.5 w-full rounded-full bg-border-soft" />
            <div className="h-1.5 w-full rounded-full bg-border-soft" />
            <div className="h-1.5 w-5/6 rounded-full bg-border-soft" />
            <div className="mt-2 h-1.5 w-2/5 rounded-full bg-border-soft" />
            <div className="h-1.5 w-full rounded-full bg-border-soft" />
            <div className="h-1.5 w-11/12 rounded-full bg-border-soft" />
          </div>

          {timbrado && rodape.trim() !== "" ? (
            <div className="mt-3 border-t border-text-faint pt-1.5">
              <div className="truncate text-center text-2xs text-text-muted">{rodapeResolvido}</div>
            </div>
          ) : null}
        </div>
        <p className="mt-3 mb-0 text-center text-xs text-text-muted">
          {timbrado ? "Assim o timbre aparecerá nos documentos gerados." : "Timbre desativado — documentos sem brasão."}
        </p>
      </div>
    </div>
  )
}

export default function Configuracoes() {
  const showToast = useToast()
  const tenant = useConfigTenant()
  const atualizar = useAtualizarConfigTenant()

  const [activeTab, setActiveTab] = useState("identidade")

  // Estado local dos formulários, semeado quando o tenant carrega.
  const [logoFile, setLogoFile] = useState<string | null>(null)
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null)
  const [timbrado, setTimbrado] = useState(true)
  const [cabecalho, setCabecalho] = useState("")
  const [rodape, setRodape] = useState("")
  const [secretarias, setSecretarias] = useState<Secretaria[]>([])
  const [novaSecretaria, setNovaSecretaria] = useState("")
  const [pcaFile, setPcaFile] = useState<string | null>(null)
  const [pcaYear, setPcaYear] = useState("2025")
  const [seeded, setSeeded] = useState(false)

  // Semeia os formulários quando o tenant carrega (ajuste de estado durante o
  // render, guardado por `seeded` — evita efeito com setState síncrono).
  if (tenant.data && !seeded) {
    setSeeded(true)
    setLogoFile(tenant.data.logoArquivo)
    setLogoDataUrl(tenant.data.logoDataUrl)
    setTimbrado(tenant.data.timbrado)
    setCabecalho(tenant.data.cabecalho)
    setRodape(tenant.data.rodape)
    setSecretarias(tenant.data.secretarias)
    setPcaFile(tenant.data.pca.arquivo)
    setPcaYear(tenant.data.pca.ano)
  }

  if (tenant.isPending) {
    return (
      <div className="max-w-settings p-4 sm:p-5 lg:p-7">
        <LoadingState label="Carregando configurações..." />
      </div>
    )
  }
  if (tenant.isError) {
    return (
      <div className="max-w-settings p-4 sm:p-5 lg:p-7">
        <div className="rounded-card border border-border bg-surface">
          <ErrorState onRetry={() => void tenant.refetch()} />
        </div>
      </div>
    )
  }

  const salvarTenant = (patch: Parameters<typeof atualizar.mutate>[0], msg: string) => {
    atualizar.mutate(patch, {
      onSuccess: (tenantAtualizado) => {
        // Realinha o formulário com o estado canônico devolvido pela API — na
        // integração real o backend pode normalizar valores (trim, ids, contagens).
        setLogoFile(tenantAtualizado.logoArquivo)
        setLogoDataUrl(tenantAtualizado.logoDataUrl)
        setTimbrado(tenantAtualizado.timbrado)
        setCabecalho(tenantAtualizado.cabecalho)
        setRodape(tenantAtualizado.rodape)
        setSecretarias(tenantAtualizado.secretarias)
        setPcaFile(tenantAtualizado.pca.arquivo)
        setPcaYear(tenantAtualizado.pca.ano)
        showToast(msg)
      },
    })
  }

  const addSecretaria = () => {
    const nome = novaSecretaria.trim()
    if (nome === "") return
    const nova: Secretaria = { id: `sec-${Date.now()}`, nome }
    const lista = [...secretarias, nova]
    setSecretarias(lista)
    setNovaSecretaria("")
    salvarTenant({ secretarias: lista }, "Secretaria adicionada.")
  }

  const removeSecretaria = (id: string) => {
    const lista = secretarias.filter((s) => s.id !== id)
    setSecretarias(lista)
    salvarTenant({ secretarias: lista }, "Secretaria removida.")
  }

  // Lê o brasão selecionado como data URL para poder exibi-lo (preview, sidebar, timbre).
  const selecionarLogo = (file: File) => {
    setLogoFile(file.name)
    const reader = new FileReader()
    reader.onload = () => setLogoDataUrl(typeof reader.result === "string" ? reader.result : null)
    reader.readAsDataURL(file)
  }

  const removerLogo = () => {
    setLogoFile(null)
    setLogoDataUrl(null)
  }

  return (
    <div className="max-w-content p-4 sm:p-5 lg:p-7">
      <div className="mb-6">
        <h2 className="m-0 mb-1 font-display text-2xl font-extrabold tracking-tight text-text-1">
          Configurações da Prefeitura
        </h2>
        <p className="m-0 text-md text-text-3">
          Personalize os documentos gerados e configure as informações institucionais do órgão.
        </p>
      </div>

      {/* Tabs — roláveis horizontalmente em telas estreitas */}
      <div className="mb-7 flex overflow-x-auto border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setActiveTab(t.key)}
            className={`-mb-px shrink-0 cursor-pointer border-b-2 border-transparent bg-transparent px-4.5 py-2.25 text-base whitespace-nowrap transition-colors ${
              activeTab === t.key ? "border-b-royal font-bold text-royal" : "font-medium text-text-3"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Identidade Visual ── */}
      {activeTab === "identidade" && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="flex flex-col gap-5">
          <SectionBlock
            title="Logotipo / Brasão da Prefeitura"
            hint="O logotipo será inserido no cabeçalho dos documentos timbrados. Formatos aceitos: PNG, SVG, JPG (fundo transparente recomendado)."
          >
            {logoFile ? (
              <div className="flex items-center gap-4">
                <div className="flex size-20 items-center justify-center overflow-hidden rounded-xl border border-border bg-border-soft text-text-muted">
                  {logoDataUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element -- data URL local, sem otimização do next/image
                    <img src={logoDataUrl} alt="Brasão da prefeitura" className="size-full object-contain" />
                  ) : (
                    <IconImage size={32} strokeWidth={1.5} />
                  )}
                </div>
                <div>
                  <div className="text-base font-semibold text-text-1">{logoFile}</div>
                  <div className="mt-0.5 text-sm text-text-muted">
                    {logoDataUrl ? "Será exibido na sidebar e no timbre dos documentos" : "PNG · 340 × 340 px · 48 KB"}
                  </div>
                  <div className="mt-2.5 flex gap-2">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept=".png,.svg,.jpg,.jpeg"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0]
                          if (f) selecionarLogo(f)
                        }}
                      />
                      <span className="inline-block cursor-pointer rounded-sm border border-tint-royal-border bg-tint-royal-bg px-3 py-1.25 text-sm font-semibold text-royal">
                        Substituir
                      </span>
                    </label>
                    <Button variant="secondary" size="sm" onClick={removerLogo}>
                      Remover
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <label className="block cursor-pointer">
                <input
                  type="file"
                  accept=".png,.svg,.jpg,.jpeg"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) selecionarLogo(f)
                  }}
                />
                <div className="rounded-md border-2 border-dashed border-text-faint bg-surface-upload px-5 py-4.5 text-center transition-colors">
                  <span className="mx-auto mb-2 block w-5 text-text-muted">
                    <IconUpload size={20} strokeWidth={1.5} />
                  </span>
                  <p className="m-0 text-base text-text-3">Clique para selecionar ou arraste o logotipo aqui</p>
                  <p className="mt-1 mb-0 text-xs text-text-muted">PNG, SVG, JPG, JPEG</p>
                </div>
              </label>
            )}
          </SectionBlock>

          <SectionBlock
            title="Documentos Timbrados"
            hint="Quando ativado, todos os documentos gerados incluirão o brasão, o cabeçalho e o rodapé configurados. Caso desativado, os documentos serão gerados sem timbre."
          >
            <div className="flex items-center gap-3.5">
              <Toggle checked={timbrado} onChange={setTimbrado} label="Documentos timbrados" />
              <div>
                <div className="text-base font-semibold text-text-2">
                  {timbrado ? "Documentos timbrados ativados" : "Documentos sem timbre"}
                </div>
                <div className="mt-0.5 text-sm text-text-muted">
                  {timbrado
                    ? "ETP, TR, Cotação e demais documentos incluirão o brasão e identificação do órgão."
                    : "Documentos serão gerados com cabeçalho e rodapé em branco."}
                </div>
              </div>
            </div>

            {timbrado && !logoFile && (
              <InfoBanner tone="warning" className="mt-3.5">
                Nenhum logotipo configurado. O cabeçalho será gerado apenas com o texto institucional.
              </InfoBanner>
            )}
          </SectionBlock>

          <div className="flex gap-2.5">
            <Button
              disabled={atualizar.isPending}
              onClick={() => salvarTenant({ logoArquivo: logoFile, logoDataUrl, timbrado }, "Configurações de identidade salvas com sucesso.")}
            >
              {atualizar.isPending ? "Salvando..." : "Salvar Configurações"}
            </Button>
          </div>
          </div>

          <PreviewDocumento logoDataUrl={logoDataUrl} cabecalho={cabecalho} rodape={rodape} timbrado={timbrado} />
        </div>
      )}

      {/* ── Cabeçalho e Rodapé ── */}
      {activeTab === "cabecalho" && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="flex flex-col gap-5">
            <SectionBlock
              title="Cabeçalho dos Documentos"
              hint="Texto exibido no topo de cada página dos documentos gerados. Use quebras de linha para organizar as informações. Variáveis disponíveis: {processo}, {data}, {secretaria}."
            >
              <Textarea value={cabecalho} onChange={(e) => setCabecalho(e.target.value)} rows={4} />
            </SectionBlock>

            <SectionBlock
              title="Rodapé dos Documentos"
              hint="Texto exibido na parte inferior de cada página. Variáveis disponíveis: {processo}, {data}, {numero}, {pagina}."
            >
              <Textarea value={rodape} onChange={(e) => setRodape(e.target.value)} rows={3} />
            </SectionBlock>

            <div className="flex gap-2.5">
              <Button
                disabled={atualizar.isPending}
                onClick={() => salvarTenant({ cabecalho, rodape }, "Cabeçalho e rodapé salvos com sucesso.")}
              >
                {atualizar.isPending ? "Salvando..." : "Salvar Cabeçalho e Rodapé"}
              </Button>
            </div>
          </div>

          <PreviewDocumento logoDataUrl={logoDataUrl} cabecalho={cabecalho} rodape={rodape} timbrado={timbrado} />
        </div>
      )}

      {/* ── Secretarias (CRUD local) ── */}
      {activeTab === "secretarias" && (
        <SectionBlock
          title="Secretarias do Órgão"
          hint="As secretarias cadastradas aqui aparecem como opções de Secretaria Requisitante na criação de novos processos."
        >
          <div className="mb-4 flex flex-wrap gap-2.5">
            <div className="flex-[1_1_220px]">
              <Input
                value={novaSecretaria}
                onChange={(e) => setNovaSecretaria(e.target.value)}
                placeholder="Ex: Secretaria de Cultura e Turismo"
              />
            </div>
            <Button icon={<IconPlus size={14} strokeWidth={2.5} />} disabled={novaSecretaria.trim() === ""} onClick={addSecretaria} className="h-9.5">
              Adicionar Secretaria
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {secretarias.map((s) => (
              <div key={s.id} className="flex items-center gap-3 rounded-md border border-border-soft px-3 py-2.5">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-sm bg-tint-royal-bg text-royal">
                  <IconFile size={14} />
                </span>
                <span className="flex-1 truncate text-base font-medium text-text-1">{s.nome}</span>
                <button
                  type="button"
                  aria-label={`Remover ${s.nome}`}
                  onClick={() => removeSecretaria(s.id)}
                  className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-sm border border-border bg-ice text-text-3"
                >
                  <IconTrash size={13} />
                </button>
              </div>
            ))}
          </div>
        </SectionBlock>
      )}

      {/* ── PCA ── */}
      {activeTab === "pca" && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="flex flex-col gap-5">
          <SectionBlock
            title="PCA do Ano Vigente"
            hint="Anexe o PCA aprovado para o ano corrente. Formatos aceitos: PDF, XLSX, DOCX. O arquivo será utilizado como referência durante a geração dos documentos."
          >
            <div className="mb-4 flex gap-4">
              <FormField label="Ano de Referência">
                <Select value={pcaYear} onChange={(e) => setPcaYear(e.target.value)} className="w-30">
                  {["2023", "2024", "2025", "2026"].map((y) => (
                    <option key={y}>{y}</option>
                  ))}
                </Select>
              </FormField>
            </div>

            {pcaFile ? (
              <div>
                <div className="mb-3 flex items-center gap-3 rounded-xl border border-border bg-ice px-4 py-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-tint-royal-bg text-royal">
                    <IconFile size={18} />
                  </span>
                  <span className="block flex-1">
                    <span className="block text-base font-semibold text-text-1">{pcaFile}</span>
                    <span className="mt-0.5 block text-xs text-text-muted">PCA {pcaYear} · Importado em 09/07/2025</span>
                  </span>
                  <Tag tone="success">Ativo</Tag>
                </div>

                <InfoBanner tone="success" icon={<IconCheck size={14} strokeWidth={2.5} />}>
                  <strong>PCA carregado com sucesso.</strong> {tenant.data.pca.itensIndexados} itens de contratação indexados. O modelo utilizará este PCA como referência nos processos de {pcaYear}.
                </InfoBanner>

                <div className="mt-3 flex gap-2">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf,.xlsx,.docx"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0]
                        if (f) setPcaFile(f.name)
                      }}
                    />
                    <span className="inline-block cursor-pointer rounded-[7px] border border-tint-royal-border bg-tint-royal-bg px-3.5 py-1.5 text-sm font-semibold text-royal">
                      Substituir arquivo
                    </span>
                  </label>
                  <Button variant="secondary" size="sm" onClick={() => setPcaFile(null)}>
                    Remover PCA
                  </Button>
                </div>
              </div>
            ) : (
              <FileUpload
                file={null}
                onChange={setPcaFile}
                placeholder="Clique para selecionar o PCA ou arraste o arquivo aqui"
                accept=".pdf,.xlsx,.docx"
              />
            )}
          </SectionBlock>

          <div className="flex gap-2.5">
            <Button
              disabled={!pcaFile || atualizar.isPending}
              onClick={() =>
                salvarTenant(
                  { pca: { ano: pcaYear, arquivo: pcaFile, itensIndexados: tenant.data.pca.itensIndexados } },
                  "PCA salvo — o modelo o utilizará como referência."
                )
              }
            >
              {atualizar.isPending ? "Salvando..." : "Salvar PCA"}
            </Button>
          </div>
          </div>

          <div className="lg:sticky lg:top-4">
            <InfoBanner tone="info">
              O <strong>Plano de Contratações Anual (PCA)</strong> é utilizado pelo modelo de IA para validar se o processo em elaboração está previsto no planejamento vigente, sugerindo o item correspondente e auxiliando no preenchimento do ETP.
            </InfoBanner>
          </div>
        </div>
      )}

      {/* ── Usuários ── */}
      {activeTab === "usuarios" && (
        <div className="overflow-hidden rounded-card border border-border bg-surface">
          <div className="flex items-center justify-between border-b border-border-soft px-5 py-4">
            <h3 className="m-0 font-display text-lg font-bold text-text-1">Servidores com Acesso</h3>
            <Button size="sm" icon={<IconPlus size={13} strokeWidth={2.5} />} onClick={() => showToast("Convite de servidores disponível na integração com o backend.")}>
              Convidar Servidor
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr className="border-b border-border bg-ice">
                  {["Servidor", "Cargo", "Perfil de Acesso", "Último Acesso", ""].map((h, i) => (
                    <Th key={h === "" ? `vazio-${i}` : h}>{h}</Th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tenant.data.usuarios.map((u, idx) => (
                  <tr key={u.nome} className="border-b border-ice">
                    <td className="px-4 py-3.25">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`flex size-7.5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-surface ${avatarCores[idx % 4]}`}
                        >
                          {u.iniciais}
                        </span>
                        <span className="text-base font-semibold text-text-1">{u.nome}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.25 text-sm text-text-3">{u.cargo}</td>
                    <td className="px-4 py-3.25">
                      <Tag tone={u.perfil === "Administrador" ? "warning" : u.perfil === "Aprovador" ? "success" : "neutral"}>
                        {u.perfil}
                      </Tag>
                    </td>
                    <td className="px-4 py-3.25 text-sm text-text-muted">{u.ultimoAcesso}</td>
                    <td className="px-4 py-3.25">
                      <button
                        type="button"
                        onClick={() => showToast("Edição de permissões disponível na integração com o backend.")}
                        className="cursor-pointer border-0 bg-transparent text-sm text-text-3"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
