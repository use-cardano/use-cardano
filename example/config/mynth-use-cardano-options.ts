import { UseCardanoOptions } from "mynth-use-cardano"

export const options: UseCardanoOptions = {
  node: {
    provider: "blockfrost-proxy",
    proxyUrl: "/api/blockfrost",
  },
  walletconnect: {
    name: 'Mynth web dApp',
    description: 'Mynth web dApp',
    projectId: "",
    url: "http://localhost:3000",
    qrcode: true,
    icons: ['https://avatars.githubusercontent.com/u/37784886']
  }
}
