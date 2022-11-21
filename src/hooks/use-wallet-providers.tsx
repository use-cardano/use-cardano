import { WalletProviderSelector } from "components/WalletProviderSelector"
import { useCardanoContext } from "contexts/use-cardano-context"
import { useEffect, useMemo, useRef, useState } from "react"

import { WalletProvider } from "./use-cardano"

const supportedWalletProviders: WalletProvider[] = ["nami", "eternl", "gero", "flint"]

const getText = (provider: WalletProvider) => `Connected to the ${provider} wallet provider`

const getInfo = (provider: WalletProvider) =>
  provider === "nami"
    ? undefined
    : `Live account and network change is not supported with ${provider}. After changing account or network in the wallet extension, refresh the page.`

const useWalletProviders = (defaultWalletProvider?: WalletProvider) => {
  const timeout = useRef<NodeJS.Timeout>()
  const [loaded, setLoaded] = useState(false)
  const [availableProviders, setAvailableProviders] = useState<string[]>([])
  const [walletProvider, setWalletProvider] = useState<WalletProvider>()

  const context = useCardanoContext()

  const onWalletProviderChange = (provider: WalletProvider) => {
    setLoaded(false)
    setWalletProvider(provider)

    const text = getText(provider)
    const info = getInfo(provider)

    context.showToaster(text, info)

    if (timeout.current) clearTimeout(timeout.current)

    // give the selected wallets some time to load before enabling switching again
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
      const connectedProvider = providers.find(
        (w): w is WalletProvider => w === defaultWalletProvider
      )

      // todo, configure if auto the wallet provider should auto-(re)connect
      if (connectedProvider) {
        setWalletProvider(connectedProvider)

        const text = getText(connectedProvider)
        const info = getInfo(connectedProvider)

        context.showToaster(text, info)
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
    () => <WalletProviderSelector {...state} setCurrent={onWalletProviderChange} loaded={loaded} />,
    [state, setWalletProvider]
  )

  return {
    ...state,
    Selector,
  }
}

export { useWalletProviders }
