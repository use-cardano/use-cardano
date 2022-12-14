import { WalletProvider } from "use-cardano"

export const getText = (provider: WalletProvider) => `Connected to ${provider}`

export const getInfo = (provider: WalletProvider) =>
  provider === "nami"
    ? "Live account and network changes are supported."
    : `Live account and network changes are not supported. After changing account or network in the wallet extension, refresh the page.`
