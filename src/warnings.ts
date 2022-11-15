export type WarningType = "NO_LIVE_NETWORK_CHANGE" 

export interface UseCardanoWarning {
    type: WarningType
    message: string
}
