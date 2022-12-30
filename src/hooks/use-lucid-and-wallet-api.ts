import { useCardano } from "contexts/CardanoContext"
import {
    disallowedNetworkError, invalidWalletError, noAccountSetError, noDappError, unknownError,
    userRejectedError
} from "lib/errors"
import { getNodeProvider } from "lib/get-node-provider"
import { getInfo, getText } from "lib/get-toaster-texts"
import { hexArrayToAddress } from "lib/hex-array-to-address"
import { setStoredWalletProvider } from "lib/local-storage"
import { toNetworkId, toNetworkName } from "lib/network-dictionary"
import { hasErrorCode } from "lib/utils/has-error-code"
import { isError } from "lib/utils/is-error"
import { noLiveNetworkChangeWarning } from "lib/warnings"
import { isNil } from "lodash"
import { Lucid, WalletApi } from "lucid-cardano"
import { useCallback, useEffect, useState } from "react"
import { UseCardanoOptionsWithDefaults } from "use-cardano"

let longPollingInterval: NodeJS.Timeout | undefined

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
    setWalletProvider,
    setWalletApi,
    setWalletApiError,
    setWalletApiLoading,
    setNetworkWarning,
    setAccountWarning,
    setNetworkError,
    setAccountError,
  } = useCardano()

  const [forceReload, setForceReload] = useState(0)

  const onNetworkChange = useCallback(
    (id: unknown) => {
      const newNetworkId = id === "string" ? parseInt(id) : (id as number)
      if (networkId !== newNetworkId) setNetworkId(newNetworkId)
    },
    [networkId]
  )

  const onAccountChangeCallback = async (walletApi: WalletApi) => {
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

  const initializeWalletApiAndLucid = useCallback(async () => {
    console.log("initializing wallet api 1")

    if (!isNil(account.address) || !isNil(account.rewardAddress)) setAccount({})

    console.log("initializing wallet api 2")

    if (!window.cardano || !walletProvider || !window.cardano[walletProvider]) {
      if (walletProvider && !window.cardano[walletProvider])
        setWalletApiError(noDappError(walletProvider))

      console.log("initializing wallet api 3a")

      return
    }

    console.log("initializing wallet api 3b")

    try {
      const api = await window.cardano[walletProvider].enable()

      // Note, reset all errors and warnings when wallet is changed
      setNetworkWarning(undefined)
      setAccountWarning(undefined)
      setNetworkError(undefined)
      setAccountError(undefined)
      setWalletApiError(undefined)

      // We must fetch network id here, since it is not available before a wallet is connected
      const networkId = (await api.getNetworkId()) as 0 | 1
      const provider = getNodeProvider({ ...node, testnetNetwork, networkId })
      const network = toNetworkName(networkId, testnetNetwork)

      const allowedNetworks = allowedNetworkNames.map(toNetworkId)

      setWalletApi(api)

      const onAccountChange = async () => onAccountChangeCallback(api)

      const hasEventListener = !isNil(api.experimental?.on) && !isNil(api.experimental?.off)

      setNetworkWarning(hasEventListener ? undefined : noLiveNetworkChangeWarning)

      api.getNetworkId().then(onNetworkChange)

      if (hasEventListener) {
        api.experimental.on("networkChange", onNetworkChange)
        api.experimental.on("accountChange", onAccountChange)
      } else {
        if (longPollingInterval) clearInterval(longPollingInterval)

        longPollingInterval = setInterval(async () => {
          // interacting with the api will fail if the account of network has changed, use this to communicate to the user
          try {
            await api.getNetworkId()
          } catch (e) {
            setWalletProvider(undefined)
            setAccount({})
            setLucid(undefined)
            setWalletApi(undefined)

            showToaster(
              "Account or network changed",
              "The active account or network in your connected wallet has changed. Please re-connect your wallet."
            )

            clearInterval(longPollingInterval)
          }
        }, 5000)
      }

      if (!allowedNetworks.includes(networkId)) {
        if (!isNil(account.address) || !isNil(account.rewardAddress)) setAccount({})
        setNetworkError(disallowedNetworkError(allowedNetworks, testnetNetwork, networkId))
      } else {
        const [updatedLucid, address, unusedAddress, rewardAddress] = await Promise.all([
          isNil(lucid) ? Lucid.new(provider, network) : lucid.switchProvider(provider, network),
          api.getUsedAddresses().then(hexArrayToAddress),
          api.getUnusedAddresses().then(hexArrayToAddress),
          api.getRewardAddresses().then(hexArrayToAddress),
        ])

        setAccountError(!address && !unusedAddress ? invalidWalletError : undefined)
        setAccount({ address: address || unusedAddress, rewardAddress })

        const lucidWithWallet = updatedLucid.selectWallet(api)

        setLucid(lucidWithWallet)

        if (autoReconnect) setStoredWalletProvider(walletProvider)
        else setStoredWalletProvider(undefined)

        showToaster(getText(walletProvider), getInfo(walletProvider))
      }

      return () => {
        if (hasEventListener) {
          api.experimental.off("networkChange", onNetworkChange)
          api.experimental.off("accountChange", onAccountChange)
        } else {
          if (longPollingInterval) clearInterval(longPollingInterval)
        }
      }
    } catch (e) {
      setAccount({})
      setLucid(undefined)
      setWalletProvider(undefined)
      setStoredWalletProvider(undefined)

      if (isError(e)) {
        switch (e.message) {
          case "user reject":
            setWalletApiError(userRejectedError)
            break
          case "no account set":
            setWalletApiError(noAccountSetError(walletProvider))
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
            setWalletApiError(noAccountSetError(walletProvider))
            break
          default:
            if (e instanceof Error) setWalletApiError(unknownError(e))
            break
        }
      }
    } finally {
      setWalletApiLoading(false)
      setAccountLoaded(true)
    }
  }, [lucid, networkId, walletProvider])

  useEffect(() => {
    ;(async () => {
      await initializeWalletApiAndLucid()
    })()
  }, [networkId, walletProvider, forceReload])
}
