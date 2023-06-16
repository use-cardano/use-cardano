import { WalletProvider } from "mynth-use-cardano"

const key = "mynth-use-cardano/reconnect-to"

export const setStoredWalletProvider = (provider?: WalletProvider) => {
  if (!provider) return localStorage.removeItem(key)

  return localStorage.setItem(key, provider)
}

export const getStoredWalletProvider = () => localStorage.getItem(key) as WalletProvider
