import { useEffect, useState } from "react"

import { walletProvider } from "./use-cardano"

const useHasExtension = (walletProvider: walletProvider) => {
  const [hasExtension, setHasExtension] = useState<boolean>()

  useEffect(() => {
    // give the browser a chance to load the extension
    // and for it to inject itself into the window object
    const timeout = setTimeout(() => {
      if (!window.cardano) setHasExtension(false)
      else if (!window.cardano[walletProvider]) setHasExtension(false)
      else setHasExtension(true)
    }, 10)

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  return hasExtension
}

export { useHasExtension  }
