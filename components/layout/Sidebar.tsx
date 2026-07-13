"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import {
  IconBuilding,
  IconCheckCircle,
  IconDashboard,
  IconDownload,
  IconFileText,
  IconMoreVertical,
  IconSettings,
} from "@/components/ui/icons";
import {
  useConfigTenant,
  useFilaAprovacoes,
  useUsuarioAtual,
} from "@/lib/api/hooks";

interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
  badge?: number;
  /** Prefixos extras que mantêm o item ativo (ex.: /processos/... ). */
  match?: (pathname: string) => boolean;
}

function NavLink({
  item,
  active,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={`relative mb-0.5 flex w-full items-center gap-2.5 rounded-md px-2.5 py-2.25 text-left text-base no-underline transition-colors ${
        active
          ? "bg-on-dark-active font-semibold text-on-dark"
          : "font-medium text-on-dark-55 hover:bg-on-dark-fill hover:text-on-dark"
      }`}
    >
      {/* Barra ativa 3×20 electric à esquerda */}
      {active && (
        <span className="absolute top-1/2 left-0 h-5 w-0.75 -translate-y-1/2 rounded-r-[3px] bg-electric" />
      )}
      <span className={`flex ${active ? "text-electric" : "text-inherit"}`}>
        {item.icon}
      </span>
      <span className="flex-1">{item.label}</span>
      {item.badge != null && item.badge > 0 && (
        <span className="min-w-4.5 rounded-full bg-danger px-1.5 py-px text-center text-2xs font-bold text-on-dark">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

function SectionLabel({
  children,
  top,
}: {
  children: ReactNode;
  top?: boolean;
}) {
  return (
    <div
      className={`mb-1 px-2 py-1 text-2xs font-semibold tracking-caps-wide text-on-dark-30 uppercase ${top ? "mt-0" : "mt-4"}`}
    >
      {children}
    </div>
  );
}

export default function Sidebar({
  aberta = false,
  onNavigate,
}: {
  /** Drawer aberto (só tem efeito abaixo de 1024px; no laptop a sidebar é fixa). */
  aberta?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const { data: usuario } = useUsuarioAtual();
  const { data: fila } = useFilaAprovacoes();
  const { data: tenant } = useConfigTenant();

  const pendentes = fila?.filter((a) => a.status === "aguardando").length;

  const navItems: NavItem[] = [
    {
      href: "/",
      label: "Dashboard",
      icon: <IconDashboard size={18} />,
      match: (p) => p === "/",
    },
    {
      href: "/processos",
      label: "Processos",
      icon: <IconFileText size={18} />,
      match: (p) => p.startsWith("/processos"),
    },
    {
      href: "/aprovacoes",
      label: "Aprovações",
      icon: <IconCheckCircle size={18} />,
      badge: pendentes,
      match: (p) => p.startsWith("/aprovacoes"),
    },
    {
      href: "/documentos",
      label: "Documentos",
      icon: <IconDownload size={18} />,
      match: (p) => p.startsWith("/documentos"),
    },
  ];

  const bottomItems: NavItem[] = [
    {
      href: "/configuracoes",
      label: "Configurações",
      icon: <IconSettings size={18} />,
      match: (p) => p.startsWith("/configuracoes"),
    },
  ];

  return (
    <aside
      className={`on-dark fixed inset-y-0 left-0 z-60 flex h-full w-60 min-w-60 flex-col overflow-hidden bg-navy transition-transform duration-200 lg:static lg:translate-x-0 lg:transition-none ${
        aberta ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Logo GeraDocs — marca oficial (sem fundo) */}
      <div className="border-b border-on-dark-border px-5 pt-6 pb-5">
        <div className="flex items-center gap-2.5">
          <Image
            src="/geradocs-logo-white.png"
            alt="GeraDocs"
            width={34}
            height={36}
            priority
            className="shrink-0 object-contain"
          />
          <div>
            <div className="font-display text-lg font-bold tracking-heading text-on-dark">
              GeraDocs
            </div>
            <div className="mt-px text-2xs font-medium tracking-caps text-on-dark-40 uppercase">
              LAHHM · GOV
            </div>
          </div>
        </div>
      </div>

      {/* Órgão atual — apenas informativo; usa o brasão importado nas Configurações,
          senão mantém o ícone padrão do órgão */}
      <div className="border-b border-on-dark-border px-5 py-3.5">
        <div className="mb-1.5 text-2xs font-semibold tracking-caps-wide text-on-dark-35 uppercase">
          Órgão Atual
        </div>
        <div className="flex items-center gap-2 rounded-md">
          {tenant?.logoDataUrl ? (
            <Image
              src={tenant.logoDataUrl}
              alt=""
              width={22}
              height={22}
              unoptimized
              className="size-5.5 shrink-0 object-contain"
            />
          ) : (
            <span className="flex size-5.5 shrink-0 items-center justify-center rounded-[5px] bg-on-dark-royal-chip text-electric">
              <IconBuilding size={12} strokeWidth={2.5} />
            </span>
          )}
          <span className="block min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-on-dark">
              {tenant?.orgao ?? "Prefeitura de São Paulo"}
            </span>
            <span className="block text-2xs text-on-dark-40">
              {tenant?.unidade ?? "Secretaria de Compras"}
            </span>
          </span>
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex-1 overflow-y-auto p-3">
        <SectionLabel top>Principal</SectionLabel>
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={item.match ? item.match(pathname) : pathname === item.href}
            onNavigate={onNavigate}
          />
        ))}

        <SectionLabel>Sistema</SectionLabel>
        {bottomItems.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={item.match ? item.match(pathname) : pathname === item.href}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      {/* Usuário */}
      <div className="border-t border-on-dark-border px-4 py-3">
        <button
          type="button"
          className="flex w-full cursor-pointer items-center gap-2.5 border-0 bg-transparent p-0 text-left"
        >
          <span className="flex size-8.5 shrink-0 items-center justify-center rounded-full text-base font-bold text-on-dark gradient-user">
            {usuario?.iniciais ?? "—"}
          </span>
          <span className="block min-w-0 flex-1">
            <span className="block truncate text-base font-semibold text-on-dark">
              {usuario?.nome ?? "Carregando..."}
            </span>
            <span className="block text-xs text-on-dark-40">
              {usuario?.descricao ?? ""}
            </span>
          </span>
          <span className="flex text-on-dark-30">
            <IconMoreVertical size={14} />
          </span>
        </button>
      </div>
    </aside>
  );
}
