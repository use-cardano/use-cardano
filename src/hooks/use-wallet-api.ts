import { WalletApi } from "lucid-cardano"
import { useEffect, useState } from "react"

type WalletApiName = "nami" | "eternl" | "ccvault"

const useWalletApi = (name: WalletApiName) => {
  const [walletApi, setWalletApi] = useState<WalletApi>()

  useEffect(() => {
    if (!window.cardano) return
    if (!window.cardano[name]) return

    window.cardano[name].enable().then(setWalletApi)
  }, [name])

  return walletApi
}

export { useWalletApi }
