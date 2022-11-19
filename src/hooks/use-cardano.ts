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
type WalletProvider = "nami" | "eternl" | "ccvault" | "yoroi"

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
  errors: UseCardanoError[]
  fullyInitialized: boolean
  account: ReturnType<typeof useAccount>
  walletProvider: ReturnType<typeof useWalletProviders>
  tx: ReturnType<typeof useTransaction>
}

const useCardano = (options: UseCardanoOptions = {}): UseCardanoState => {
  const { defaultWalletProvider, node } = { ...defaultOptions, ...options }
  const walletProvider = useWalletProviders(defaultWalletProvider)

  const [lucid, setLucid] = useState<Lucid>()
  const { walletApi, error } = useWalletApi(walletProvider.current)
  const networkId = useNetworkId(walletApi, walletProvider.current)

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

  if (walletProvider.current !== "nami") {
    warnings.push({
      type: "NO_LIVE_NETWORK_CHANGE",
      message: `Live network change is not supported for the ${walletProvider.current} wallet provider`,
    })

    warnings.push({
      type: "NO_LIVE_ACCOUNT_CHANGE",
      message: `Live account change is not supported for the ${walletProvider.current} wallet provider`,
    })
  }

  const account = useAccount(lucid, walletApi) //, walletProvider.current)
  const tx = useTransaction(lucid)

  const fullyInitialized =
    !isNil(lucid) && !isNil(networkId) && !isNil(walletApi) && !isNil(account)

  return {
    __apis: {
      walletApi,
      lucid,
    },
    networkId,
    warnings,
    errors,
    info: [
      `Using the ${walletProvider.current} wallet provider.`,
      `Using the ${node.provider} node provider.`,
      `Connected to the ${networkId === 0 ? "Testnet" : "Mainnet"} network.`,
    ],
    fullyInitialized,
    account,
    walletProvider,
    tx,
  }
}

export type { WalletProvider }
export { useCardano }
