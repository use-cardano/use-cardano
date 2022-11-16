export type USE_CARDANO_ERROR = "USER_REJECTED" | "NO_ACCOUNT_SET" | "NO_DAPP_CONNECTOR" | "UNKNOWN"
 
export class UseCardanoError extends Error {
  type?: USE_CARDANO_ERROR

  constructor(type: USE_CARDANO_ERROR, message: string) {
    super(message)
    this.type = type
    this.name = "UseCardanoError"
  }
}
