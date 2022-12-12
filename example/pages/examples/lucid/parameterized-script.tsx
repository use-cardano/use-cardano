import { baseConfig } from "config/use-cardano-config"
import * as utils from "lib/parameterized-script-utils"
import { isObject } from "lodash"
import { useCallback, useEffect, useMemo, useState } from "react"
import styles from "styles/example.module.css"
import { useCardano, useCardanoContext, WalletProviderSelector } from "use-cardano"

const isError = (e: any): e is { message: string } =>
  e instanceof Error || (isObject(e) && typeof (e as any)?.message === "string")

const ParameterizedScriptExamplePage = () => {
  useCardano({ ...baseConfig, allowedNetworks: ["testnet"] })
  const { lucid, showToaster } = useCardanoContext()

  const [name, setName] = useState("")

  const mintNFT = useCallback(async () => {
    try {
      if (!lucid || !name) return

      const nftTx = await utils.mintNFT(lucid, name)

      showToaster("Minted NFT", `Transaction: ${nftTx}`)
    } catch (e) {
      if (isError(e)) showToaster("Could not mint NFT", e.message)
      else showToaster("Could not mint NFT", (e as any).toString())
    }
  }, [lucid, showToaster, name])

  const canMint = useMemo(() => lucid && name, [lucid, name])

  return (
    <>
      <div>
        <WalletProviderSelector />
      </div>

      <br />

      <div>
        This is a port of the Lucid &quot;Parameterized Script&quot; example. It allows you to mint
        a token using Lucid with a Plutus v2 script.
      </div>

      <br />

      <div>
        <label className={styles.label}>
          NFT Name
          <input
            className={styles.input}
            type="text"
            placeholder="name"
            value={name}
            onChange={(e) => setName(e.target.value.toString())}
          />
        </label>
      </div>

      <br />

      <div>
        <button disabled={!canMint} onClick={mintNFT} className={styles.button}>
          Mint NFT
        </button>
      </div>
    </>
  )
}

export default ParameterizedScriptExamplePage
