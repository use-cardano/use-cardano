import { UseCardanoOptions } from "use-cardano"

export const baseConfig: UseCardanoOptions = {
  node: {
    provider: "blockfrost-proxy",
    proxyUrl: "/api/blockfrost",
  },
}
