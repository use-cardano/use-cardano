import { ExampleWrapper } from "components/ExampleWrapper"
import { options } from "config/use-cardano-options"
import * as utils from "lib/parameterized-script-utils"
import { useCallback, useMemo, useState } from "react"
import styles from "styles/example.module.css"
import { CardanoWalletSelector, useCardano, utility } from "use-cardano"

const ParameterizedScriptExample = () => {
  const { lucid, showToaster } = useCardano()

  const [name, setName] = useState("")

  const mintNFT = useCallback(async () => {
    try {
      if (!lucid || !name) return

      const nftTx = await utils.mintNFT(lucid, name)

      showToaster("Minted NFT", `Transaction: ${nftTx}`)
    } catch (e) {
      if (utility.isError(e)) showToaster("Could not mint NFT", e.message)
      else if (typeof e === "string") showToaster("Could not mint NFT", e)
    }
  }, [lucid, showToaster, name])

  const canMint = useMemo(() => lucid && name, [lucid, name])

  return (
    <>
      <div>
        <CardanoWalletSelector />
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

const LucidParameterizedScriptExamplePage = () => (
  <ExampleWrapper options={{ ...options, allowedNetworks: ["Testnet"] }}>
    <ParameterizedScriptExample />
  </ExampleWrapper>
)

export default LucidParameterizedScriptExamplePage
