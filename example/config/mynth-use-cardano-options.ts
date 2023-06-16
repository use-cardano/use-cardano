import { UseCardanoOptions } from "mynth-use-cardano"

export const options: UseCardanoOptions = {
  node: {
    provider: "blockfrost-proxy",
    proxyUrl: "/api/blockfrost",
  },
}
