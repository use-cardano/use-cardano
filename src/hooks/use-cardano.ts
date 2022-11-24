import { useCardanoContext, UseCardanoContextState } from "contexts/use-cardano-context"
import { isNil } from "lodash"
import { Lucid, WalletApi } from "lucid-cardano"

import { useAccount } from "./use-account"
import { useLucid } from "./use-lucid"
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
  account: ReturnType<typeof useAccount>
  walletProvider: ReturnType<typeof useWalletProviders>
  tx: ReturnType<typeof useTransaction>
  context: UseCardanoContextState
}

const useCardano = (options: UseCardanoOptions = {}): UseCardanoState => {
  const { defaultWalletProvider, node } = { ...defaultOptions, ...options }

  const context = useCardanoContext()

  const walletProvider = useWalletProviders(defaultWalletProvider)
  const { walletApi } = useWalletApi(walletProvider.current)

  useNetworkId(walletApi)
  const account = useAccount(walletApi)
  const lucid = useLucid(node, walletApi)
  const tx = useTransaction(lucid)

  return {
    account,
    walletProvider,
    tx,
    context,
  }
}

export type { WalletProvider }
export { useCardano }
