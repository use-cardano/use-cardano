import { useLucidAndWalletApi } from "../hooks/use-lucid-and-wallet-api"
import { useWalletProviders } from "../hooks/use-wallet-providers"
import { useWalletConnectInitialization } from "../hooks/use-walletconnect-initialization"
import { UseCardanoOptionsWithDefaults } from "mynth-use-cardano"

export const useCardanoInitialization = (options: UseCardanoOptionsWithDefaults) => {
  useWalletProviders(options)
  useWalletConnectInitialization(options)
  useLucidAndWalletApi(options)
}
