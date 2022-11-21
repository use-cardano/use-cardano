import { WalletProvider } from "hooks/use-cardano"
import { isNil } from "lodash"
import { WalletApi } from "lucid-cardano"
import { useEffect, useState } from "react"
import { noLiveNetworkChangeWarning, UseCardanoWarning } from "warnings"

const useNetworkId = (walletApi?: WalletApi, currentWalletProvider?: WalletProvider) => {
  const [warning, setWarning] = useState<UseCardanoWarning>()
  const [networkId, setNetworkId] = useState<number>()

  const onNetworkChange = (newNetworkId: unknown) => {
    if (typeof newNetworkId === "number") setNetworkId(newNetworkId)
    else if (typeof newNetworkId === "string") setNetworkId(parseInt(newNetworkId))
  }

  useEffect(() => {
    if (!walletApi) return

    walletApi.getNetworkId().then(onNetworkChange)

    if (!isNil(walletApi.experimental?.on)) {
      walletApi.experimental.on("networkChange", onNetworkChange)
      setWarning(undefined)
    } else setWarning(noLiveNetworkChangeWarning)

    return () => {
      if (!isNil(walletApi.experimental?.off))
        walletApi.experimental.off("networkChange", onNetworkChange)
    }
  }, [walletApi])

  return {
    warning,
    networkId,
  }
}

export { useNetworkId }
