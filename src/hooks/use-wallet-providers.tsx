import { useCardanoContext } from "contexts/use-cardano-context"
import { WalletProvider } from "hooks/use-cardano"
import { getInfo, getText } from "lib/get-toaster-texts"
import { useEffect } from "react"

const useWalletProviders = (defaultWalletProvider?: WalletProvider) => {
  const { showToaster, setWalletProvider, setAvailableProviders } = useCardanoContext()

  useEffect(() => {
    // give the browser a chance to load the extension and for it to inject itself into the window object
    const timeout = setTimeout(() => {
      if (!window.cardano) return

      const providers = Object.keys(window.cardano).filter(
        (key) => !(window.cardano[key] instanceof Function) && key !== "_events"
      )

      setAvailableProviders(providers)
      const connectedProvider = providers.find(
        (w): w is WalletProvider => w === defaultWalletProvider
      )

      // todo, configure if auto the wallet provider should auto-(re)connect
      if (connectedProvider) {
        setWalletProvider(connectedProvider)

        const text = getText(connectedProvider)
        const info = getInfo(connectedProvider)

        showToaster(text, info)
      }
    }, 10)

    return () => {
      clearTimeout(timeout)
    }
  }, [])
}

export { useWalletProviders }
