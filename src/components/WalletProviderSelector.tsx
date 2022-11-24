import { useCardanoContext } from "contexts/use-cardano-context"
import { WalletProvider } from "hooks/use-cardano"
import { useWalletProviders } from "hooks/use-wallet-providers"
import { useState } from "react"

interface Props extends Omit<ReturnType<typeof useWalletProviders>, "Selector"> {
  setCurrent: (walletProvider: WalletProvider) => void
}

const buttonStyle = {
  display: "flex",
  padding: "5px 10px",
  outline: "none",
  border: "0.15rem solid #555",
  backgroundColor: "white",
  color: "#222",
  fontSize: "1.25rem",
}

export const WalletProviderSelector = (providers: Props) => {
  const [open, setOpen] = useState(false)

  const { walletProviderLoading } = useCardanoContext()

  return (
    <div
      style={{
        display: "inline-block",
        position: "relative",
      }}
    >
      <button
        disabled={walletProviderLoading}
        style={{
          ...buttonStyle,
          minWidth: 150,
          borderRadius: open ? "4px 4px 0 0" : 4,
          cursor: walletProviderLoading ? "wait" : "default",
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
          {providers.current ? providers.current : "Select Wallet"}
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
          {providers.supported.map((provider, i) => {
            const installed = providers.available.includes(provider)
            const isCurrent = provider === providers.current

            return (
              <li key={`use-cardano-provider-select-${provider}`}>
                <button
                  style={{
                    ...buttonStyle,
                    borderTop: "none",
                    width: "100%",
                    borderBottom: i === providers.supported.length - 1 ? undefined : "none",
                    borderRadius: i === providers.supported.length - 1 ? "0 0 4px 4px" : undefined,
                    color: installed ? undefined : "#ccc",
                    cursor: installed && !isCurrent ? "pointer" : undefined,
                  }}
                  title={installed ? undefined : `${provider} extension is not installed`}
                  disabled={!installed}
                  onClick={() => {
                    if (!isCurrent) {
                      providers.setCurrent(provider)
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
