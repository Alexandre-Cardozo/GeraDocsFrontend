import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/GeraDocsFrontend",
  images: {
    unoptimized: true,
  },
}

export default nextConfig
