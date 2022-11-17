import { UseCardanoError } from "error"
import { WalletApi } from "lucid-cardano"
import { useEffect, useState } from "react"

import { WalletProvider } from "./use-cardano"

const useWalletApi = (walletProvider?: WalletProvider) => {
  const [error, setError] = useState<UseCardanoError>()
  const [walletApi, setWalletApi] = useState<WalletApi>()

  useEffect(() => {
    if (!window.cardano) return
    if (!walletProvider) return

    if (!window.cardano[walletProvider]) {
      setError(
        new UseCardanoError(
          "NO_DAPP_CONNECTOR",
          `The user doesn't have the ${walletProvider} wallet provider installed.`
        )
      )

      return
    }

    setError(undefined)

    window.cardano[walletProvider]
      .enable()
      .then(setWalletApi)
      .catch((e) => {
        if (e instanceof Error) {
          if (e.message === "user reject")
            setError(
              new UseCardanoError(
                "USER_REJECTED",
                "The user rejected the request to connect their wallet."
              )
            )
          if (e.message === "no account set")
            setError(
              new UseCardanoError(
                "NO_ACCOUNT_SET",
                `The user doesn't have an account with the ${walletProvider} wallet provider.`
              )
            )
          else setError(new UseCardanoError("UNKNOWN", e.message))
        }
      })
  }, [walletProvider])

  return { walletApi, error }
}

export { useWalletApi }
