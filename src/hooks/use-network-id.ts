import { WalletProvider } from "hooks/use-cardano"
import { isNil } from "lodash"
import { WalletApi } from "lucid-cardano"
import { useEffect, useState } from "react"
import { UseCardanoWarning } from "warnings"

const useNetworkId = (walletApi?: WalletApi, currentWalletProvider?: WalletProvider) => {
  const [warning, setWarning] = useState<UseCardanoWarning>()
  const [networkId, setNetworkId] = useState<number>()

  const onNetworkChange = (newNetworkId: unknown) => {
    if (typeof newNetworkId === "number") setNetworkId(newNetworkId)
    else if (typeof newNetworkId === "string") setNetworkId(parseInt(newNetworkId))
  }

  useEffect(() => {
    if (!walletApi) return

    walletApi.getNetworkId().then((newNetworkId) => {
      onNetworkChange(newNetworkId)

      const listenersAvailable = isNil(walletApi.experimental?.on)

      setWarning(
        listenersAvailable
          ? undefined
          : {
              type: "NO_LIVE_NETWORK_CHANGE",
              message: `Live network change is not supported`,
            }
      )

      if (listenersAvailable) walletApi.experimental.on("networkChange", onNetworkChange)
    })

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