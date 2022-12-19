import { useAccount } from "hooks/use-account"
import { useLucid } from "hooks/use-lucid"
import { useNetworkId } from "hooks/use-network-id"
import { useWalletApi } from "hooks/use-wallet-api"
import { useWalletProviders } from "hooks/use-wallet-providers"
import { toNetworkId } from "lib/network-dictionary"
import { useMemo } from "react"
import { UseCardanoOptions } from "use-cardano"

type DefaultUseCardanoOptions = {
  autoConnectTo: undefined
  autoReconnect: true
  testnetNetwork: "Preview"
  allowedNetworks: ["Mainnet"]
  node: {
    provider: "blockfrost"
    proxyUrl: undefined
    projectId: undefined
  }
}

const defaultOptions: DefaultUseCardanoOptions = {
  autoConnectTo: undefined,
  autoReconnect: true,
  testnetNetwork: "Preview",
  allowedNetworks: ["Mainnet"],
  node: {
    provider: "blockfrost",
    proxyUrl: undefined,
    projectId: undefined,
  },
}

export const useCardanoInitialization = (options: UseCardanoOptions = {}) => {
  const {
    node,
    autoConnectTo,
    autoReconnect,
    testnetNetwork,
    allowedNetworks: allowedNetworkNames,
  } = useMemo(() => ({ ...defaultOptions, ...options }), [options])

  const allowedNetworks = useMemo(() => allowedNetworkNames.map(toNetworkId), [allowedNetworkNames])

  useWalletProviders(autoConnectTo, autoReconnect)
  useWalletApi(autoReconnect)
  useNetworkId(allowedNetworks, testnetNetwork)
  useAccount()
  useLucid(allowedNetworks, testnetNetwork, node)
}
