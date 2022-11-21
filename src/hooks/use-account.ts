import { isNil } from "lodash"
import { WalletApi } from "lucid-cardano"
import { useCallback, useEffect, useRef, useState } from "react"
import { hexArrayToAddress } from "lib/hex-array-to-address"

import { noLiveAccountChangeWarning, UseCardanoWarning } from "../warnings"

interface Account {
  address?: string | null
  unusedAddress?: string | null
  rewardAddress?: string | null
}

const useAccount = (walletApi?: WalletApi, networkId?: number) => {
  const loadedTimeout = useRef<NodeJS.Timeout>()

  const [account, setAccount] = useState<Account>({})
  const [warning, setWarning] = useState<UseCardanoWarning>()
  const [loaded, setLoaded] = useState(false)

  const updateAddresses = useCallback(async () => {
    if (!walletApi || isNil(networkId)) return

    try {
      const [address, unusedAddress, rewardAddress] = await Promise.all([
        walletApi.getUsedAddresses().then(hexArrayToAddress),
        walletApi.getUnusedAddresses().then(hexArrayToAddress),
        walletApi.getRewardAddresses().then(hexArrayToAddress),
      ])

      setAccount({
        address,
        unusedAddress,
        rewardAddress,
      })
    } catch (e) {
      if (process.env.NODE_ENV === "development") console.error(e)
    } finally {
      setLoaded(true)
    }
  }, [walletApi, networkId])

  useEffect(() => {
    if (!walletApi) return

    if (loadedTimeout.current) clearTimeout(loadedTimeout.current)

    // only set loaded if the provider change actually takes time
    loadedTimeout.current = setTimeout(() => setLoaded(false), 250)

    updateAddresses().then(() => {
      // cancel loaded timeout if the provider change was quick enough
      if (loadedTimeout.current) clearTimeout(loadedTimeout.current)

      if (!isNil(walletApi.experimental?.on)) {
        walletApi.experimental.on("accountChange", updateAddresses)
        setWarning(undefined)
      } else {
        setWarning(noLiveAccountChangeWarning)
      }
    })

    return () => {
      if (!isNil(walletApi.experimental?.off))
        walletApi.experimental.off("accountChange", updateAddresses)
    }
  }, [walletApi, networkId, updateAddresses])

  return {
    loaded,
    warning,
    ...account,
  }
}

export { useAccount }
