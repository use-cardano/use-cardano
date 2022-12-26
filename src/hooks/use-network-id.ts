import { useCardano } from "contexts/CardanoContext"
import { disallowedNetworkError } from "lib/errors"
import { getInfo, getText } from "lib/get-toaster-texts"
import { noLiveNetworkChangeWarning } from "lib/warnings"
import { isNil } from "lodash"
import { useCallback, useEffect } from "react"
import { TestnetNetwork } from "use-cardano"

export const useNetworkId = (allowedNetworks: number[], testnetNetwork: TestnetNetwork) => {
  const {
    setNetworkId,
    setNetworkWarning,
    setNetworkError,
    walletApi,
    showToaster,
    walletProvider,
  } = useCardano()

  const showToasterWithNetworkInfo = useCallback(() => {
    const text = walletProvider ? getText(walletProvider) : undefined
    const info = walletProvider ? getInfo(walletProvider) : undefined

    showToaster(text, info)
  }, [walletProvider])

  const onNetworkChange = useCallback(
    (id: unknown) => {
      const networkId = id === "string" ? parseInt(id) : (id as number)

      // NOTE: We don't want to unset network id, since that would have cascading effects
      if (!allowedNetworks.includes(networkId))
        setNetworkError(disallowedNetworkError(allowedNetworks, testnetNetwork, networkId))
      else setNetworkError(undefined)

      setNetworkId(networkId)
      showToasterWithNetworkInfo()
    },
    [allowedNetworks, showToasterWithNetworkInfo]
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
