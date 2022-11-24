import { useCardanoContext } from "contexts/use-cardano-context"
import { noLiveNetworkChangeWarning } from "lib/warnings"
import { isNil } from "lodash"
import { WalletApi } from "lucid-cardano"
import { useEffect } from "react"

const useNetworkId = (walletApi?: WalletApi) => {
  const { setNetworkId, setNetworkWarning } = useCardanoContext()

  const onNetworkChange = (newNetworkId: unknown) => {
    if (typeof newNetworkId === "number") setNetworkId(newNetworkId)
    else if (typeof newNetworkId === "string") setNetworkId(parseInt(newNetworkId))
  }

  useEffect(() => {
    if (!walletApi) return

    walletApi.getNetworkId().then(onNetworkChange)

    const hasEventListener =
      !isNil(walletApi.experimental?.on) && !isNil(walletApi.experimental?.off)

    setNetworkWarning(hasEventListener ? undefined : noLiveNetworkChangeWarning)

    if (hasEventListener) walletApi.experimental.on("networkChange", onNetworkChange)

    return () => {
      if (hasEventListener) walletApi.experimental.off("networkChange", onNetworkChange)
    }
  }, [walletApi])
}

export { useNetworkId }
