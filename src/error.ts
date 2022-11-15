export type USE_CARDANO_ERROR = "USER_REJECTED" | "UNKNOWN"

export class UseCardanoError extends Error {
  type?: USE_CARDANO_ERROR

  constructor(type: USE_CARDANO_ERROR, message: string) {
    super(message)
    this.type = type
    this.name = "UseCardanoError"
  }
}
