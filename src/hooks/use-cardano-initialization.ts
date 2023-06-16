import { useLucidAndWalletApi } from "hooks/use-lucid-and-wallet-api"
import { useWalletProviders } from "hooks/use-wallet-providers"
import { UseCardanoOptionsWithDefaults } from "mynth-use-cardano"

export const useCardanoInitialization = (options: UseCardanoOptionsWithDefaults) => {
  useWalletProviders(options)
  useLucidAndWalletApi(options)
}
