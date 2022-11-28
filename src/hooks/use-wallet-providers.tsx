import { useCardanoContext } from "contexts/use-cardano-context"
import { WalletProvider } from "hooks/use-cardano"
import { getInfo, getText } from "lib/get-toaster-texts"
import { getStoredWalletProvider, setStoredWalletProvider } from "lib/local-storage"
import { useEffect } from "react"

const useWalletProviders = (autoConnectTo?: WalletProvider, autoReconnect?: boolean) => {
  const { showToaster, setWalletProvider, setAvailableProviders } = useCardanoContext()

  useEffect(() => {
    // give the browser a chance to load the extension and for it to inject itself into the window object
    const timeout = setTimeout(() => {
      // local storage is not available in SSR
      if (typeof window === "undefined") return
      if (!window.cardano) return

      const providers = Object.keys(window.cardano).filter(
        (key) => !(window.cardano[key] instanceof Function) && key !== "_events"
      )

      setAvailableProviders(providers)

      const providerToConnectTo = autoReconnect
        ? getStoredWalletProvider() || autoConnectTo
        : autoConnectTo

      // prompt the user to connect to a wallet provider at first visit
      if (providerToConnectTo && providers.includes(providerToConnectTo)) {
        const connectedProvider = providers.find(
          (w): w is WalletProvider => w === providerToConnectTo
        )

        if (connectedProvider) {
          setWalletProvider(connectedProvider)
          if (autoReconnect) setStoredWalletProvider(connectedProvider)

          const text = getText(connectedProvider)
          const info = getInfo(connectedProvider)

          showToaster(text, info)
        }
      }
    }, 10)

    return () => {
      clearTimeout(timeout)
    }
  }, [])
}

export { useWalletProviders }
