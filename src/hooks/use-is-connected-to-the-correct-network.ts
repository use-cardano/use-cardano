import { useCardano } from "../contexts/CardanoContext"
import { toNetworkName } from "../lib/network-dictionary"
import { isNil } from "lodash"
import { useMemo } from "react"

export const useIsConnectedToTheCorrectNetwork = () => {
  const { account, networkId, testnetNetwork, allowedNetworks } = useCardano()

  const isConnectedToTheCorrectNetwork = useMemo(() => {
    if (isNil(networkId) || !testnetNetwork || !allowedNetworks) return true

    const networkName = toNetworkName(networkId, testnetNetwork)

    // normalize testnet network names, since it's impossible to distinguish between them
    const testnetNetworkName = ["Testnet", "Preview", "Preprod"].includes(networkName)
      ? "Testnet"
      : "Mainnet"

    return allowedNetworks.includes(testnetNetworkName)
  }, [networkId, allowedNetworks, testnetNetwork])

  return isConnectedToTheCorrectNetwork
}
