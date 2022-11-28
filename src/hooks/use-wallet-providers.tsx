import { useCardanoContext } from "contexts/use-cardano-context"
import { useEffect } from "react"

const useWalletProviders = () => {
  const { setAvailableProviders } = useCardanoContext()

  useEffect(() => {
    // give the browser a chance to load the extension and for it to inject itself into the window object
    const timeout = setTimeout(() => {
      if (!window.cardano) return

      const providers = Object.keys(window.cardano).filter(
        (key) => !(window.cardano[key] instanceof Function) && key !== "_events"
      )

      setAvailableProviders(providers)
    }, 10)

    return () => {
      clearTimeout(timeout)
    }
  }, [])
}

export { useWalletProviders }
