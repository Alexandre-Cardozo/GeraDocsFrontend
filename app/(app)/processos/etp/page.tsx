import { Suspense } from "react"

import RedirectEtp from "./RedirectEtp"

export default function Page() {
  return (
    <Suspense>
      <RedirectEtp />
    </Suspense>
  )
}
