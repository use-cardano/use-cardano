import { WalletApi } from "lucid-cardano"
import { useEffect, useState } from "react"

type WalletApiName = "nami" | "eternl" | "ccvault"

const useWalletApi = (name: WalletApiName) => {
  const [error, setError] = useState<Error>()
  const [walletApi, setWalletApi] = useState<WalletApi>()

  useEffect(() => {
    if (!window.cardano) return
    if (!window.cardano[name]) return

    setError(undefined)

    window.cardano[name]
      .enable()
      .then(setWalletApi)
      .catch((e) => {
        console.log(e)
        // if (e instanceof Object)
        //   if ((e as any).error instanceof Error) setError((error as any).error)

        if (e instanceof Error) setError(e)
      })
  }, [name])

  return { walletApi, error }
}

export { useWalletApi }
