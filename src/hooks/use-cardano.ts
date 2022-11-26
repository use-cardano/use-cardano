import { useCardanoContext, UseCardanoContextState } from "contexts/use-cardano-context"
import { useAccount } from "hooks/use-account"
import { useLucid } from "hooks/use-lucid"
import { useNetworkId } from "hooks/use-network-id"
import { useTransaction } from "hooks/use-transaction"
import { useWalletApi } from "hooks/use-wallet-api"
import { useWalletProviders } from "hooks/use-wallet-providers"

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
  tx: ReturnType<typeof useTransaction>
  context: UseCardanoContextState
}

const useCardano = (options: UseCardanoOptions = {}): UseCardanoState => {
  const { defaultWalletProvider, node } = { ...defaultOptions, ...options }

  const context = useCardanoContext()

  useWalletProviders(defaultWalletProvider)

  const { walletApi } = useWalletApi()

  useNetworkId(walletApi)
  const account = useAccount(walletApi)
  const lucid = useLucid(node, walletApi)
  const tx = useTransaction(lucid)

  return {
    account,
    tx,
    context,
  }
}

export type { WalletProvider }
export { useCardano }
