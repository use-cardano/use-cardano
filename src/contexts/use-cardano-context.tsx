import { UseCardanoError } from "error"
import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from "react"

interface UseCardanoContextState {
  toasterIsShowing: boolean
  walletApiError?: UseCardanoError
  text?: string
  info?: string
  count: number
  setWalletApiError: (error?: UseCardanoError) => void
  showToaster: (text?: string, info?: string) => void
  hideToaster: () => void
}

const defaultContextState: UseCardanoContextState = {
  toasterIsShowing: false,
  text: "",
  info: "",
  walletApiError: undefined,
  count: 0,
  setWalletApiError: () => {},
  showToaster: () => {},
  hideToaster: () => {},
}

const UseCardanoContext = createContext<UseCardanoContextState>(defaultContextState)

const UseCardanoProvider = ({ children }: PropsWithChildren<{}>) => {
  const [count, setCount] = useState(0)
  const [walletApiErrorState, setWalletApiErrorState] = useState<UseCardanoError>()
  const [toasterIsShowingState, setToasterIsShowing] = useState(false)
  const [textState, setText] = useState<string>()
  const [infoState, setInfo] = useState<string>()

  const setWalletApiError = useCallback((error?: UseCardanoError) => {
    setWalletApiErrorState(error)
  }, [])

  const showToaster = useCallback((text?: string, info?: string) => {
    setCount((c) => (c += 1))
    setToasterIsShowing(true)
    if (text) setText(text)
    if (info) setInfo(info)
  }, [])

  const hideToaster = useCallback(() => setToasterIsShowing(false), [])

  const toasterIsShowing = useMemo(() => toasterIsShowingState, [toasterIsShowingState])
  const walletApiError = useMemo(() => walletApiErrorState, [walletApiErrorState])
  const text = useMemo(() => textState, [textState])
  const info = useMemo(() => infoState, [infoState])

  return (
    <UseCardanoContext.Provider
      value={{
        toasterIsShowing,
        walletApiError,
        text,
        info,
        count,
        showToaster,
        hideToaster,
        setWalletApiError,
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
