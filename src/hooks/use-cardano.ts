import { useCardanoContext, UseCardanoContextState } from "contexts/use-cardano-context"
import { isNil } from "lodash"
import { Lucid, WalletApi } from "lucid-cardano"

import { UseCardanoWarning } from "../warnings"
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
  __apis: {
    walletApi?: WalletApi
    lucid?: Lucid
  }
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

  useNetworkId(walletApi)

  const warnings: UseCardanoWarning[] = []

  const account = useAccount(walletApi)

  if (account.warning) warnings.push(account.warning)

  const context = useCardanoContext()

  const lucid = useLucid(node, walletApi)

  const tx = useTransaction(lucid)

  const fullyInitialized =
    !isNil(lucid) && !isNil(context.networkId) && !isNil(walletApi) && !isNil(account)

  return {
    __apis: {
      walletApi,
      lucid,
    },
    warnings,
    fullyInitialized,
    account,
    walletProvider,
    tx,
    context,
  }
}

export type { WalletProvider }
export { useCardano }
