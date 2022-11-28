import { useCardanoContext } from "contexts/use-cardano-context"
import { noAccountSetError, noDappError, unknownError, userRejectedError } from "lib/errors"
import { getInfo, getText } from "lib/get-toaster-texts"
import { isNil } from "lodash"
import { useEffect } from "react"

const useWalletApi = () => {
  const { walletProvider, setWalletApiError, setWalletApiLoading, showToaster, setWalletApi } =
    useCardanoContext()

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

export { useWalletApi }
