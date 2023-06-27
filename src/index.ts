import { toNetworkId, toNetworkName } from "./lib/network-dictionary"
import { supportedWalletProviders } from "./lib/supported-wallet-providers"
import { hasErrorCode } from "./lib/utils/has-error-code"
import { isError } from "./lib/utils/is-error"

export { useCardano, CardanoProvider } from "./contexts/CardanoContext"
export { CardanoToaster } from "./components/CardanoToaster"
export { CardanoWalletSelector } from "./components/CardanoWalletSelector"

export const utility = {
  toNetworkId,
  toNetworkName,
  hasErrorCode,
  isError,
}

export const constants = {
  supportedWalletProviders,
}

export { UseCardanoConsumer } from "./contexts/CardanoContext"
