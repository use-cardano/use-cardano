import { useCardanoInitialization } from "hooks/use-cardano-initialization"
import { UseCardanoError } from "lib/errors"
import { Lucid, WalletApi } from "lucid-cardano"
import React, { useMemo } from "react"
import {
    AvailableProvider, UseCardanoContextState, UseCardanoOptions, UseCardanoWarning, WalletProvider
} from "use-cardano"

const noop = (..._: any[]) => {}

const defaultContextState: UseCardanoContextState = {
  isValid: undefined,
  isInitialized: false,
  setIsInitialized: noop,
  text: "",
  info: "",
  lucid: undefined,
  setLucid: noop,
  walletApi: undefined,
  setWalletApi: noop,
  networkId: undefined,
  setNetworkId: noop,
  networkWarning: undefined,
  setNetworkWarning: noop,
  networkError: undefined,
  setNetworkError: noop,
  walletApiError: undefined,
  setWalletApiError: noop,
  account: {
    address: undefined,
    rewardAddress: undefined,
  },
  setAccount: noop,
  accountLoaded: false,
  setAccountLoaded: noop,
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
  toasterShowCount: 0,
  showToaster: noop,
  hideToaster: noop,
}

type DefaultUseCardanoOptions = {
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

const defaultOptions: DefaultUseCardanoOptions = {
  autoConnectTo: undefined,
  autoReconnect: true,
  testnetNetwork: "Preview",
  allowedNetworks: ["Mainnet"],
  node: {
    provider: "blockfrost",
    proxyUrl: undefined,
    projectId: undefined,
  },
}

export type UseCardanoOptionsWithDefaults = UseCardanoOptions & DefaultUseCardanoOptions

const UseCardanoContext = React.createContext<UseCardanoContextState>(defaultContextState)

function useState<T>(initialState: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [valState, setValState] = React.useState(initialState)
  const val = React.useMemo(() => valState, [valState])
  const setVal = React.useCallback(setValState, [setValState])

  return [val, setVal]
}

interface Props {
  options: UseCardanoOptionsWithDefaults
}

const Injector = ({ children, options }: React.PropsWithChildren<Props>) => {
  useCardanoInitialization(options)

  return <>{children}</>
}

export const CardanoProvider = ({
  children,
  options: userOptions,
}: React.PropsWithChildren<Props>) => {
  const options = useMemo(() => ({ ...defaultOptions, ...userOptions }), [userOptions])

  const [toasterShowCount, setToasterShowCount] = useState(0)
  const [isInitialized, setIsInitialized] = useState<boolean | undefined>(false)
  const [text, setText] = useState<string | undefined>(undefined)
  const [info, setInfo] = useState<string | undefined>(undefined)
  const [lucid, setLucid] = useState<Lucid | undefined>(undefined)
  const [walletApi, setWalletApi] = useState<WalletApi | undefined>(undefined)
  const [account, setAccount] = useState(defaultContextState.account)
  const [accountLoaded, setAccountLoaded] = useState(defaultContextState.accountLoaded)
  const [walletProvider, setWalletProvider] = useState<WalletProvider | undefined>(undefined)
  const [networkId, setNetworkId] = useState<number | undefined>(undefined)
  const [networkWarning, setNetworkWarning] = useState<UseCardanoWarning | undefined>(undefined)
  const [networkError, setNetworkError] = useState<UseCardanoError | undefined>(undefined)
  const [walletApiError, setWalletApiError] = useState<UseCardanoError | undefined>(undefined)
  const [availableProviders, setAvailableProviders] = useState<AvailableProvider[]>([])
  const [accountError, setAccountError] = useState<UseCardanoError | undefined>(undefined)
  const [accountWarning, setAccountWarning] = useState<UseCardanoWarning | undefined>(undefined)
  const [walletApiLoading, setWalletApiLoading] = useState(false)
  const [toasterIsShowingState, setToasterIsShowing] = useState(false)
  const toasterIsShowing = React.useMemo(() => toasterIsShowingState, [toasterIsShowingState])
  const hideToaster = React.useCallback(() => setToasterIsShowing(false), [])
  const showToaster = React.useCallback((text?: string, info?: string) => {
    setToasterIsShowing(true)
    setToasterShowCount((count) => count + 1)
    if (text) setText(text)
    if (info) setInfo(info)
  }, [])

  // todo, what else could make this invalid?
  const isValid = React.useMemo(() => lucid !== undefined, [lucid])

  return (
    <UseCardanoContext.Provider
      value={{
        allowedNetworks: options.allowedNetworks,
        testnetNetwork: options.testnetNetwork,
        isValid,
        isInitialized,
        setIsInitialized,
        text,
        info,
        walletApi,
        setWalletApi,
        lucid,
        setLucid,
        networkId,
        setNetworkId,
        networkWarning,
        setNetworkWarning,
        networkError,
        setNetworkError,
        walletApiError,
        setWalletApiError,
        accountError,
        setAccountError,
        account,
        setAccount,
        accountLoaded,
        setAccountLoaded,
        accountWarning,
        setAccountWarning,
        walletApiLoading,
        setWalletApiLoading,
        walletProvider,
        setWalletProvider,
        availableProviders,
        setAvailableProviders,
        toasterIsShowing,
        toasterShowCount,
        showToaster,
        hideToaster,
      }}
    >
      <Injector options={options}>{children}</Injector>
    </UseCardanoContext.Provider>
  )
}

export const useCardano = () => {
  const context = React.useContext(UseCardanoContext)

  if (context === undefined)
    throw new Error("wrap your application in <CardanoProvider> to use useCardano components")

  return context
}
