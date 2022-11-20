import { WalletProviderSelector } from "components/WalletProviderSelector"
import { useEffect, useMemo, useRef, useState } from "react"

import { WalletProvider } from "./use-cardano"

const supportedWalletProviders: WalletProvider[] = ["nami", "eternl", "gero", "flint"]

const useWalletProviders = (defaultWalletProvider?: WalletProvider) => {
  const timeout = useRef<NodeJS.Timeout>()
  const [loaded, setLoaded] = useState(false)
  const [availableProviders, setAvailableProviders] = useState<string[]>([])
  const [walletProvider, setWalletProvider] = useState<WalletProvider>()

  const onWalletProviderChange = (provider: WalletProvider) => {
    setLoaded(false)

    setWalletProvider(provider)

    if (timeout.current) clearTimeout(timeout.current)

    // NOTE: Give the selected wallets some time to load before enabling switching again
    timeout.current = setTimeout(() => {
      setLoaded(true)
    }, 1500)
  }

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
    () => <WalletProviderSelector {...state} setCurrent={onWalletProviderChange} loaded={loaded} />,
    [state, setWalletProvider]
  )

  return {
    ...state,
    Selector,
  }
}

export { useWalletProviders }
