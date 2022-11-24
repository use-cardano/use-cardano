import { useCardanoContext } from "contexts/use-cardano-context"
import { getProvider } from "lib/get-provider"
import { isNil } from "lodash"
import { Lucid, WalletApi } from "lucid-cardano"
import { useEffect, useState } from "react"

import { UseCardanoNodeOptions } from "./use-cardano"

export const useLucid = (node: UseCardanoNodeOptions, walletApi?: WalletApi) => {
  const [lucid, setLucid] = useState<Lucid>()

  const { networkId } = useCardanoContext()

  useEffect(() => {
    ;(async () => {
      if (isNil(networkId) || isNil(walletApi)) return

      const provider = getProvider({ ...node, networkId })
      const network = networkId === 0 ? "Testnet" : "Mainnet"

      const updatedLucid = await (isNil(lucid)
        ? Lucid.new(provider, network)
        : lucid.switchProvider(provider, network))

      const lucidWithWallet = updatedLucid.selectWallet(walletApi)

      setLucid(lucidWithWallet)
    })()

    // Do we need to un-initialize anything here?
  }, [networkId, walletApi])

  return lucid
}
