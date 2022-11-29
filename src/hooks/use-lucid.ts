import { useCardanoContext } from "contexts/use-cardano-context"
import { UseCardanoNodeOptions } from "hooks/use-cardano"
import { getProvider } from "lib/get-provider"
import { isNil } from "lodash"
import { Lucid } from "lucid-cardano"
import { useEffect } from "react"

export const useLucid = (allowedNetworks: number[], node: UseCardanoNodeOptions) => {
  const { lucid, setLucid, networkId, walletApiLoading, walletApi } = useCardanoContext()

  useEffect(() => {
    ;(async () => {
      if (walletApiLoading || isNil(networkId) || isNil(walletApi)) return

      const provider = getProvider({ ...node, networkId })
      const network = networkId === 0 ? "Testnet" : "Mainnet"

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
