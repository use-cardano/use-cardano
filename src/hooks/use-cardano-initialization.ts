import { UseCardanoOptionsWithDefaults } from "contexts/CardanoContext"
import { useAccount } from "hooks/use-account"
import { useLucid } from "hooks/use-lucid"
import { useNetworkId } from "hooks/use-network-id"
import { useWalletApi } from "hooks/use-wallet-api"
import { useWalletProviders } from "hooks/use-wallet-providers"
import { toNetworkId } from "lib/network-dictionary"
import { useMemo } from "react"

export const useCardanoInitialization = (options: UseCardanoOptionsWithDefaults) => {
  const {
    node,
    autoConnectTo,
    autoReconnect,
    testnetNetwork,
    allowedNetworks: allowedNetworkNames,
  } = options

  const allowedNetworks = useMemo(() => allowedNetworkNames.map(toNetworkId), [allowedNetworkNames])

  useWalletProviders(autoConnectTo, autoReconnect)
  useWalletApi(autoReconnect)
  useNetworkId(allowedNetworks, testnetNetwork)
  useAccount()
  useLucid(allowedNetworks, testnetNetwork, node)
}
