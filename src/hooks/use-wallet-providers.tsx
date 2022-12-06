import { useCardanoContext } from "contexts/use-cardano-context"
import { WalletProvider } from "hooks/use-cardano"
import { filterAvailableProviders } from "lib/filter-available-providers"
import { getInfo, getText } from "lib/get-toaster-texts"
import { getStoredWalletProvider, setStoredWalletProvider } from "lib/local-storage"
import { WalletApi } from "lucid-cardano"
import { useEffect, useRef } from "react"

export interface AvailableProvider {
  key: WalletProvider
  name: string
  icon: string
  version: string
  enable(): Promise<WalletApi>
  isEnabled(): Promise<boolean>
}

type Interval = ReturnType<typeof setInterval>

const useWalletProviders = (autoConnectTo?: WalletProvider, autoReconnect?: boolean) => {
  const interval = useRef<Interval>()

  const { showToaster, setWalletProvider, setAvailableProviders } = useCardanoContext()

  useEffect(() => {
    if (interval.current) clearInterval(interval.current)

    // give the browser a chance to load the extension and for it to inject itself into the window object
    interval.current = setInterval(() => {
      // local storage is not available in SSR
      if (typeof window === "undefined") return
      if (!window.cardano) return

      // clear the interval once the extension is injected
      clearInterval(interval.current)

      const providers = Object.keys(window.cardano)
        .map((key) => ({
          key,
          ...window.cardano[key],
        }))
        .filter(filterAvailableProviders)

      setAvailableProviders(providers)

      const providerToConnectTo = autoReconnect
        ? getStoredWalletProvider() || autoConnectTo
        : autoConnectTo

      // prompt the user to connect to a wallet provider at first visit
      if (providers.some((p) => p.key === providerToConnectTo)) {
        const connectedProvider = providers.find((p) => p.key === providerToConnectTo)

        if (!connectedProvider) return

        setWalletProvider(connectedProvider.key)
        if (autoReconnect) setStoredWalletProvider(connectedProvider.key)

        const text = getText(connectedProvider.key)
        const info = getInfo(connectedProvider.key)

        showToaster(text, info)
      }
    }, 1)

    return () => {
      if (interval.current) clearInterval(interval.current)
    }
  }, [])
}

export { useWalletProviders }
