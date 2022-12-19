import { TestnetNetwork } from "use-cardano"

export const toNetworkId = (network: string) => {
  switch (network) {
    case "Testnet":
    case "Preview":
    case "Preprod":
      return 0
    case "Mainnet":
    default:
      return 1
  }
}

export const toNetworkName = (id: number, TestnetNetwork: TestnetNetwork) => {
  switch (id) {
    case 0:
      return TestnetNetwork
    case 1:
    default:
      return "Mainnet"
  }
}
