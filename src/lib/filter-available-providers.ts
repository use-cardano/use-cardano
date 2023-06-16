import { supportedWalletProviders } from "lib/supported-wallet-providers"
import { isNil } from "lodash"
import { AvailableProvider } from "mynth-use-cardano"

export const filterAvailableProviders = (provider: any): provider is AvailableProvider =>
  !isNil(provider?.apiVersion) &&
  !isNil(provider?.icon) &&
  !isNil(provider?.name) &&
  !isNil(provider?.enable) &&
  !isNil(provider?.isEnabled) &&
  supportedWalletProviders.includes(provider?.key)
