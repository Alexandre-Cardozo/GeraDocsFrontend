"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import {
  IconBuilding,
  IconCheckCircle,
  IconChevronDown,
  IconDashboard,
  IconDownload,
  IconFileText,
  IconMoreVertical,
  IconSettings,
} from "@/components/ds/icons";
import { useFilaAprovacoes, useUsuarioAtual } from "@/lib/api/hooks";

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
      className={`gd-nav-item${active ? " gd-nav-item--active" : ""}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        width: "100%",
        paddingBlock: 9,
        paddingInline: 10,
        borderRadius: "var(--radius-md)",
        background: active ? "var(--on-dark-active)" : "transparent",
        color: active ? "var(--on-dark-text)" : "var(--on-dark-text-55)",
        fontSize: 13,
        fontWeight: active ? 600 : 500,
        textAlign: "left",
        position: "relative",
        marginBottom: 2,
        textDecoration: "none",
      }}
    >
      {active && <span className="gd-active-bar" />}
      <span
        style={{
          color: active ? "var(--color-electric)" : "inherit",
          display: "flex",
        }}
      >
        {item.icon}
      </span>
      <span style={{ flex: 1 }}>{item.label}</span>
      {item.badge != null && item.badge > 0 && (
        <span
          style={{
            background: "var(--color-danger)",
            color: "var(--on-dark-text)",
            fontSize: 10,
            fontWeight: 700,
            borderRadius: "var(--radius-full)",
            paddingBlock: 1,
            paddingInline: 6,
            minWidth: 18,
            textAlign: "center",
          }}
        >
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
      style={{
        fontSize: 10,
        color: "var(--on-dark-text-30)",
        fontWeight: 600,
        letterSpacing: "var(--tracking-caps-wide)",
        textTransform: "uppercase",
        paddingBlock: 4,
        paddingInline: 8,
        marginBottom: 4,
        marginTop: top ? 0 : 16,
      }}
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
      className={`gd-on-dark gd-sidebar${aberta ? " gd-sidebar--open" : ""}`}
      style={{
        width: "var(--sidebar-width)",
        minWidth: "var(--sidebar-width)",
        background: "var(--surface-sidebar)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Logo — wordmark GeraDocs (correção 3.3.1): chip gradiente 34px + texto */}
      <div
        style={{
          paddingTop: 24,
          paddingInline: 20,
          paddingBottom: 20,
          borderBottom: "var(--border-on-dark)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              background: "var(--gradient-brand)",
              borderRadius: "var(--radius-md)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              color: "var(--on-dark-text)",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <polyline points="9 14 11 16 15 12" />
            </svg>
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 15,
                color: "var(--on-dark-text)",
                letterSpacing: "var(--tracking-heading)",
              }}
            >
              GeraDocs
            </div>
            <div
              style={{
                fontSize: 10,
                color: "var(--on-dark-text-40)",
                fontWeight: 500,
                letterSpacing: "var(--tracking-caps)",
                textTransform: "uppercase",
                marginTop: 1,
              }}
            >
              LAHHM · Gov
            </div>
          </div>
        </div>
      </div>

      {/* Órgão atual */}
      <div
        style={{
          paddingBlock: 14,
          paddingInline: 20,
          borderBottom: "var(--border-on-dark)",
        }}
      >
        <div
          style={{
            fontSize: 10,
            color: "var(--on-dark-text-35)",
            fontWeight: 600,
            letterSpacing: "var(--tracking-caps-wide)",
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          Órgão Atual
        </div>
        <button
          type="button"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "var(--on-dark-fill)",
            border: "none",
            borderRadius: "var(--radius-md)",
            paddingBlock: 8,
            paddingInline: 10,
            cursor: "pointer",
            width: "100%",
            textAlign: "left",
          }}
        >
          <span
            style={{
              width: 22,
              height: 22,
              background: "var(--on-dark-royal-chip)",
              borderRadius: 5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              color: "var(--color-electric)",
            }}
          >
            <IconBuilding size={12} strokeWidth={2.5} />
          </span>
          <span style={{ flex: 1, minWidth: 0, display: "block" }}>
            <span
              style={{
                display: "block",
                fontSize: 12,
                color: "var(--on-dark-text)",
                fontWeight: 600,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Pref. de São Paulo
            </span>
            <span
              style={{
                display: "block",
                fontSize: 10,
                color: "var(--on-dark-text-40)",
              }}
            >
              Secretaria de Compras
            </span>
          </span>
          <span style={{ display: "flex", color: "var(--on-dark-text-30)" }}>
            <IconChevronDown size={12} strokeWidth={2.5} />
          </span>
        </button>
      </div>

      {/* Navegação */}
      <nav style={{ flex: 1, padding: 12, overflowY: "auto" }}>
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
      <div
        style={{
          paddingBlock: 12,
          paddingInline: 16,
          borderTop: "var(--border-on-dark)",
        }}
      >
        <button
          type="button"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            cursor: "pointer",
            background: "none",
            border: "none",
            width: "100%",
            textAlign: "left",
            padding: 0,
          }}
        >
          <span
            style={{
              width: 34,
              height: 34,
              borderRadius: "var(--radius-full)",
              background: "var(--gradient-user)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 700,
              color: "var(--on-dark-text)",
              flexShrink: 0,
            }}
          >
            {usuario?.iniciais ?? "—"}
          </span>
          <span style={{ flex: 1, minWidth: 0, display: "block" }}>
            <span
              style={{
                display: "block",
                fontSize: 13,
                color: "var(--on-dark-text)",
                fontWeight: 600,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {usuario?.nome ?? "Carregando..."}
            </span>
            <span
              style={{
                display: "block",
                fontSize: 11,
                color: "var(--on-dark-text-40)",
              }}
            >
              {usuario?.descricao ?? ""}
            </span>
          </span>
          <span style={{ display: "flex", color: "var(--on-dark-text-30)" }}>
            <IconMoreVertical size={14} />
          </span>
        </button>
      </div>
    </aside>
  );
}
