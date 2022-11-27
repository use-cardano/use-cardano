import { useCardanoContext } from "contexts/use-cardano-context"
import { useAccount } from "hooks/use-account"
import { useLucid } from "hooks/use-lucid"
import { useNetworkId } from "hooks/use-network-id"
import { useWalletApi } from "hooks/use-wallet-api"
import { useWalletProviders } from "hooks/use-wallet-providers"
import { Lucid } from "lucid-cardano"

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
  lucid?: Lucid
}

const useCardano = (options: UseCardanoOptions = {}): UseCardanoState => {
  const { defaultWalletProvider, node } = { ...defaultOptions, ...options }

  useWalletProviders(defaultWalletProvider)

  const { walletApi } = useWalletApi()

  useNetworkId(walletApi)
  useAccount(walletApi)

  const lucid = useLucid(node, walletApi)

  return {
    lucid,
  }
}

export type { WalletProvider }
export { useCardano }
