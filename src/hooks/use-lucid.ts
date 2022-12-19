import { useCardano } from "contexts/CardanoContext"
import { getNodeProvider } from "lib/get-node-provider"
import { toNetworkName } from "lib/network-dictionary"
import { isNil } from "lodash"
import { Lucid } from "lucid-cardano"
import { useEffect } from "react"
import { TestnetNetwork, UseCardanoNodeOptions } from "use-cardano"

export const useLucid = (
  allowedNetworks: number[],
  testnetNetwork: TestnetNetwork,
  node: UseCardanoNodeOptions
) => {
  const { lucid, setLucid, networkId, walletApiLoading, walletApi } = useCardano()

  useEffect(() => {
    ;(async () => {
      if (walletApiLoading || isNil(networkId) || isNil(walletApi)) return

      const provider = getNodeProvider({ ...node, testnetNetwork, networkId })
      const network = toNetworkName(networkId, testnetNetwork)

      console.log(network)
      
      if (!allowedNetworks.includes(networkId)) {
        setLucid(undefined)
        return
      }


      const updatedLucid = await (isNil(lucid)
        ? Lucid.new(provider, network)
        : lucid.switchProvider(provider, network))

      const lucidWithWallet = updatedLucid.selectWallet(walletApi)

      setLucid(lucidWithWallet)
    })()

    // Do we need to un-initialize anything here?
  }, [networkId, walletApiLoading, walletApi])
}
