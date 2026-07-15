import ClientPage from "./ClientPage"

export function generateStaticParams() {
  return [{ id: "1", tipo: "etp" }]
}

export default function Page() {
  return <ClientPage />
}
