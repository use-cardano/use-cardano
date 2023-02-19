declare module "use-cardano" {
import { Lucid, Network, WalletApi } from "lucid-cardano"
import React from "react"

    // todo, add support for more node providers, when available in lucid
  export type NodeProvider = "blockfrost" | "blockfrost-proxy"
  export type WalletProvider = "nami" | "eternl" | "gerowallet" | "flint"

  export type AllowedNetworks = ("Testnet" | "Mainnet")[]
  export type TestnetNetwork = "Testnet" | "Preview" | "Preprod"

  export type UseCardanoNodeOptions = {
    provider?: NodeProvider
    proxyUrl?: string
    projectId?: string
  }

  export type UseCardanoOptions = {
    autoConnectTo?: WalletProvider
    autoReconnect?: boolean
    allowedNetworks?: AllowedNetworks
    testnetNetwork?: TestnetNetwork
    node?: UseCardanoNodeOptions
  }

  export type DefaultUseCardanoOptions = {
    autoConnectTo: undefined
    autoReconnect: true
    testnetNetwork: "Preview"
    allowedNetworks: ["Mainnet"]
    node: {
      provider: "blockfrost"
      proxyUrl: undefined
      projectId: undefined
    }
  }

  export type UseCardanoOptionsWithDefaults = UseCardanoOptions & DefaultUseCardanoOptions

  export interface Account {
    address?: string | null
    rewardAddress?: string | null
  }

  export interface AvailableProvider {
    key: WalletProvider
    name: string
    icon: string
    version: string
    enable(): Promise<WalletApi>
    isEnabled(): Promise<boolean>
  }

  export type USE_CARDANO_WARNING = "NO_LIVE_NETWORK_CHANGE" | "NO_LIVE_ACCOUNT_CHANGE" | "UNKNOWN"

  export type UseCardanoWarning = {
    type: USE_CARDANO_WARNING
    message: string
  }

  export type USE_CARDANO_ERROR =
    | "USER_REJECTED"
    | "NO_ACCOUNT_SET"
    | "NO_DAPP_CONNECTOR"
    | "INVALID_WALLET"
    | "INVALID_NETWORK"
    | "UNKNOWN"

  export class UseCardanoError extends Error {
    constructor(type: USE_CARDANO_ERROR, message: string): UseCardanoError
  }

  export interface UseCardanoContextState {
    allowedNetworks?: AllowedNetworks
    testnetNetwork?: TestnetNetwork
    isValid?: boolean
    isInitialized?: boolean
    setIsInitialized: (initialized?: boolean) => void
    text?: string
    info?: string
    walletApi?: WalletApi
    setWalletApi: (walletApi?: WalletApi) => void
    lucid?: Lucid
    setLucid: (lucid?: Lucid) => void
    networkId?: number
    setNetworkId: (networkId: number) => void
    networkWarning?: UseCardanoWarning
    setNetworkWarning: (warning?: UseCardanoWarning) => void
    networkError?: UseCardanoError
    setNetworkError: (error?: UseCardanoError) => void
    walletApiError?: UseCardanoError
    setWalletApiError: (error?: UseCardanoError) => void
    account: Account
    setAccount: (account: Account) => void
    accountLoaded: boolean
    setAccountLoaded: (loaded: boolean) => void
    accountError?: UseCardanoError
    setAccountError: (error?: UseCardanoError) => void
    accountWarning?: UseCardanoWarning
    setAccountWarning: (warning?: UseCardanoWarning) => void
    walletApiLoading: boolean
    setWalletApiLoading: (loading: boolean) => void
    walletProvider?: WalletProvider
    setWalletProvider: (walletProvider?: WalletProvider) => void
    availableProviders: AvailableProvider[]
    setAvailableProviders: (availableProviders: AvailableProvider[]) => void
    toasterIsShowing: boolean
    toasterShowCount: number
    showToaster: (text?: string, info?: string) => void
    hideToaster: () => void
  }

  interface Props {
    options: UseCardanoOptions
  }

  export const CardanoProvider: (props: React.PropsWithChildren<Props>) => JSX.Element

  export const useCardano: () => UseCardanoContextState

  interface CardanoToasterProps {
    position?: "topright" | "bottomright" | "bottomleft" | "topleft"
  }
  export const CardanoToaster: (props: CardanoToasterProps) => JSX.Element

  export const CardanoWalletSelector: () => JSX.Element

  export const utility: {
    toNetworkId: (network: string) => number
    toNetworkName: (id: number) => string
    isError: (e: any) => e is { message: string }
  }

  export const constants: {
    supportedWalletProviders: WalletProvider[]
  }

  export const UseCardanoConsumer: React.Consumer<UseCardanoContextState>
}
