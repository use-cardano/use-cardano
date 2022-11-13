import { isNil } from "lodash"
import { Blockfrost, Lucid } from "lucid-cardano"
import { useCallback, useEffect, useState } from "react"

import { useNetworkId } from "./use-network-id"
import { useWalletApi } from "./use-wallet-api"

type walletProvider = "nami" | "eternl" | "ccvault" 

type UseCardanoOptions = {
  walletProvider?: walletProvider
  nodeProvider?: "blockfrost"
}

type DefaultUseCardanoOptions = {
  walletProvider: "nami"
  nodeProvider: "blockfrost"
}

const defaultOptions: DefaultUseCardanoOptions = {
  walletProvider: "nami",
  nodeProvider: "blockfrost",
}

const useCardano = (options: UseCardanoOptions) => {
  const { walletProvider } = { ...defaultOptions, ...options }

  const [lucid, setLucid] = useState<Lucid>()
  const walletApi = useWalletApi(walletProvider)
  const networkId = useNetworkId(walletApi)

  const initializeLucid = useCallback(async () => {
    if (isNil(networkId) || isNil(walletApi)) return

    const provider = new Blockfrost(`/api/blockfrost/${networkId}`)
    const network = networkId === 0 ? "Testnet" : "Mainnet"

    const updatedLucid = await (isNil(lucid)
      ? Lucid.new(provider, network)
      : lucid.switchProvider(provider, network))

    const lucidWithWallet = updatedLucid.selectWallet(walletApi)

    setLucid(lucidWithWallet)
  }, [lucid, networkId, walletApi])

  useEffect(() => {
    initializeLucid()

    // Do we need to un-initialize anything here?
  }, [initializeLucid])

  return {
    networkId,
    walletApi,
    lucid,
  }
}

export type { walletProvider }
export { useCardano }
