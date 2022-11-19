import { isNil } from "lodash"
import { C, fromHex, Lucid, WalletApi } from "lucid-cardano"
import { useCallback, useEffect, useRef, useState } from "react"

const useAccount = (lucid?: Lucid, walletApi?: WalletApi) => {
  const interval = useRef<ReturnType<typeof setInterval>>()

  const [addressLoaded, setAddressLoaded] = useState(false)
  const [address, setAddress] = useState<string | null>()

  const [unusedAddressLoaded, setUnusedAddressLoaded] = useState(false)
  const [unusedAddress, setUnusedAddress] = useState<string | null>()

  const [rewardAddressLoaded, setRewardAddressLoaded] = useState(false)
  const [rewardAddress, setRewardAddress] = useState<string | null>()

  const updateAddresses = useCallback(() => {
    if (!lucid || !walletApi) return

    setAddressLoaded(false)
    setUnusedAddressLoaded(false)
    setRewardAddressLoaded(false)

    walletApi
      .getUsedAddresses()
      .then((usedAddresses) => {
        setAddress(C.Address.from_bytes(fromHex(usedAddresses[0])).to_bech32(undefined))
      })
      .catch(() => setAddress(null))
      .finally(() => setAddressLoaded(true))

    walletApi
      .getUnusedAddresses()
      .then((unusedAddresses) => {
        setUnusedAddress(C.Address.from_bytes(fromHex(unusedAddresses[0])).to_bech32(undefined))
      })
      .catch(() => setUnusedAddress(null))
      .finally(() => setUnusedAddressLoaded(true))

    lucid.wallet
      .rewardAddress()
      .then((rewardAddress) => {
        setRewardAddress(rewardAddress)
      })
      .catch(() => setRewardAddress(null))
      .finally(() => setRewardAddressLoaded(true))
  }, [lucid, walletApi])

  useEffect(() => {
    updateAddresses()
  }, [lucid, walletApi, updateAddresses])

  useEffect(() => {
    if (!walletApi) return

    updateAddresses()

    if (!isNil(walletApi.experimental?.on))
      walletApi.experimental.on("accountChange", updateAddresses)
    else {
      if (interval.current) clearInterval(interval.current)

      interval.current = setInterval(() => {
        // TODO, this isn't really working well, need to figure out a better way to do this
      }, 1000) // TODO, what is a meaningful interval rate?
    }

    return () => {
      if (!isNil(walletApi.experimental?.off))
        walletApi.experimental.off("accountChange", updateAddresses)
      else {
        if (interval.current) clearInterval(interval.current)
      }
    }
  }, [walletApi, lucid])

  const loaded = addressLoaded && unusedAddressLoaded && rewardAddressLoaded

  if (!loaded)
    return {
      loaded,
      address: null,
      unusedAddress: null,
      rewardAddress: null,
    }

  return {
    loaded,
    address,
    unusedAddress,
    rewardAddress,
  }
}

export { useAccount }
