import { supportedWalletProviders as allProviders } from "constants/supported-wallet-providers"
import { useCardano } from "contexts/use-cardano-context"
import { useOutsideClick } from "hooks/use-outside-click"
import { shortAddress } from "lib/short-address"
import { isNil } from "lodash"
import { useCallback, useMemo } from "react"
import { WalletProvider } from "use-cardano"
import { toNetworkName } from "utils/network-dictionary"

export const WalletSelector = () => {
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

  const openerClasses = ["use-cardano-wallet-provider-selector-opener"]

  if (open) openerClasses.push("use-cardano-wallet-provider-selector-opener-open")
  if (walletApiLoading) openerClasses.push("use-cardano-wallet-provider-selector-opener-loading")
  else if (!isValid) openerClasses.push("use-cardano-wallet-provider-selector-opener-warning")

  const chevronClasses = ["use-cardano-wallet-provider-selector-chevron"]

  if (open) chevronClasses.push("use-cardano-wallet-provider-selector-chevron-open")

  return (
    <div ref={ref} className="use-cardano-wallet-provider-selector-container">
      <button
        disabled={walletApiLoading}
        className={openerClasses.join(" ")}
        onClick={() => setOpen((wasOpen) => !wasOpen)}
      >
        <div className={chevronClasses.join(" ")}>▼</div>

        <div className="use-cardano-wallet-provider-selector-opener-text">
          {walletApiLoading
            ? ""
            : isValid
            ? shortAddress(account.address) || "Select Wallet"
            : isNil(walletProvider)
            ? "Select Wallet"
            : isNil(networkId)
            ? walletProvider
            : `${walletProvider} (${toNetworkName(networkId)})`}
        </div>
      </button>

      {open && (
        <ul className="use-cardano-wallet-provider-selector-opener-list">
          {allProviders.sort().map((provider, i) => {
            const installed = availableProviders.some((p) => p.key === provider)
            const isCurrent = provider === walletProvider

            const classes = ["use-cardano-wallet-provider-selector-opener-list-item"]

            if (!isValid)
              classes.push("use-cardano-wallet-provider-selector-opener-list-item-warning")

            if (installed && !isCurrent)
              classes.push("use-cardano-wallet-provider-selector-opener-list-item-available")

            if (!installed)
              classes.push("use-cardano-wallet-provider-selector-opener-list-item-not-installed")

            if (i === allProviders.length - 1)
              classes.push("use-cardano-wallet-provider-selector-opener-list-item-last")

            if (!isValid)
              classes.push("use-cardano-wallet-provider-selector-opener-list-item-last-warning")

            return (
              <li key={`use-cardano-provider-select-${provider}`}>
                <button
                  className={classes.join(" ")}
                  title={installed ? undefined : `${provider} extension is not installed`}
                  disabled={!installed}
                  onClick={() => {
                    if (!isCurrent) {
                      onWalletProviderChange(provider)
                      setOpen(false)
                    }
                  }}
                >
                  {provider}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
