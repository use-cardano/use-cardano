import { supportedWalletProviders as allProviders } from "constants/supported-wallet-providers"
import { useCardano } from "contexts/CardanoContext"
import { useOutsideClick } from "hooks/use-outside-click"
import { concatenateClasses } from "lib/concatenate-classes"
import { shortAddress } from "lib/short-address"
import { isNil } from "lodash"
import { useCallback, useMemo } from "react"
import { WalletProvider } from "use-cardano"
import { toNetworkName } from "utils/network-dictionary"

export const CardanoWalletSelector = () => {
  const { ref, open, setOpen } = useOutsideClick()

  const {
    account,
    availableProviders,
    walletApiLoading,
    walletProvider,
    setWalletApiLoading,
    setWalletProvider,
    walletApiError,
    accountError,
    networkError,
    networkId,
  } = useCardano()

  const onWalletProviderChange = useCallback((provider: WalletProvider) => {
    setWalletApiLoading(true)
    setWalletProvider(provider)
  }, [])

  const isValid = useMemo(
    () => isNil(walletApiError) && isNil(accountError) && isNil(networkError),
    [walletApiError, accountError, networkError]
  )

  const warning = useMemo(
    () => networkError || walletApiError || accountError,
    [walletApiError, accountError, networkError]
  )

  const buttonClassName = concatenateClasses(
    "cardano-wallet-selector__button",
    open && "cardano-wallet-selector__button--active",
    walletApiLoading && "cardano-wallet-selector__button--loading",
    !walletApiLoading && !isValid && "cardano-wallet-selector__button--warning"
  )

  let buttonText = ""

  if (walletApiLoading) {
    buttonText = ""
  } else if (!isNil(walletProvider)) {
    if (isValid) {
      const address = shortAddress(account.address)
      if (address) buttonText = address
    } else {
      buttonText = walletProvider
    }
  } else {
    buttonText = "Select Wallet"
  }

  return (
    <div ref={ref} className="cardano-wallet-selector">
      <button
        disabled={walletApiLoading}
        className={buttonClassName}
        onClick={() => setOpen((wasOpen) => !wasOpen)}
        title={isValid ? undefined : warning?.message}
      >
        <div className="cardano-wallet-selector__button__text">{buttonText}</div>
        {!isValid && <span className="cardano-wallet-selector__button__warning-sign">⚠</span>}
      </button>

      {open && (
        <ul className="cardano-wallet-selector__menu">
          {allProviders.sort().map((provider) => {
            const installed = availableProviders.some((p) => p.key === provider)
            const isCurrent = provider === walletProvider

            return (
              <li
                key={`use-cardano-provider-select-${provider}`}
                className="cardano-wallet-selector__menu__item"
              >
                <button
                  disabled={!installed}
                  title={installed ? undefined : `${provider} extension is not installed`}
                  onClick={() => {
                    if (!isCurrent) {
                      onWalletProviderChange(provider)
                      setOpen(false)
                    }
                  }}
                >
                  {provider}

                  {isCurrent ? (
                    <span className="cardano-wallet-selector__menu__item__current-sign">✓</span>
                  ) : !installed ? (
                    <span className="cardano-wallet-selector__menu__item__warning-sign">⚠</span>
                  ) : null}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
