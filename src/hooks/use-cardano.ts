import { UseCardanoError } from "error"
import { isNil } from "lodash"
import { Blockfrost, Lucid, WalletApi } from "lucid-cardano"
import { useCallback, useEffect, useState } from "react"

import { UseCardanoWarning } from "../warnings"
import { useNetworkId } from "./use-network-id"
import { useTransaction } from "./use-transaction"
import { useWalletApi } from "./use-wallet-api"
import { useWalletProviders } from "./use-wallet-providers"

// todo, add support for more node providers, when available in lucid
type NodeProvider = "blockfrost" | "blockfrost-proxy"
type WalletProvider = "nami" | "eternl" | "ccvault" | "yoroi"

type UseCardanoNodeOptions = {
  provider?: NodeProvider
  proxyUrl?: string
  projectId?: string
}

type UseCardanoOptions = {
  defaultWalletProvider?: WalletProvider
  node?: UseCardanoNodeOptions
}

type DefaultUseCardanoOptions = {
  node: {
    provider: "blockfrost"
    proxyUrl: undefined
    projectId: undefined
  }
}

const defaultOptions: DefaultUseCardanoOptions = {
  node: {
    provider: "blockfrost",
    proxyUrl: undefined,
    projectId: undefined,
  },
}

interface UseCardanoState {
  networkId?: number
  walletApi?: WalletApi
  lucid?: Lucid
  info: string[]
  warnings: UseCardanoWarning[]
  errors: UseCardanoError[]
  walletProvider: ReturnType<typeof useWalletProviders>
  tx: ReturnType<typeof useTransaction>
}

const getProvider = ({
  networkId,
  provider,
  projectId,
  proxyUrl,
}: UseCardanoNodeOptions & { networkId: number }) => {
  if (provider === "blockfrost") {
    const network = networkId === 0 ? "testnet" : "mainnet"
    return new Blockfrost(
      `https://cardano-${network.toLowerCase()}.blockfrost.io/api/v0`,
      projectId
    )
  }

  if (provider === "blockfrost-proxy") return new Blockfrost(`${proxyUrl}/${networkId}`)

  throw new Error(`Unknown provider: ${provider}`)
}

const useCardano = (options: UseCardanoOptions): UseCardanoState => {
  const { defaultWalletProvider, node } = { ...defaultOptions, ...options }
  const walletProvider = useWalletProviders(defaultWalletProvider)

  const [lucid, setLucid] = useState<Lucid>()
  const { walletApi, error } = useWalletApi(walletProvider.current)
  const networkId = useNetworkId(walletApi)

  const initializeLucid = useCallback(async () => {
    if (isNil(networkId) || isNil(walletApi)) return

    const provider = getProvider({ ...node, networkId })
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

  const errors = []

  if (!isNil(error)) {
    // todo, find out how to properly capture wallet errors that doesn't happen during connection
    if (error.message === "user reject")
      errors.push(
        new UseCardanoError(
          "USER_REJECTED",
          "The user rejected the request to connect their wallet."
        )
      )
    else errors.push(error)
  }

  const warnings: UseCardanoWarning[] = []

  if (walletProvider.current !== "nami")
    warnings.push({
      type: "NO_LIVE_NETWORK_CHANGE",
      message: `Live network change is not supported for the ${walletProvider.current} wallet provider`,
    })

  const tx = useTransaction(lucid)

  return {
    networkId,
    walletApi,
    lucid,
    warnings,
    errors,
    info: [
      `Using the ${walletProvider.current} wallet provider.`,
      `Using the ${node.provider} node provider.`,
      `Connected to the ${networkId === 0 ? "Testnet" : "Mainnet"} network.`,
    ],
    walletProvider,
    tx,
  }
}

export type { WalletProvider }
export { useCardano }
