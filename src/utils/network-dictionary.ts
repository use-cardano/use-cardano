export const toNetworkId = (network: string) => {
  switch (network) {
    case "testnet":
      return 0
    case "mainnet":
    default:
      return 1
  }
}

export const toNetworkName = (id: number) => {
  switch (id) {
    case 0:
      return "testnet"
    case 1:
    default:
      return "mainnet"
  }
}
