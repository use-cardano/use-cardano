import { useCardano } from "contexts/CardanoContext"
import { noAccountSetError, noDappError, unknownError, userRejectedError } from "lib/errors"
import { getInfo, getText } from "lib/get-toaster-texts"
import { setStoredWalletProvider } from "lib/local-storage"
import { isNil } from "lodash"
import { useEffect } from "react"

export const useWalletApi = (autoReconnect?: boolean) => {
  const {
    walletProvider,
    setWalletApiLoading,
    showToaster,
    setWalletApi,
    setWalletProvider,
    setWalletApiError,
    setNetworkWarning,
    setAccountWarning,
    setNetworkError,
    setAccountError,
  } = useCardano()

  useEffect(() => {
    if (!window.cardano) return
    if (!walletProvider) return

    if (!window.cardano[walletProvider]) {
      setWalletApiError(noDappError(walletProvider))
      return
    }

    setWalletApiError(undefined)

    window.cardano[walletProvider]
      .enable()
      .then((api) => {
        // Note, reset all errors and warnings when wallet is changed
        setNetworkWarning(undefined)
        setAccountWarning(undefined)
        setNetworkError(undefined)
        setAccountError(undefined)
        setWalletApiError(undefined)
        setWalletApi(api)
      })
      .catch((e) => {
        setWalletApi(undefined)
        setWalletProvider(undefined)
        if (autoReconnect) setStoredWalletProvider(undefined)
        setWalletApiLoading(false)

        if (!isNil(e.code)) {
          switch (e.code) {
            case -2: // user rejected request to connect wallet (Flint)
            case -3: // user rejected request to connect wallet (Nami)
              setWalletApiError(userRejectedError)
              break
          }

          return
        }

        if (e instanceof Error) {
          switch (e.message) {
            case "user reject":
              setWalletApiError(userRejectedError)
              break
            case "no account set":
              setWalletApiError(noAccountSetError(walletProvider))
              break
            default:
              setWalletApiError(unknownError(e))
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
}
