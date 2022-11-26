import { WalletProvider } from "hooks/use-cardano"
import { UseCardanoError } from "lib/errors"
import { UseCardanoWarning } from "lib/warnings"
import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from "react"

interface UseCardanoContextState {
  text?: string
  info?: string
  count: number
  networkId?: number
  setNetworkId: (networkId: number) => void
  networkWarning?: UseCardanoWarning
  setNetworkWarning: (warning?: UseCardanoWarning) => void
  walletApiError?: UseCardanoError
  setWalletApiError: (error?: UseCardanoError) => void
  accountError?: UseCardanoError
  setAccountError: (error?: UseCardanoError) => void
  accountWarning?: UseCardanoWarning
  setAccountWarning: (warning?: UseCardanoWarning) => void
  walletApiLoading: boolean
  setWalletApiLoading: (loading: boolean) => void
  walletProvider?: WalletProvider
  setWalletProvider: (walletProvider: WalletProvider) => void
  availableProviders: string[]
  setAvailableProviders: (availableProviders: string[]) => void
  toasterIsShowing: boolean
  showToaster: (text?: string, info?: string) => void
  hideToaster: () => void
}

const noop = (..._: any[]) => {}

const defaultContextState: UseCardanoContextState = {
  text: "",
  info: "",
  count: 0,
  networkId: undefined,
  setNetworkId: noop,
  networkWarning: undefined,
  setNetworkWarning: noop,
  walletApiError: undefined,
  setWalletApiError: noop,
  accountError: undefined,
  setAccountError: noop,
  accountWarning: undefined,
  setAccountWarning: noop,
  walletApiLoading: false,
  setWalletApiLoading: noop,
  walletProvider: undefined,
  setWalletProvider: noop,
  availableProviders: [],
  setAvailableProviders: noop,
  toasterIsShowing: false,
  showToaster: noop,
  hideToaster: noop,
}

const UseCardanoContext = createContext<UseCardanoContextState>(defaultContextState)

const UseCardanoProvider = ({ children }: PropsWithChildren<{}>) => {
  const [count, setCount] = useState(0)
  const [textState, setText] = useState<string>()
  const [infoState, setInfo] = useState<string>()

  const [walletProviderState, setWalletProviderState] = useState<WalletProvider>()
  const walletProvider = useMemo(() => walletProviderState, [walletProviderState])
  const setWalletProvider = useCallback(setWalletProviderState, [])

  const [networkIdState, setNetworkIdState] = useState<number>()
  const networkId = useMemo(() => networkIdState, [networkIdState])
  const setNetworkId = useCallback(setNetworkIdState, [])

  const [networkWarningState, setNetworkWarningState] = useState<UseCardanoWarning>()
  const networkWarning = useMemo(() => networkWarningState, [networkWarningState])
  const setNetworkWarning = useCallback(setNetworkWarningState, [])

  const [walletApiErrorState, setWalletApiErrorState] = useState<UseCardanoError>()
  const walletApiError = useMemo(() => walletApiErrorState, [walletApiErrorState])
  const setWalletApiError = useCallback(setWalletApiErrorState, [])

  const [availableProvidersState, setAvailableProvidersState] = useState<string[]>([])
  const availableProviders = useMemo(() => availableProvidersState, [availableProvidersState])
  const setAvailableProviders = useCallback(setAvailableProvidersState, [])

  const [accountErrorState, setAccountErrorState] = useState<UseCardanoError>()
  const accountError = useMemo(() => accountErrorState, [accountErrorState])
  const setAccountError = useCallback(setAccountErrorState, [])

  const [accountWarningState, setAccountWarningState] = useState<UseCardanoWarning>()
  const accountWarning = useMemo(() => accountWarningState, [accountWarningState])
  const setAccountWarning = useCallback(setAccountWarningState, [])

  const [walletApiLoadingState, setWalletApiLoadingState] = useState(false)
  const walletApiLoading = useMemo(() => walletApiLoadingState, [walletApiLoadingState])
  const setWalletApiLoading = useCallback(setWalletApiLoadingState, [])

  const [toasterIsShowingState, setToasterIsShowing] = useState(false)
  const toasterIsShowing = useMemo(() => toasterIsShowingState, [toasterIsShowingState])
  const showToaster = useCallback((text?: string, info?: string) => {
    setCount((c) => (c += 1))
    setToasterIsShowing(true)
    if (text) setText(text)
    if (info) setInfo(info)
  }, [])

  const hideToaster = useCallback(() => setToasterIsShowing(false), [])

  const text = useMemo(() => textState, [textState])
  const info = useMemo(() => infoState, [infoState])

  return (
    <UseCardanoContext.Provider
      value={{
        text,
        info,
        count,
        networkId,
        setNetworkId,
        networkWarning,
        setNetworkWarning,
        walletApiError,
        setWalletApiError,
        accountError,
        setAccountError,
        accountWarning,
        setAccountWarning,
        walletApiLoading,
        setWalletApiLoading,
        walletProvider,
        setWalletProvider,
        availableProviders,
        setAvailableProviders,
        toasterIsShowing,
        showToaster,
        hideToaster,
      }}
    >
      {children}
    </UseCardanoContext.Provider>
  )
}

const useCardanoContext = () => {
  const context = useContext(UseCardanoContext)

  if (context === undefined)
    throw new Error("wrap your application in <UseCardanoProvider> to use useCardano components")

  return context
}

export type { UseCardanoContextState }
export { UseCardanoProvider, useCardanoContext }
