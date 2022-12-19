import { useCardano } from "contexts/CardanoContext"
import { useOutsideClick } from "hooks/use-outside-click"
import { concatenateClasses } from "lib/concatenate-classes"
import { shortAddress } from "lib/short-address"
import { supportedWalletProviders as allProviders } from "lib/supported-wallet-providers"
import { isNil } from "lodash"
import { useCallback, useMemo } from "react"
import { WalletProvider } from "use-cardano"

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

  const currentProvider = availableProviders.find((p) => p.key === walletProvider)
  const iconSize = walletProvider === "nami" ? "24px" : "32px"

  return (
    <div ref={ref} className="cardano-wallet-selector">
      <button
        disabled={walletApiLoading}
        className={buttonClassName}
        onClick={() => setOpen((wasOpen) => !wasOpen)}
        title={isValid ? undefined : warning?.message}
      >
        {walletApiLoading ? (
          <div className="cardano-wallet-selector__button__text">{buttonText}</div>
        ) : (
          <>
            {isValid && currentProvider?.icon && (
              <img
                className="cardano-wallet-selector__button__icon"
                src={currentProvider.icon}
                alt={`${walletProvider} icon`}
                height={iconSize}
                width={iconSize}
              />
            )}
            <div className="cardano-wallet-selector__button__text">{buttonText}</div>
            {!isValid && <span className="cardano-wallet-selector__button__warning-sign">⚠</span>}
          </>
        )}
      </button>

      {open && (
        <ul className="cardano-wallet-selector__menu">
          {allProviders.sort().map((provider) => {
            const availableProvider = availableProviders.find((p) => p.key === provider)
            const installed = !isNil(availableProvider)
            const isCurrent = provider === walletProvider

            const iconSize = provider === "nami" ? "26px" : "32px"

            const itemClassName = concatenateClasses(
              "cardano-wallet-selector__menu__item",
              isCurrent && "cardano-wallet-selector__menu__item--current"
            )

            return (
              <li key={`use-cardano-provider-select-${provider}`} className={itemClassName}>
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
                  <div className="cardano-wallet-selector__menu__item__text">
                    <span className="cardano-wallet-selector__menu__item__text__icon">
                      {availableProvider?.icon && (
                        <img
                          src={availableProvider.icon}
                          alt={`${provider} icon`}
                          height={iconSize}
                          width={iconSize}
                        />
                      )}
                    </span>

                    {provider}
                  </div>

                  {isCurrent && (
                    <span className="cardano-wallet-selector__menu__item--current__checkmark">
                      ✓
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
