import { useAccount } from "hooks/use-account"
import { useLucid } from "hooks/use-lucid"
import { useNetworkId } from "hooks/use-network-id"
import { useWalletApi } from "hooks/use-wallet-api"
import { useWalletProviders } from "hooks/use-wallet-providers"
import { useMemo } from "react"
import { UseCardanoOptions } from "use-cardano"
import { toNetworkId } from "utils/network-dictionary"

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

export const useCardano = (options: UseCardanoOptions = {}) => {
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
