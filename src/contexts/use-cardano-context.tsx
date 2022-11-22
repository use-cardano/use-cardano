import { isNil } from "lodash"
import { createContext, PropsWithChildren, useContext, useReducer, useState } from "react"

enum UseCardanoContextActionType {
  showToaster = "useCardano/showToaster",
  hideToaster = "useCardano/hideToaster",
}

// An interface for our actions
interface UseCardanoContextAction {
  type: UseCardanoContextActionType
  text?: string
  info?: string
}

interface UseCardanoState {
  toasterIsShowing: boolean
  text?: string
  info?: string
}

interface UseCardanoContextState extends UseCardanoState {
  count: number
  showToaster: (text?: string, info?: string) => void
  hideToaster: () => void
}

const defaultState: UseCardanoState = {
  toasterIsShowing: false,
  text: "",
  info: "",
}

const defaultContextState: UseCardanoContextState = {
  ...defaultState,
  count: 0,
  showToaster: (_?: string, __?: string) => {},
  hideToaster: () => {},
}

const UseCardanoContext = createContext<UseCardanoContextState>(defaultContextState)

const useCardanoContextReducer = (
  state: UseCardanoState,
  { type, text, info }: UseCardanoContextAction
) => {
  if (type === UseCardanoContextActionType.showToaster) {
    if (isNil(text) && isNil(info)) return { ...state, toasterIsShowing: true }

    return { ...state, toasterIsShowing: true, text, info }
  }

  if (type === UseCardanoContextActionType.hideToaster) return { ...state, toasterIsShowing: false }

  if (process.env.NODE_ENV === "development")
    console.warn(`Unhandled action type in useCardanoContextReducer: ${type}`)

  return state
}

const UseCardanoProvider = ({ children }: PropsWithChildren<{}>) => {
  const [count, setCount] = useState(0)
  const [state, dispatch] = useReducer(useCardanoContextReducer, defaultState)

  const showToaster = (text?: string, info?: string) => {
    setCount((c) => (c += 1))
    dispatch({ type: UseCardanoContextActionType.showToaster, text, info })
  }

  const hideToaster = () => dispatch({ type: UseCardanoContextActionType.hideToaster })

  return (
    <UseCardanoContext.Provider
      value={{
        toasterIsShowing: state.toasterIsShowing,
        text: state.text,
        info: state.info,
        count: count,
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

export { UseCardanoProvider, useCardanoContext }
