import { useAccount } from "hooks/use-account"
import { useLucid } from "hooks/use-lucid"
import { useNetworkId } from "hooks/use-network-id"
import { useWalletApi } from "hooks/use-wallet-api"
import { useWalletProviders } from "hooks/use-wallet-providers"
import { useMemo } from "react"
import { toNetworkId } from "utils/network-dictionary"

// todo, add support for more node providers, when available in lucid
type NodeProvider = "blockfrost" | "blockfrost-proxy"
type WalletProvider = "nami" | "eternl" | "gerowallet" | "flint"

export type AllowedNetworks = ("mainnet" | "testnet")[]

export type UseCardanoNodeOptions = {
  provider?: NodeProvider
  proxyUrl?: string
  projectId?: string
}

type UseCardanoOptions = {
  autoConnectTo?: WalletProvider
  autoReconnect?: boolean
  allowedNetworks?: AllowedNetworks
  node?: UseCardanoNodeOptions
}

type DefaultUseCardanoOptions = {
  autoConnectTo: undefined
  autoReconnect: true
  allowedNetworks: ["mainnet"]
  node: {
    provider: "blockfrost"
    proxyUrl: undefined
    projectId: undefined
  }
}

const defaultOptions: DefaultUseCardanoOptions = {
  autoConnectTo: undefined,
  autoReconnect: true,
  allowedNetworks: ["mainnet"],
  node: {
    provider: "blockfrost",
    proxyUrl: undefined,
    projectId: undefined,
  },
}

const useCardano = (options: UseCardanoOptions = {}) => {
  const {
    node,
    autoConnectTo,
    autoReconnect,
    allowedNetworks: allowedNetworkNames,
  } = useMemo(() => ({ ...defaultOptions, ...options }), [options])

  const allowedNetworks = useMemo(() => allowedNetworkNames.map(toNetworkId), [allowedNetworkNames])

  useWalletProviders(autoConnectTo, autoReconnect)
  useWalletApi(autoReconnect)
  useNetworkId(allowedNetworks)
  useAccount()
  useLucid(allowedNetworks, node)
}

export type { WalletProvider }
export { useCardano }
