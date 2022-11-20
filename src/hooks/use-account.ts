import { isNil } from "lodash"
import { C, fromHex, WalletApi } from "lucid-cardano"
import { useCallback, useEffect, useState } from "react"

import { UseCardanoWarning } from "../warnings"

const useAccount = (walletApi?: WalletApi) => {
  const [warning, setWarning] = useState<UseCardanoWarning>()
  const [addressLoaded, setAddressLoaded] = useState(false)
  const [address, setAddress] = useState<string | null>()

  const [unusedAddressLoaded, setUnusedAddressLoaded] = useState(false)
  const [unusedAddress, setUnusedAddress] = useState<string | null>()

  const [rewardAddressLoaded, setRewardAddressLoaded] = useState(false)
  const [rewardAddress, setRewardAddress] = useState<string | null>()

  const updateAddresses = useCallback(() => {
    if (!walletApi) return

    walletApi
      .getUsedAddresses()
      .then((usedAddresses) => {
        if (usedAddresses.length > 0)
          setAddress(C.Address.from_bytes(fromHex(usedAddresses[0])).to_bech32(undefined))
        else setAddress(null)
      })
      .catch((e) => {
        if (process.env.NODE_ENV === "development") console.error(e)
        setAddress(null)
      })
      .finally(() => setAddressLoaded(true))

    walletApi
      .getUnusedAddresses()
      .then((unusedAddresses) => {
        if (unusedAddresses.length > 0)
          setUnusedAddress(C.Address.from_bytes(fromHex(unusedAddresses[0])).to_bech32(undefined))
        else setUnusedAddress(null)
      })
      .catch((e) => {
        if (process.env.NODE_ENV === "development") console.error(e)
        setUnusedAddress(null)
      })
      .finally(() => setUnusedAddressLoaded(true))

    walletApi
      .getRewardAddresses()
      .then((rewardAddresses) => {
        if (rewardAddresses.length > 0)
          setRewardAddress(C.Address.from_bytes(fromHex(rewardAddresses[0])).to_bech32(undefined))
        else setRewardAddress(null)
      })
      .catch((e) => {
        if (process.env.NODE_ENV === "development") console.error(e)
        setRewardAddress(null)
      })
      .finally(() => setRewardAddressLoaded(true))
  }, [walletApi])

  useEffect(() => {
    if (!walletApi) return

    updateAddresses()

    const listenersAvailable = isNil(walletApi.experimental?.on)

    setWarning(
      listenersAvailable
        ? undefined
        : {
            type: "NO_LIVE_ACCOUNT_CHANGE",
            message: `Live account change is not supported`,
          }
    )

    if (listenersAvailable) walletApi.experimental.on("accountChange", updateAddresses)

    return () => {
      if (!isNil(walletApi.experimental?.off))
        walletApi.experimental.off("accountChange", updateAddresses)
    }
  }, [walletApi, updateAddresses])

  const loaded = addressLoaded && unusedAddressLoaded && rewardAddressLoaded

  if (!loaded)
    return {
      loaded,
      warning,
      address: null,
      unusedAddress: null,
      rewardAddress: null,
    }

  return {
    loaded,
    warning,
    address,
    unusedAddress,
    rewardAddress,
  }
}

export { useAccount }
