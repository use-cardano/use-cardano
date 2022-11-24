import { useCardanoContext, UseCardanoContextState } from "contexts/use-cardano-context"
import { UseCardanoError } from "error"
import { getProvider } from "lib/get-provider"
import { isNil } from "lodash"
import { Lucid, WalletApi } from "lucid-cardano"
import { useCallback, useEffect, useState } from "react"

import { UseCardanoWarning } from "../warnings"
import { useAccount } from "./use-account"
import { useNetworkId } from "./use-network-id"
import { useTransaction } from "./use-transaction"
import { useWalletApi } from "./use-wallet-api"
import { useWalletProviders } from "./use-wallet-providers"

// todo, add support for more node providers, when available in lucid
type NodeProvider = "blockfrost" | "blockfrost-proxy"
type WalletProvider = "nami" | "eternl" | "gero" | "flint"

export type UseCardanoNodeOptions = {
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
  __apis: {
    walletApi?: WalletApi
    lucid?: Lucid
  }
  networkId?: number
  info: string[]
  warnings: UseCardanoWarning[]
  fullyInitialized: boolean
  account: ReturnType<typeof useAccount>
  walletProvider: ReturnType<typeof useWalletProviders>
  tx: ReturnType<typeof useTransaction>
  context: UseCardanoContextState
}

const useCardano = (options: UseCardanoOptions = {}): UseCardanoState => {
  const { defaultWalletProvider, node } = { ...defaultOptions, ...options }

  const walletProvider = useWalletProviders(defaultWalletProvider)
  const { walletApi } = useWalletApi(walletProvider.current)
  const { warning: networkWarning, networkId } = useNetworkId(walletApi)

  const [lucid, setLucid] = useState<Lucid>()

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

  const warnings: UseCardanoWarning[] = []

  const account = useAccount(walletApi, networkId)
  const tx = useTransaction(lucid)

  if (networkWarning) warnings.push(networkWarning)
  if (account.warning) warnings.push(account.warning)

  const fullyInitialized =
    !isNil(lucid) && !isNil(networkId) && !isNil(walletApi) && !isNil(account)

  const context = useCardanoContext()

  return {
    __apis: {
      walletApi,
      lucid,
    },
    networkId,
    warnings,
    info: [
      `Using the ${walletProvider.current} wallet provider.`,
      `Using the ${node.provider} node provider.`,
      `Connected to the ${networkId === 0 ? "Testnet" : "Mainnet"} network.`,
    ],
    fullyInitialized,
    account,
    walletProvider,
    tx,
    context,
  }
}

export type { WalletProvider }
export { useCardano }
