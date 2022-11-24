import { useCardanoContext } from "contexts/use-cardano-context"
import { UseCardanoError } from "error"
import { WalletApi } from "lucid-cardano"
import { useEffect, useState } from "react"

import { WalletProvider } from "./use-cardano"

const useWalletApi = (walletProvider?: WalletProvider) => {
  const { setWalletApiError } = useCardanoContext()
  const [walletApi, setWalletApi] = useState<WalletApi>()

  useEffect(() => {
    if (!window.cardano) return
    if (!walletProvider) return

    if (!window.cardano[walletProvider]) {
      setWalletApiError(
        new UseCardanoError(
          "NO_DAPP_CONNECTOR",
          `Install the ${walletProvider} wallet provider to connect your wallet.`
        )
      )

      return
    }

    setWalletApiError(undefined)

    window.cardano[walletProvider]
      .enable()
      .then((api) => {
        setWalletApiError()
        setWalletApi(api)
      })
      .catch((e) => {
        setWalletApi(undefined)

        if (e instanceof Error) {
          switch (e.message) {
            case "user reject":
              setWalletApiError(
                new UseCardanoError("USER_REJECTED", "Request to connect wallet rejected.")
              )
              break
            case "no account set":
              setWalletApiError(
                new UseCardanoError(
                  "NO_ACCOUNT_SET",
                  `Make sure you have an account, and that it's connected in ${walletProvider}, then refresh the page.`
                )
              )
              break
            default:
              setWalletApiError(new UseCardanoError("UNKNOWN", e.message))
              break
          }
        }
      })
  }, [walletProvider])

  return { walletApi }
}

export { useWalletApi }
