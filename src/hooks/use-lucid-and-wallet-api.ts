import { useCardano } from "../contexts/CardanoContext"
import {
    disallowedNetworkError, invalidWalletError, noAccountSetError, noDappError, unknownError,
    userRejectedError
} from "../lib/errors"
import { getNodeProvider } from "../lib/get-node-provider"
import { getInfo, getText } from "../lib/get-toaster-texts"
import { hexArrayToAddress } from "../lib/hex-array-to-address"
import { setStoredWalletProvider } from "../lib/local-storage"
import { toNetworkId, toNetworkName } from "../lib/network-dictionary"
import { hasErrorCode } from "../lib/utils/has-error-code"
import { isError } from "../lib/utils/is-error"
import { noLiveNetworkChangeWarning } from "../lib/warnings"
import { isNil } from "lodash"
import { Lucid, Network, WalletApi } from "lucid-cardano"
import { useCallback, useEffect } from "react"
import { UseCardanoOptionsWithDefaults } from "mynth-use-cardano"
import { walletProviderHelper } from "../lib/helpers/walletProviderHelper";
import { EnabledAPI } from "@dcspark/adalib/dist/types/CardanoInjected"

export const useLucidAndWalletApi = (options: UseCardanoOptionsWithDefaults) => {
  const { autoReconnect, allowedNetworks: allowedNetworkNames, testnetNetwork, node } = options

  const {
    account,
    setAccount,
    setAccountLoaded,
    networkId,
    setNetworkId,
    lucid,
    setLucid,
    walletProvider,
    showToaster,
    walletApi,
    setWalletApi,
    setWalletApiError,
    setWalletApiLoading,
    setNetworkWarning,
    setAccountWarning,
    setNetworkError,
    setAccountError,
  } = useCardano()

  const onNetworkChange = useCallback(
    async (id: unknown) => {
      const newNetworkId = id === "string" ? parseInt(id) : (id as number)
      if (networkId !== newNetworkId) {
        setNetworkId(newNetworkId)
      }
    },
    [networkId]
  )

  const onAccountChangeCallback = async (walletApi: WalletApi | EnabledAPI) => {
    try {
      setAccount({})
      setWalletApiLoading(true)

      // todo, find a way to use the built-ins from lucid lucid.wallet.address(), lucid.wallet.rewardAddress()
      const [address, unusedAddress, rewardAddress] = await Promise.all([
        walletApi.getUsedAddresses().then(hexArrayToAddress),
        walletApi.getUnusedAddresses().then(hexArrayToAddress),
        walletApi.getRewardAddresses().then(hexArrayToAddress),
      ])

      setAccountError(!address && !unusedAddress ? invalidWalletError : undefined)
      setAccount({ address: address || unusedAddress, rewardAddress })
    } catch (e) {
      if (e instanceof Error) setAccountError(unknownError(e))
    } finally {
      setWalletApiLoading(false)
    }
  }

  const handleError = (e: unknown) => {
    if (isError(e)) {
      switch (e.message) {
        case "user reject":
          setWalletApiError(userRejectedError)
          break
        case "no account set":
          walletProvider && setWalletApiError(noAccountSetError(walletProvider))
          break
        default:
          if (e instanceof Error) setWalletApiError(unknownError(e))
          break
      }

      showToaster(`Could not connect to wallet ${walletProvider}`, e.message)
    } else if (hasErrorCode(e)) {
      if (!isNil(e.code)) {
        switch (e.code) {
          case -2: // user rejected request to connect wallet (Flint)
          case -3: // user rejected request to connect wallet (Nami)
            setWalletApiError(userRejectedError)
            showToaster(
              `Could not connect to wallet ${walletProvider}`,
              userRejectedError.message
            )
            break
        }
      }
    } else if (isError(e)) {
      switch (e.message) {
        case "user reject":
          setWalletApiError(userRejectedError)
          break
        case "no account set":
          walletProvider && setWalletApiError(noAccountSetError(walletProvider))
          break
        default:
          if (e instanceof Error) setWalletApiError(unknownError(e))
          break
      }
    }
  }

  const updateWalletApiAndLucid = useCallback(async (id: number | undefined, api: WalletApi | EnabledAPI | undefined) => {
    if (!window.cardano || !walletProvider || isNil(id) || !api) return;
    
    const provider = getNodeProvider({ ...node, testnetNetwork, networkId: id })
    const network = toNetworkName(id, testnetNetwork) as Network

    const allowedNetworks = allowedNetworkNames.map(toNetworkId)

    if (!allowedNetworks.includes(id as 0 | 1)) {
      if (!isNil(account.address) || !isNil(account.rewardAddress)) setAccount({})
      setNetworkError(disallowedNetworkError(allowedNetworks, testnetNetwork, id))
    } else {
      const [updatedLucid, address, unusedAddress, rewardAddress] = await Promise.all([
        isNil(lucid) ? Lucid.new(provider, network) : lucid.switchProvider(provider, network),
        api.getUsedAddresses().then(hexArrayToAddress),
        api.getUnusedAddresses().then(hexArrayToAddress),
        api.getRewardAddresses().then(hexArrayToAddress),
      ])

      setAccountError(!address && !unusedAddress ? invalidWalletError : undefined)
      setAccount({ address: address || unusedAddress, rewardAddress })

      const lucidWithWallet = updatedLucid.selectWallet(api as WalletApi)

      setLucid(lucidWithWallet)

      if (autoReconnect) setStoredWalletProvider(walletProvider)
      else setStoredWalletProvider(undefined)

      showToaster(getText(walletProvider), getInfo(walletProvider))
    }
  }, [lucid, networkId, walletProvider])

  const initializeWalletApiAndLucid = useCallback(async () => {
    if (!isNil(account.address) || !isNil(account.rewardAddress)) setAccount({})

    if (!window.cardano || !walletProvider || (walletProvider !== 'walletconnect' && !window.cardano[walletProvider])) {
      if (walletProvider && !window.cardano[walletProvider])
        setWalletApiError(noDappError(walletProvider))
      return
    }

    try {
      const { getProviderApi, enableEventListeners, disableEventListeners } = walletProviderHelper(walletProvider);
      const api = await getProviderApi();
      setWalletApi(api);
      setWalletApiLoading(false);

      // Note, reset all errors and warnings when wallet is changed
      setNetworkWarning(undefined)
      setAccountWarning(undefined)
      setNetworkError(undefined)
      setAccountError(undefined)
      setWalletApiError(undefined)

      const onAccountChange = async () => onAccountChangeCallback(api)

      const hasEventListener = walletProvider === "walletconnect" || (!isNil((api.experimental as any)?.on) && !isNil((api.experimental as any)?.off));

      enableEventListeners(api, onNetworkChange, onAccountChange);
      setNetworkWarning(hasEventListener ? undefined : noLiveNetworkChangeWarning)

      api.getNetworkId().then(async (id) => {
        await onNetworkChange(id)
        await updateWalletApiAndLucid(id, api)
      })

      return () => {
        disableEventListeners(api, onNetworkChange, onAccountChange);
      }
    } catch (e) {
      setAccount({})
      setLucid(undefined)
      setStoredWalletProvider(undefined)
      handleError(e);
    } finally {
      setWalletApiLoading(false)
      setAccountLoaded(true)
    }
  }, [lucid, networkId, walletProvider])

  useEffect(() => {
    (async () => {
      await initializeWalletApiAndLucid()
    })()
  }, [walletProvider])

  useEffect(() => {
    (async () => {
      await updateWalletApiAndLucid(networkId, walletApi)
    })()
  }, [networkId])
}
