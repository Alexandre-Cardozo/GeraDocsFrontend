"use client"

import Image from "next/image"
import { useState } from "react"

import { Button, Dropdown, FormField, Input, Tag } from "@/components/ui"
import { IconCamera } from "@/components/ui/icons"
import { LoadingState } from "@/components/shared/estados"
import { useToast } from "@/components/shared/providers"
import { useAtualizarAvatar, useAtualizarMeuPerfil, useSessao } from "@/lib/api/hooks"
import { formatCPF } from "@/lib/auth/cpf"
import { PERFIL_ACESSO_LABEL } from "@/lib/types"

export default function MeuPerfil() {
  const showToast = useToast()
  const sessao = useSessao()
  const salvar = useAtualizarMeuPerfil()
  const atualizarAvatar = useAtualizarAvatar()

  const usuario = sessao.data?.usuario
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [cargo, setCargo] = useState("")
  const [secretaria, setSecretaria] = useState("")
  const [sincronizado, setSincronizado] = useState(false)

  // Semeia os campos uma vez, quando a sessão chega.
  if (usuario && !sincronizado) {
    setNome(usuario.nome)
    setEmail(usuario.email)
    setCargo(usuario.cargo)
    setSecretaria(usuario.secretaria ?? "")
    setSincronizado(true)
  }

  if (sessao.isPending || !usuario) return <LoadingState label="Carregando perfil..." />

  const prefeitura = sessao.data?.prefeitura
  const secretarias = prefeitura?.secretarias ?? []

  const onFoto = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => atualizarAvatar.mutate(typeof reader.result === "string" ? reader.result : null)
    reader.readAsDataURL(file)
  }

  return (
    <div className="max-w-review p-4 sm:p-5 lg:p-7">
      <div className="mb-6">
        <h1 className="m-0 font-display text-2xl font-extrabold tracking-tight text-text-1">Meu Perfil</h1>
        <p className="m-0 mt-1 text-md text-text-3">Atualize seus dados de contato e sua foto.</p>
      </div>

      <div className="rounded-card border border-border bg-surface p-5 lg:p-6">
        {/* Cabeçalho — foto, nome, perfil e lotação */}
        <div className="mb-5 flex items-center gap-4 border-b border-border-soft pb-5">
          <label className="group relative size-16 shrink-0 cursor-pointer" title="Alterar foto de perfil">
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) onFoto(f) }}
            />
            {usuario.avatarDataUrl ? (
              <Image src={usuario.avatarDataUrl} alt="Foto de perfil" width={64} height={64} unoptimized className="size-16 rounded-full object-cover" />
            ) : (
              <span className="flex size-16 items-center justify-center rounded-full text-xl font-bold text-on-dark gradient-user">{usuario.iniciais}</span>
            )}
            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-navy/45 text-on-dark opacity-0 transition-opacity group-hover:opacity-100">
              <IconCamera size={18} />
            </span>
          </label>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-display text-lg font-bold text-text-1">{usuario.nome}</span>
              <Tag tone="info">{PERFIL_ACESSO_LABEL[usuario.perfilAcesso]}</Tag>
            </div>
            <p className="m-0 mt-0.5 text-sm text-text-3">
              {usuario.cargo || "Sem cargo definido"}
              {prefeitura ? ` · ${prefeitura.orgao}` : ""}
            </p>
            <p className="m-0 mt-1 text-xs text-text-muted">Clique na foto para alterar.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Nome Completo" required>
            <Input value={nome} onChange={(e) => setNome(e.target.value)} />
          </FormField>
          <FormField label="CPF" tip="O CPF não pode ser alterado.">
            <Input value={formatCPF(usuario.cpf)} disabled title="O CPF não pode ser alterado." />
          </FormField>
          <FormField label="E-mail" required>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
          </FormField>
          <FormField label="Cargo">
            <Input value={cargo} onChange={(e) => setCargo(e.target.value)} />
          </FormField>
          <FormField label="Secretaria">
            <Dropdown
              value={secretaria}
              onChange={setSecretaria}
              ariaLabel="Secretaria em que atua"
              options={[
                { value: "", label: "Nenhuma" },
                ...secretarias.map((s) => ({ value: s.nome, label: s.nome })),
              ]}
            />
          </FormField>
        </div>

        <div className="mt-5 flex justify-end border-t border-border-soft pt-5">
          <Button
            disabled={salvar.isPending || nome.trim() === "" || email.trim() === ""}
            onClick={() =>
              salvar.mutate(
                { nome, email, cargo, secretaria },
                { onSuccess: () => showToast("Perfil atualizado.") }
              )
            }
          >
            {salvar.isPending ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </div>
    </div>
  )
}
