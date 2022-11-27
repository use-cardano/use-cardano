import { useCardanoContext } from "contexts/use-cardano-context"
import { UseCardanoError } from "lib/errors"
import { hexArrayToAddress } from "lib/hex-array-to-address"
import { noLiveAccountChangeWarning } from "lib/warnings"
import { isNil } from "lodash"
import { WalletApi } from "lucid-cardano"
import { useCallback, useEffect, useRef } from "react"

const useAccount = (walletApi?: WalletApi) => {
  const loadedTimeout = useRef<NodeJS.Timeout>()

  const { setAccount, setAccountLoaded, setAccountError, setAccountWarning, setWalletApiLoading } =
    useCardanoContext()

  const updateAddresses = useCallback(async () => {
    if (!walletApi) {
      setAccount({})

      return
    }

    try {
      const [address, unusedAddress, rewardAddress] = await Promise.all([
        walletApi.getUsedAddresses().then(hexArrayToAddress),
        walletApi.getUnusedAddresses().then(hexArrayToAddress),
        walletApi.getRewardAddresses().then(hexArrayToAddress),
      ])

      if (!address && !unusedAddress)
        setAccountError(
          new UseCardanoError(
            "INVALID_WALLET",
            "No addresses found in wallet. This is an unexpected error, please check your wallet."
          )
        )
      else setAccountError(undefined)

      setAccount({
        address: address || unusedAddress,
        rewardAddress,
      })
    } catch (e) {
      if (process.env.NODE_ENV === "development") console.error(e)

      if (e instanceof Error) setAccountError(new UseCardanoError("UNKNOWN", e.message))
    } finally {
      setAccountLoaded(true)

      // Note, this isn't the technically correct place to do this
      // but from a UI point of view, it makes sense to do it here
      setWalletApiLoading(false)
    }
  }, [walletApi])

  useEffect(() => {
    if (loadedTimeout.current) clearTimeout(loadedTimeout.current)

    // only set loaded if the provider change actually takes time
    loadedTimeout.current = setTimeout(() => setAccountLoaded(false), 250)

    updateAddresses().then(() => {
      // cancel loaded timeout if the provider change was quick enough
      if (loadedTimeout.current) clearTimeout(loadedTimeout.current)

      if (!walletApi) return

      if (!isNil(walletApi.experimental?.on)) {
        walletApi.experimental.on("networkChange", updateAddresses)
        walletApi.experimental.on("accountChange", updateAddresses)
        setAccountWarning(undefined)
      } else {
        setAccountWarning(noLiveAccountChangeWarning)
      }
    })

    return () => {
      if (!isNil(walletApi?.experimental?.off)) {
        walletApi?.experimental.off("networkChange", updateAddresses)
        walletApi?.experimental.off("accountChange", updateAddresses)
      }
    }
  }, [walletApi, updateAddresses])
}

export { useAccount }
