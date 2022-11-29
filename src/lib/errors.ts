import { WalletProvider } from "hooks/use-cardano"
import { toNetworkName } from "utils/network-dictionary"

export type USE_CARDANO_ERROR =
  | "USER_REJECTED"
  | "NO_ACCOUNT_SET"
  | "NO_DAPP_CONNECTOR"
  | "INVALID_WALLET"
  | "INVALID_NETWORK"
  | "UNKNOWN"

export class UseCardanoError extends Error {
  type?: USE_CARDANO_ERROR

  constructor(type: USE_CARDANO_ERROR, message: string) {
    super(message)
    this.type = type
    this.name = "UseCardanoError"
  }
}

export const noDappError = (provider: WalletProvider) =>
  new UseCardanoError(
    "NO_DAPP_CONNECTOR",
    `Install the ${provider} wallet provider to connect your wallet.`
  )

export const userRejectedError = new UseCardanoError(
  "USER_REJECTED",
  "Request to connect wallet rejected."
)

export const noAccountSetError = (provider: WalletProvider) =>
  new UseCardanoError(
    "NO_ACCOUNT_SET",
    `Make sure you have an account, and that it's connected in ${provider}, then refresh the page.`
  )

export const invalidWalletError = new UseCardanoError(
  "INVALID_WALLET",
  "No addresses found in wallet. This is an unexpected error, please check your wallet."
)

export const disallowedNetworkError = (allowedNetworks: number[], networkId: number) => {
  const networks = allowedNetworks.map(toNetworkName)
  const network = toNetworkName(networkId)

  if (networks.length === 0) {
    if (process.env.NODE_ENV === "development")
      console.warn(
        "No networks are allowed, this is unexpected. Users will not be able to connect. Check configuration.allowedNetworks."
      )

    return new UseCardanoError("UNKNOWN", "Unable to connect to network.")
  }

  if (networks.length === 1)
    return new UseCardanoError(
      "INVALID_NETWORK",
      `This application is not supported on ${network}. Please switch to ${networks[0]}.`
    )

  const networksList = new Intl.ListFormat("en", { style: "short", type: "disjunction" }).format(
    networks.sort()
  )

  return new UseCardanoError(
    "INVALID_NETWORK",
    `This application is not supported on ${network}. Please switch to one of ${networksList}.`
  )
}

export const unknownError = (e: Error) => new UseCardanoError("UNKNOWN", e.message)
