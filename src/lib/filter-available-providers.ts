import { supportedWalletProviders } from "constants/supported-wallet-providers"
import { AvailableProvider } from "hooks/use-wallet-providers"
import { isNil } from "lodash"

export const filterAvailableProviders = (provider: any): provider is AvailableProvider =>
  !isNil(provider?.apiVersion) &&
  !isNil(provider?.icon) &&
  !isNil(provider?.name) &&
  !isNil(provider?.enable) &&
  !isNil(provider?.isEnabled) &&
  supportedWalletProviders.includes(provider?.key)
