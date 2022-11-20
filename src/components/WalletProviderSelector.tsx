import { WalletProvider } from "hooks/use-cardano"
import { useWalletProviders } from "hooks/use-wallet-providers"
import { useState } from "react"

interface Props extends Omit<ReturnType<typeof useWalletProviders>, "Selector"> {
  setCurrent: (walletProvider: WalletProvider) => void
  loaded: boolean
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

  return (
    <div
      style={{
        display: "inline-block",
        position: "relative",
      }}
    >
      <button
        style={{
          ...buttonStyle,
          minWidth: 150,
          borderRadius: open ? "4px 4px 0 0" : 4,
          borderBottom: open ? "2px solid transparent" : undefined,
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
            const disabled = !installed || !providers.loaded

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
                    cursor: installed ? "pointer" : undefined,
                  }}
                  title={installed ? undefined : `${provider} extension is not installed`}
                  disabled={disabled}
                  onClick={() => {
                    providers.setCurrent(provider)
                    setOpen(false)
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
