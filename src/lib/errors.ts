import { WalletProvider } from "hooks/use-cardano"

export type USE_CARDANO_ERROR =
  | "USER_REJECTED"
  | "NO_ACCOUNT_SET"
  | "NO_DAPP_CONNECTOR"
  | "INVALID_WALLET"
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

export const unknownError = (e: Error) => new UseCardanoError("UNKNOWN", e.message)
