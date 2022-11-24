import { UseCardanoError } from "error"
import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from "react"

interface UseCardanoContextState {
  text?: string
  info?: string
  count: number
  walletApiError?: UseCardanoError
  setWalletApiError: (error?: UseCardanoError) => void
  accountError?: UseCardanoError
  setAccountError: (error?: UseCardanoError) => void
  walletProviderLoading: boolean
  setWalletProviderLoading: (loading: boolean) => void
  toasterIsShowing: boolean
  showToaster: (text?: string, info?: string) => void
  hideToaster: () => void
}

const noop = (..._: any[]) => {}

const defaultContextState: UseCardanoContextState = {
  text: "",
  info: "",
  count: 0,
  walletApiError: undefined,
  setWalletApiError: noop,
  accountError: undefined,
  setAccountError: noop,
  walletProviderLoading: false,
  setWalletProviderLoading: noop,
  toasterIsShowing: false,
  showToaster: noop,
  hideToaster: noop,
}

const UseCardanoContext = createContext<UseCardanoContextState>(defaultContextState)

const UseCardanoProvider = ({ children }: PropsWithChildren<{}>) => {
  const [count, setCount] = useState(0)
  const [textState, setText] = useState<string>()
  const [infoState, setInfo] = useState<string>()

  const [walletApiErrorState, setWalletApiErrorState] = useState<UseCardanoError>()
  const setWalletApiError = useCallback((error?: UseCardanoError) => {
    setWalletApiErrorState(error)
  }, [])

  const [accountErrorState, setAccountErrorState] = useState<UseCardanoError>()
  const setAccountError = useCallback((error?: UseCardanoError) => {
    setAccountErrorState(error)
  }, [])

  const [walletProviderLoadingState, setWalletProviderLoadingState] = useState(false)
  const setWalletProviderLoading = useCallback((loading: boolean) => {
    setWalletProviderLoadingState(loading)
  }, [])

  const [toasterIsShowingState, setToasterIsShowing] = useState(false)
  const showToaster = useCallback((text?: string, info?: string) => {
    setCount((c) => (c += 1))
    setToasterIsShowing(true)
    if (text) setText(text)
    if (info) setInfo(info)
  }, [])

  const hideToaster = useCallback(() => setToasterIsShowing(false), [])

  const text = useMemo(() => textState, [textState])
  const info = useMemo(() => infoState, [infoState])
  const walletApiError = useMemo(() => walletApiErrorState, [walletApiErrorState])
  const accountError = useMemo(() => accountErrorState, [accountErrorState])
  const walletProviderLoading = useMemo(() => walletProviderLoadingState, [walletProviderLoadingState])
  const toasterIsShowing = useMemo(() => toasterIsShowingState, [toasterIsShowingState])

  return (
    <UseCardanoContext.Provider
      value={{
        text,
        info,
        count,
        walletApiError,
        setWalletApiError,
        accountError,
        setAccountError,
        walletProviderLoading,
        setWalletProviderLoading,
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
