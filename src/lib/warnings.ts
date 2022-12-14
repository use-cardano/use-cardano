import { UseCardanoWarning } from "use-cardano"

export const noLiveAccountChangeWarning: UseCardanoWarning = {
  type: "NO_LIVE_ACCOUNT_CHANGE",
  message: `Live account change is not supported`,
}

export const noLiveNetworkChangeWarning: UseCardanoWarning = {
  type: "NO_LIVE_NETWORK_CHANGE",
  message: `Live network change is not supported`,
}
