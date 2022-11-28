import { supportedWalletProviders as allProviders } from "constants/supported-wallet-providers"
import { useCardanoContext } from "contexts/use-cardano-context"
import { WalletProvider } from "hooks/use-cardano"
import { setStoredWalletProvider } from "lib/local-storage"
import { shortAddress } from "lib/short-address"
import { useEffect, useState } from "react"

const buttonStyle = {
  display: "flex",
  padding: "5px 10px",
  outline: "none",
  border: "0.15rem solid #555",
  backgroundColor: "white",
  color: "#222",
  fontSize: "1.25rem",
}

export const WalletProviderSelector = (autoReconnect?: boolean) => {
  const [open, setOpen] = useState(false)

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

  return (
    <div
      style={{
        userSelect: "none",
        display: "inline-block",
        position: "relative",
      }}
    >
      <button
        disabled={walletApiLoading}
        style={{
          ...buttonStyle,
          minWidth: 150,
          borderRadius: open ? "4px 4px 0 0" : 4,
          cursor: walletApiLoading ? "wait" : "default",
        }}
        onClick={() => setOpen((wasOpen) => !wasOpen)}
      >
        <div
          style={{
            transform: open ? "rotate(0deg)" : "rotate(-180deg)",
            transition: "transform 0.2s",
            marginRight: 10,
          }}
        >
          ▼
        </div>

        <div
          style={{
            textAlign: "center",
            width: "100%",
          }}
        >
          {walletApiLoading ? "" : shortAddress(account.address) || "Select Wallet"}
        </div>
      </button>

      {open && (
        <ul
          style={{
            listStyle: "none",
            position: "absolute",
            left: 0,
            top: 5,
            padding: 0,
            width: "100%",
          }}
        >
          {allProviders.sort().map((provider, i) => {
            const installed = availableProviders.includes(provider)
            const isCurrent = provider === walletProvider

            return (
              <li key={`use-cardano-provider-select-${provider}`}>
                <button
                  style={{
                    ...buttonStyle,
                    borderTop: "none",
                    width: "100%",
                    borderBottom: i === allProviders.length - 1 ? undefined : "none",
                    borderRadius: i === allProviders.length - 1 ? "0 0 4px 4px" : undefined,
                    color: installed ? undefined : "#ccc",
                    cursor: installed && !isCurrent ? "pointer" : undefined,
                  }}
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
