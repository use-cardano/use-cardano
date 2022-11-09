import { WalletApi } from "lucid-cardano"
import { useEffect, useState } from "react"

const useNetworkId = (walletApi?: WalletApi) => {
  const [networkId, setNetworkId] = useState<number>()

  const onNetworkChange = (newNetworkId: unknown) => {
    setNetworkId(newNetworkId as number)
  }

  useEffect(() => {
    if (!walletApi) return

    walletApi.getNetworkId().then(setNetworkId)

    if (!walletApi.experimental) return

    if (walletApi.experimental.on) walletApi.experimental.on("networkChange", onNetworkChange)

    return () => {
      if (walletApi.experimental.off) walletApi.experimental.off("networkChange", onNetworkChange)
    }
  }, [walletApi])

  return networkId
}

export { useNetworkId }
