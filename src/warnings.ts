export type USE_CARDANO_WARNING = "NO_LIVE_NETWORK_CHANGE" | "NO_LIVE_ACCOUNT_CHANGE" | "UNKNOWN"

export type UseCardanoWarning = {
  type: USE_CARDANO_WARNING
  message: string
}
