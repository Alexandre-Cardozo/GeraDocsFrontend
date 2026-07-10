import { useState } from "react"
import Sidebar from "./components/Sidebar"
import Header from "./components/Header"
import Dashboard from "./views/Dashboard"
import ProcessList from "./views/ProcessList"
import NewProcess from "./views/NewProcess"
import ETPForm from "./views/ETPForm"
import Approvals from "./views/Approvals"
import Documents from "./views/Documents"
import Settings from "./views/Settings"
import DFDReview from "./views/DFDReview"

export type View = "dashboard" | "processes" | "new-process" | "etp-form" | "approvals" | "documents" | "settings" | "dfd-review"

export default function App() {
  const [currentView, setCurrentView] = useState<View>("dashboard")
  const [activeProcessId, setActiveProcessId] = useState<string | null>(null)

  const navigate = (view: View, processId?: string) => {
    setCurrentView(view)
    if (processId) setActiveProcessId(processId)
  }

  const viewTitles: Record<View, string> = {
    dashboard: "Dashboard",
    processes: "Processos de Contratação",
    "new-process": "Novo Processo",
    "etp-form": "Estudo Técnico Preliminar",
    approvals: "Aprovações",
    documents: "Documentos Gerados",
    settings: "Configurações da Prefeitura",
    "dfd-review": "Verificação do DFD pela IA",
  }

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#F8FAFC" }}>
      <Sidebar currentView={currentView} navigate={navigate} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Header title={viewTitles[currentView]} currentView={currentView} navigate={navigate} />
        <main style={{ flex: 1, overflowY: "auto", padding: "0" }}>
          {currentView === "dashboard" && <Dashboard navigate={navigate} />}
          {currentView === "processes" && <ProcessList navigate={navigate} />}
          {currentView === "new-process" && <NewProcess navigate={navigate} />}
          {currentView === "etp-form" && <ETPForm navigate={navigate} processId={activeProcessId} />}
          {currentView === "approvals" && <Approvals navigate={navigate} />}
          {currentView === "documents" && <Documents navigate={navigate} />}
          {currentView === "settings" && <Settings navigate={navigate} />}
          {currentView === "dfd-review" && <DFDReview navigate={navigate} processId={activeProcessId} />}
        </main>
      </div>
    </div>
  )
}
