import { WalletProviderSelector } from "components/WalletProviderSelector"
import { useEffect, useMemo, useState } from "react"

import { WalletProvider } from "./use-cardano"

const supportedWalletProviders: WalletProvider[] = ["nami", "eternl", "ccvault", "yoroi"]

const useWalletProviders = (defaultWalletProvider?: WalletProvider) => {
  const [loaded, setLoaded] = useState(false)
  const [availableProviders, setAvailableProviders] = useState<string[]>([])
  const [walletProvider, setWalletProvider] = useState<WalletProvider>()

  useEffect(() => {
    // give the browser a chance to load the extension and for it to inject itself into the window object
    const timeout = setTimeout(() => {
      setLoaded(true)

      if (!window.cardano) return

      const providers = Object.keys(window.cardano).filter(
        (key) => !(window.cardano[key] instanceof Function) && key !== "_events"
      )

      setAvailableProviders(providers)
      const provider = providers.find((w) => w === defaultWalletProvider)

      if (provider) setWalletProvider(provider as WalletProvider)
    }, 10)

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  const state = {
    supported: supportedWalletProviders.sort(),
    available: availableProviders.sort(),
    current: walletProvider,
  }

  const Selector = useMemo(
    () => <WalletProviderSelector {...state} setCurrent={setWalletProvider} loaded={loaded} />,
    [state, setWalletProvider]
  )

  return {
    ...state,
    Selector,
  }
}

export { useWalletProviders }
