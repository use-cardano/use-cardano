import { useCardanoContext } from "contexts/use-cardano-context"
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
  tx: ReturnType<typeof useTransaction>
}

const useCardano = (options: UseCardanoOptions = {}): UseCardanoState => {
  const { defaultWalletProvider, node } = { ...defaultOptions, ...options }

  useWalletProviders(defaultWalletProvider)

  const { walletApi } = useWalletApi()

  useNetworkId(walletApi)
  useAccount(walletApi)

  const lucid = useLucid(node, walletApi)
  const tx = useTransaction(lucid)

  return {
    tx,
  }
}

export type { WalletProvider }
export { useCardano }
