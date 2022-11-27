import { useCardanoContext } from "contexts/use-cardano-context"
import { UseCardanoError } from "lib/errors"
import { getInfo, getText } from "lib/get-toaster-texts"
import { isNil } from "lodash"
import { WalletApi } from "lucid-cardano"
import { useEffect, useState } from "react"

const useWalletApi = () => {
  const { walletProvider, setWalletApiError, setWalletApiLoading, showToaster } =
    useCardanoContext()

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
        setWalletApiLoading(false)

        // Note, at least Nami uses a code for different type of errors
        if (!isNil(e.code)) {
          switch (e.code) {
            case -3: // user rejected request to connect wallet
              setWalletApiError(
                new UseCardanoError("USER_REJECTED", "Request to connect wallet rejected.")
              )
              break
          }

          return
        }

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
      .finally(() => {
        const text = getText(walletProvider)
        const info = getInfo(walletProvider)

        showToaster(text, info)
      })
  }, [walletProvider])

  return { walletApi }
}

export { useWalletApi }
