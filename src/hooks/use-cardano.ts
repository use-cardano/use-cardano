import { UseCardanoError } from "error"
import { isNil } from "lodash"
import { Blockfrost, Lucid, WalletApi } from "lucid-cardano"
import { useCallback, useEffect, useState } from "react"

import { UseCardanoWarning } from "../warnings"
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

interface UseCardanoState {
  networkId?: number
  walletApi?: WalletApi
  lucid?: Lucid
  warnings: UseCardanoWarning[]
  errors: UseCardanoError[]
}

const useCardano = (options: UseCardanoOptions): UseCardanoState => {
  const { walletProvider } = { ...defaultOptions, ...options }

  const [lucid, setLucid] = useState<Lucid>()
  const { walletApi, error } = useWalletApi(walletProvider)
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

  console.log("From inside hook", error)

  const errors = []

  if (!isNil(error)) errors.push(error)

  return {
    networkId,
    walletApi,
    lucid,
    warnings: [],
    errors,
  }
}

export type { walletProvider }
export { useCardano }
