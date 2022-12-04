import { useCardanoContext } from "contexts/use-cardano-context"
import { WalletProvider } from "hooks/use-cardano"
import { filterAvailableProviders } from "lib/filter-available-providers"
import { getInfo, getText } from "lib/get-toaster-texts"
import { getStoredWalletProvider, setStoredWalletProvider } from "lib/local-storage"
import { isNil, uniqBy } from "lodash"
import { WalletApi } from "lucid-cardano"
import { useEffect } from "react"

export interface AvailableProvider {
  name: string
  icon: string
  version: string
  enable(): Promise<WalletApi>
  isEnabled(): Promise<boolean>
}

const useWalletProviders = (autoConnectTo?: WalletProvider, autoReconnect?: boolean) => {
  const { showToaster, setWalletProvider, setAvailableProviders } = useCardanoContext()

  useEffect(() => {
    // give the browser a chance to load the extension and for it to inject itself into the window object
    const timeout = setTimeout(() => {
      // local storage is not available in SSR
      if (typeof window === "undefined") return
      if (!window.cardano) return

      const providers = uniqBy(
        Object.keys(window.cardano)
          .map((key) => window.cardano[key])
          .filter(filterAvailableProviders),
        "name"
      )

      setAvailableProviders(providers)

      const providerToConnectTo = autoReconnect
        ? getStoredWalletProvider() || autoConnectTo
        : autoConnectTo

      // prompt the user to connect to a wallet provider at first visit
      if (providers.some((p) => p.name.toLowerCase() === providerToConnectTo)) {
        const connectedProvider = providers.find(
          (p) => p.name.toLowerCase() === providerToConnectTo
        )

        if (!connectedProvider) return

        const provider = connectedProvider.name.toLowerCase() as WalletProvider

        setWalletProvider(provider)
        if (autoReconnect) setStoredWalletProvider(provider)

        const text = getText(provider)
        const info = getInfo(provider)

        showToaster(text, info)
      }
    }, 10)

    return () => {
      clearTimeout(timeout)
    }
  }, [])
}

export { useWalletProviders }
