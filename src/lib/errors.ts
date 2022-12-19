import { toNetworkName } from "lib/network-dictionary"
import { TestnetNetwork, USE_CARDANO_ERROR, WalletProvider } from "use-cardano"

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

export const disallowedNetworkError = (
  allowedNetworks: number[],
  testnetNetwork: TestnetNetwork,
  networkId: number
) => {
  const networks = allowedNetworks.map((id) => toNetworkName(id, testnetNetwork))
  const network = toNetworkName(networkId, testnetNetwork)

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
