import { WalletProvider } from "hooks/use-cardano"
import { isNil } from "lodash"
import { WalletApi } from "lucid-cardano"
import { useEffect, useRef, useState } from "react"

const useNetworkId = (walletApi?: WalletApi, currentWalletProvider?: WalletProvider) => {
  const interval = useRef<ReturnType<typeof setInterval>>()
  const [networkId, setNetworkId] = useState<number>()

  const onNetworkChange = (newNetworkId: unknown) => {
    if (typeof newNetworkId === "number") setNetworkId(newNetworkId)
    else if (typeof newNetworkId === "string") setNetworkId(parseInt(newNetworkId))
  }

  useEffect(() => {
    if (!walletApi) return

    walletApi.getNetworkId().then(onNetworkChange)

    if (!isNil(walletApi.experimental?.on))
      walletApi.experimental.on("networkChange", onNetworkChange)
    else {
      if (interval.current) clearInterval(interval.current)

      interval.current = setInterval(() => {
        walletApi.getNetworkId().then(onNetworkChange)
      }, 1000) // TODO, what is a meaningful interval rate?
    }

    return () => {
      if (!isNil(walletApi.experimental?.off))
        walletApi.experimental.off("networkChange", onNetworkChange)
      else {
        if (interval.current) clearInterval(interval.current)
      }
    }
  }, [walletApi, currentWalletProvider])

  return networkId
}

export { useNetworkId }
