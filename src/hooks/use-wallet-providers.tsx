import { useCardano } from "contexts/CardanoContext"
import { filterAvailableProviders } from "lib/filter-available-providers"
import { getStoredWalletProvider, setStoredWalletProvider } from "lib/local-storage"
import { useEffect, useRef } from "react"
import { UseCardanoOptionsWithDefaults } from "use-cardano"

type Interval = ReturnType<typeof setInterval>

const useWalletProviders = (options: UseCardanoOptionsWithDefaults) => {
  const { autoConnectTo, autoReconnect } = options

  const interval = useRef<Interval>()

  const { setWalletApiLoading, setWalletProvider, setAvailableProviders, setIsInitialized } =
    useCardano()

  useEffect(() => {
    if (interval.current) clearInterval(interval.current)

    // give the browser a chance to load the extension and for it to inject itself into the window object
    interval.current = setInterval(() => {
      // local storage is not available in SSR
      if (typeof window === "undefined") return

      setIsInitialized(true)

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

        setWalletApiLoading(true)
        setWalletProvider(connectedProvider.key)

        if (autoReconnect) setStoredWalletProvider(connectedProvider.key)
        else setStoredWalletProvider(undefined)
      }
    }, 1)

    return () => {
      if (interval.current) clearInterval(interval.current)
    }
  }, [])
}

export { useWalletProviders }
