/**
 * Navy app sidebar (240px): brand chip, órgão switcher, nav sections, user row.
 * @startingPoint section="App Chrome" subtitle="240px navy sidebar with órgão switcher and nav" viewport="240x700"
 */
export interface SidebarProps {
  /** Active nav key, e.g. "dashboard". "etp-form" highlights Processos. */
  currentView?: string;
  navigate?: (view: string) => void;
  items?: { view: string; label: string; badge?: number }[];
  bottomItems?: { view: string; label: string }[];
  orgName?: string;
  orgUnit?: string;
  userName?: string;
  userRole?: string;
  userInitials?: string;
}
