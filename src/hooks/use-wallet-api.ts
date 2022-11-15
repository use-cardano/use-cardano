import { UseCardanoError } from "error"
import { WalletApi } from "lucid-cardano"
import { useEffect, useState } from "react"

type WalletApiName = "nami" | "eternl" | "ccvault"

const useWalletApi = (name: WalletApiName) => {
  const [error, setError] = useState<UseCardanoError>()
  const [walletApi, setWalletApi] = useState<WalletApi>()

  useEffect(() => {
    if (!window.cardano) return
    if (!window.cardano[name]) return

    setError(undefined)

    window.cardano[name]
      .enable()
      .then(setWalletApi)
      .catch((e) => {
        if (e instanceof Error) {
          if (e.message === "user reject")
            setError(
              new UseCardanoError(
                "USER_REJECTED",
                "The user rejected the request to connect their wallet."
              )
            )
          if (e.message === "no account set")
            setError(
              new UseCardanoError(
                "NO_ACCOUNT_SET",
                `The user doesn't have an account with the ${name} wallet provider.`
              )
            )
          else setError(new UseCardanoError("UNKNOWN", e.message))
        }
      })
  }, [name])

  return { walletApi, error }
}

export { useWalletApi }
