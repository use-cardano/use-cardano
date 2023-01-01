import { supportedWalletProviders } from "lib/constants/supported-wallet-providers"
import { hasErrorCode } from "lib/utils/has-error-code"
import { isError } from "lib/utils/is-error"
import { lovelaceToAda } from "lib/utils/lovelace-to-ada"
import { toNetworkId, toNetworkName } from "lib/utils/network-dictionary"

export { useCardano, CardanoProvider } from "contexts/CardanoContext"
export { CardanoToaster } from "components/CardanoToaster"
export { CardanoWalletSelector } from "components/CardanoWalletSelector"

export const utility = {
  toNetworkId,
  toNetworkName,
  hasErrorCode,
  isError,
  lovelaceToAda,
}

export const constants = {
  supportedWalletProviders,
}
