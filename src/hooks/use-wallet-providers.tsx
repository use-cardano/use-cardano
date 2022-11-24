import { WalletProviderSelector } from "components/WalletProviderSelector"
import { useCardanoContext } from "contexts/use-cardano-context"
import { useEffect, useMemo, useState } from "react"

import { WalletProvider } from "./use-cardano"

const supportedWalletProviders: WalletProvider[] = ["nami", "eternl", "gero", "flint"]

const getText = (provider: WalletProvider) => `Connected to the ${provider} wallet provider`

const getInfo = (provider: WalletProvider) =>
  provider === "nami"
    ? undefined
    : `Live account and network change is not supported with ${provider}. After changing account or network in the wallet extension, refresh the page.`

const useWalletProviders = (defaultWalletProvider?: WalletProvider) => {
  const [availableProviders, setAvailableProviders] = useState<string[]>([])
  const [walletProvider, setWalletProvider] = useState<WalletProvider>()

  const { showToaster, setWalletProviderLoading } = useCardanoContext()

  const onWalletProviderChange = (provider: WalletProvider) => {
    setWalletProviderLoading(true)
    setWalletProvider(provider)

    const text = getText(provider)
    const info = getInfo(provider)

    showToaster(text, info)
  }

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

  const state = {
    supported: supportedWalletProviders.sort(),
    available: availableProviders.sort(),
    current: walletProvider,
  }

  const Selector = useMemo(
    () => <WalletProviderSelector {...state} setCurrent={onWalletProviderChange} />,
    [state, setWalletProvider]
  )

  return {
    ...state,
    Selector,
  }
}

export { useWalletProviders }
