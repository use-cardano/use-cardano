import { useEffect, useState } from "react"

import { WalletProvider } from "./use-cardano"

const useWalletProviders = (walletProvider: WalletProvider) => {
  const [availableWalletProviders, setAvailableWalletProviders] = useState<string[]>([])
  const [currentProviderIsAvailable, setCurrentProviderIsAvailable] = useState<boolean>()

  useEffect(() => {
    // give the browser a chance to load the extension
    // and for it to inject itself into the window object
    const timeout = setTimeout(() => {
      if (!window.cardano) {
        setCurrentProviderIsAvailable(false)
        setAvailableWalletProviders([])
        return
      }

      setAvailableWalletProviders(
        Object.keys(window.cardano).filter((key) => !(window.cardano[key] instanceof Function))
      )

      if (!window.cardano[walletProvider]) setCurrentProviderIsAvailable(false)
      else setCurrentProviderIsAvailable(true)
    }, 10)

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  return {
    currentProviderIsAvailable,
    availableWalletProviders,
  }
}

export { useWalletProviders }
