import { useCardano } from "contexts/CardanoContext"
import { disallowedNetworkError } from "lib/errors"
import { noLiveNetworkChangeWarning } from "lib/warnings"
import { isNil } from "lodash"
import { useCallback, useEffect } from "react"

export const useNetworkId = (allowedNetworks: number[]) => {
  const { setNetworkId, setNetworkWarning, setNetworkError, walletApi, showToaster } =
    useCardano()

  const onNetworkChange = useCallback(
    (id: unknown) => {
      const networkId = id === "string" ? parseInt(id) : (id as number)

      // NOTE: We don't want to unset network id, since that would have cascading effects
      if (!allowedNetworks.includes(networkId))
        setNetworkError(disallowedNetworkError(allowedNetworks, networkId))
      else setNetworkError(undefined)

      setNetworkId(networkId)
      showToaster()
    },
    [allowedNetworks]
  )

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