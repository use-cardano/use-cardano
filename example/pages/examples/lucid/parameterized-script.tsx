import { baseConfig } from "config/use-cardano-config"
import * as utils from "lib/parameterized-script-utils"
import { useCallback, useEffect, useMemo, useState } from "react"
import styles from "styles/example.module.css"
import { useCardano, useCardanoContext, WalletProviderSelector } from "use-cardano"

let timeout: ReturnType<typeof setTimeout>

const ParameterizedScriptExamplePage = () => {
  useCardano({ ...baseConfig, allowedNetworks: ["testnet"] })

  const { lucid } = useCardanoContext()

  const [transaction, setTransaction] = useState<string>()
  const [name, setName] = useState("")

  useEffect(() => {
    if (!transaction) return

    if (timeout) clearTimeout(timeout)

    timeout = setTimeout(() => {
      setTransaction(undefined)
    }, 10000)

    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [transaction])

  const mintNFT = useCallback(async () => {
    setTransaction(undefined)

    try {
      if (!lucid || !name) return

      const nftTx = await utils.mint(lucid, name)

      setTransaction(nftTx)
    } catch (e) {
      console.error(e)
    }
  }, [lucid, name])

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

      {transaction && (
        <>
          <br />

          <div>
            <small className={styles.info}>Transaction submitted: {transaction}</small>
          </div>
        </>
      )}
    </>
  )
}

export default ParameterizedScriptExamplePage
