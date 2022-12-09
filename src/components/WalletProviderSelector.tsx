import { supportedWalletProviders as allProviders } from "constants/supported-wallet-providers"
import { useCardanoContext } from "contexts/use-cardano-context"
import { WalletProvider } from "hooks/use-cardano"
import { useOutsideClick } from "hooks/use-outside-click"
import { setStoredWalletProvider } from "lib/local-storage"
import { shortAddress } from "lib/short-address"
import { useState } from "react"

export const WalletProviderSelector = (autoReconnect?: boolean) => {
  const { ref, open, setOpen } = useOutsideClick()

  const {
    account,
    availableProviders,
    walletApiLoading,
    walletProvider,
    setWalletApiLoading,
    setWalletProvider,
  } = useCardanoContext()

  const onWalletProviderChange = (provider: WalletProvider) => {
    setWalletApiLoading(true)
    setWalletProvider(provider)
    if (autoReconnect) setStoredWalletProvider(provider)
  }

  const openerClasses = ["use-cardano-wallet-provider-selector-opener"]

  if (open) openerClasses.push("use-cardano-wallet-provider-selector-opener-open")
  if (walletApiLoading) openerClasses.push("use-cardano-wallet-provider-selector-opener-loading")

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
          {walletApiLoading ? "" : shortAddress(account.address) || "Select Wallet"}
        </div>
      </button>

      {open && (
        <ul className="use-cardano-wallet-provider-selector-opener-list">
          {allProviders.sort().map((provider, i) => {
            const installed = availableProviders.some((p) => p.key === provider)
            const isCurrent = provider === walletProvider

            const classes = ["use-cardano-wallet-provider-selector-opener-list-item"]

            if (installed && !isCurrent)
              classes.push("use-cardano-wallet-provider-selector-opener-list-item-available")

            if (!installed)
              classes.push("use-cardano-wallet-provider-selector-opener-list-item-not-installed")

            if (i === allProviders.length - 1)
              classes.push("use-cardano-wallet-provider-selector-opener-list-item-last")

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
