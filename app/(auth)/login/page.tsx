"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button, FormField, Input, ValidationMsg } from "@/components/ui";
import { IconArrowRight, IconCheckCircle } from "@/components/ui/icons";
import { useLogin, useRecuperarSenha, useSessao } from "@/lib/api/hooks";
import { formatCPF } from "@/lib/auth/cpf";

/** Contas de demonstração (Fase 1 mockada). */
const DEMO = [
  {
    cpf: "111.111.111-11",
    label: "Administrador Geral",
    desc: "LAHHM · acesso total",
  },
  {
    cpf: "222.222.222-22",
    label: "Coordenador",
    desc: "Prefeitura de Ecoporanga",
  },
  {
    cpf: "333.333.333-33",
    label: "Servidor",
    desc: "Prefeitura de Ecoporanga",
  },
  {
    cpf: "444.444.444-44",
    label: "Coordenadora",
    desc: "Prefeitura de São Paulo",
  },
  { cpf: "555.555.555-55", label: "Servidor", desc: "Prefeitura de São Paulo" },
];

export default function Login() {
  const router = useRouter();
  const sessao = useSessao();
  const login = useLogin();
  const recuperar = useRecuperarSenha();

  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [modoRecuperar, setModoRecuperar] = useState(false);
  const [emailRecuperar, setEmailRecuperar] = useState("");
  const [recuperado, setRecuperado] = useState(false);

  // Já logado → vai direto para o app.
  if (sessao.isSuccess && sessao.data) {
    router.replace("/");
  }

  const entrar = () => {
    setErro("");
    login.mutate(
      { cpf, senha },
      {
        onSuccess: () => router.replace("/"),
        onError: (e) =>
          setErro(e instanceof Error ? e.message : "CPF ou senha inválidos."),
      },
    );
  };

  const preencherDemo = (cpfDemo: string) => {
    setCpf(cpfDemo);
    setSenha("geradocs123");
    setErro("");
  };

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-navy px-4 py-10">
      {/* Fundo institucional navy→petroleum, sem imagem (padrão flat do DS) */}
      <div
        className="pointer-events-none absolute inset-0 gradient-hero"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-1/4 left-1/2 size-[640px] -translate-x-1/2 rounded-full bg-royal/10 blur-3xl"
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Marca do produto */}
        <div className="mb-6 flex flex-col items-center text-center">
          <Image
            src="/geradocs-logo-white.png"
            alt="GeraDocs"
            width={52}
            height={55}
            priority
            className="object-contain"
          />
          <div className="mt-3 text-2xs font-semibold tracking-caps text-electric uppercase">
            Documentos de contratação pública, gerados com inteligência.
          </div>
        </div>

        {/* Card de login */}
        <div className="rounded-card border border-on-dark-border bg-surface p-6 sm:p-7">
          {!modoRecuperar ? (
            <>
              <h1 className="m-0 fmt-1 mb-5 ont-display text-lg font-extrabold tracking-tight text-text-1 text-center">
                Acesse sua conta
              </h1>

              <div className="flex flex-col gap-4">
                <FormField label="CPF">
                  <Input
                    value={cpf}
                    onChange={(e) => setCpf(formatCPF(e.target.value))}
                    onKeyDown={(e) => e.key === "Enter" && entrar()}
                    placeholder="000.000.000-00"
                    autoComplete="username"
                  />
                </FormField>
                <FormField label="Senha">
                  <Input
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && entrar()}
                    type="password"
                    placeholder="Sua senha"
                    autoComplete="current-password"
                  />
                </FormField>

                {erro && <ValidationMsg type="error" msg={erro} />}

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setModoRecuperar(true);
                      setErro("");
                      setRecuperado(false);
                    }}
                    className="cursor-pointer border-0 bg-transparent p-0 text-sm font-semibold text-royal"
                  >
                    Esqueci minha senha
                  </button>
                </div>

                <Button
                  size="lg"
                  className="w-full font-bold"
                  icon={<IconArrowRight size={15} strokeWidth={2.5} />}
                  disabled={
                    login.isPending || cpf.trim() === "" || senha === ""
                  }
                  onClick={entrar}
                >
                  {login.isPending ? "Entrando..." : "Entrar"}
                </Button>
              </div>

              {/* Acessos de demonstração (fase mockada) */}
              <div className="mt-6 border-t border-border-soft pt-4">
                <div className="mb-2 text-2xs font-semibold tracking-caps text-text-muted uppercase">
                  Acessos de demonstração · senha geradocs123
                </div>
                <div className="flex flex-col gap-1.5">
                  {DEMO.map((d) => (
                    <button
                      key={d.cpf}
                      type="button"
                      onClick={() => preencherDemo(d.cpf)}
                      className="flex items-center justify-between gap-2 rounded-md border border-border bg-ice px-3 py-2 text-left transition-colors hover:bg-surface"
                    >
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-text-2">
                          {d.label}
                        </span>
                        <span className="block text-xs text-text-muted">
                          {d.desc}
                        </span>
                      </span>
                      <span className="shrink-0 font-mono text-xs text-text-3">
                        {d.cpf}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : recuperado ? (
            <div className="flex flex-col items-center py-4 text-center">
              <span className="flex text-success">
                <IconCheckCircle size={40} strokeWidth={2} />
              </span>
              <h1 className="m-0 mt-3 font-display text-lg font-extrabold text-text-1">
                Verifique seu e-mail
              </h1>
              <p className="m-0 mt-1 mb-5 text-sm text-text-3">
                Se houver uma conta associada, enviamos as instruções para
                redefinir a senha.
              </p>
              <Button
                variant="secondary"
                onClick={() => setModoRecuperar(false)}
              >
                Voltar ao login
              </Button>
            </div>
          ) : (
            <>
              <h1 className="m-0 font-display text-lg font-extrabold tracking-tight text-text-1">
                Recuperar senha
              </h1>
              <p className="m-0 mt-1 mb-5 text-sm text-text-3">
                Informe o e-mail cadastrado e enviaremos as instruções de
                redefinição.
              </p>
              <div className="flex flex-col gap-4">
                <FormField label="E-mail">
                  <Input
                    value={emailRecuperar}
                    onChange={(e) => setEmailRecuperar(e.target.value)}
                    type="email"
                    placeholder="seu.email@prefeitura.gov.br"
                    autoComplete="email"
                  />
                </FormField>
                <Button
                  size="lg"
                  className="w-full font-bold"
                  disabled={recuperar.isPending || emailRecuperar.trim() === ""}
                  onClick={() =>
                    recuperar.mutate(emailRecuperar, {
                      onSuccess: () => setRecuperado(true),
                    })
                  }
                >
                  {recuperar.isPending ? "Enviando..." : "Enviar instruções"}
                </Button>
                <button
                  type="button"
                  onClick={() => setModoRecuperar(false)}
                  className="cursor-pointer border-0 bg-transparent p-0 text-sm font-semibold text-royal"
                >
                  ← Voltar ao login
                </button>
              </div>
            </>
          )}
        </div>

        {/* Crédito LAHHM */}
        <div className="mt-6 flex flex-col items-center gap-1.5 text-center">
          <div className="flex items-center gap-2 text-sm text-on-dark-55">
            GeraDocs é um produto
            <Image
              src="/lahhm-logo.png"
              alt="LAHHM"
              width={68}
              height={20}
              className="object-contain opacity-90"
            />
          </div>
          <div className="text-xs text-on-dark-40">
            Precisa de ajuda?{" "}
            <span className="text-on-dark-55">contato@lahhm.com.br</span>
          </div>
          <div className="text-xs text-on-dark-30">
            © 2026 LAHHM. Todos os direitos reservados.
          </div>
        </div>
      </div>
    </div>
  );
}
