import * as React from "react"
import { PropsWithChildren, useReducer } from "react"

enum UseCardanoContextActionType {
  showToaster = "useCardano/showToaster",
  hideToaster = "useCardano/hideToaster",
}

// An interface for our actions
interface UseCardanoContextAction {
  type: UseCardanoContextActionType
  text?: string
}

interface UseCardanoState {
  toasterIsShowing: boolean
  text?: string
}

interface UseCardanoContextState extends UseCardanoState {
  showToaster: (text: string) => void
  hideToaster: () => void
}

const defaultState: UseCardanoState = {
  toasterIsShowing: false,
  text: "",
}

const defaultContextState: UseCardanoContextState = {
  ...defaultState,
  showToaster: (_: string) => {},
  hideToaster: () => {},
}

const UseCardanoContext = React.createContext<UseCardanoContextState>(defaultContextState)

const useCardanoContextReducer = (
  state: UseCardanoState,
  { type, text }: UseCardanoContextAction
) => {
  if (type === UseCardanoContextActionType.showToaster)
    return { ...state, toasterIsShowing: true, text }

  if (type === UseCardanoContextActionType.hideToaster) return { ...state, toasterIsShowing: false }

  if (process.env.NODE_ENV === "development")
    console.warn(`Unhandled action type in useCardanoContextReducer: ${type}`)

  return state
}

const UseCardanoProvider = ({ children }: PropsWithChildren<{}>) => {
  const [state, dispatch] = useReducer(useCardanoContextReducer, defaultState)

  const showToaster = (text: string) =>
    dispatch({ type: UseCardanoContextActionType.showToaster, text })

  const hideToaster = () => dispatch({ type: UseCardanoContextActionType.hideToaster })

  return (
    <UseCardanoContext.Provider
      value={{
        toasterIsShowing: state.toasterIsShowing,
        text: state.text,
        showToaster,
        hideToaster,
      }}
    >
      {children}
    </UseCardanoContext.Provider>
  )
}

const useCardanoContext = () => {
  const context = React.useContext(UseCardanoContext)

  if (context === undefined)
    throw new Error("wrap your application in <UseCardanoProvider> to use useCardano components")

  return context
}

export { UseCardanoProvider, useCardanoContext }
