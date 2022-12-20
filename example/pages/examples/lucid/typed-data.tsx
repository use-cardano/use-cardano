import { ExampleWrapper } from "components/ExampleWrapper"
import { options } from "config/use-cardano-options"
import * as utils from "lib/typed-data-utils"
import { isNil } from "lodash"
import { useCallback, useMemo, useState } from "react"
import styles from "styles/example.module.css"
import { CardanoWalletSelector, useCardano, utility } from "use-cardano"

const TypedDataExample = () => {
  const { lucid, showToaster } = useCardano()

  const [address, setAddress] = useState<string>()

  const sendDatum = useCallback(async () => {
    try {
      if (!lucid || !address) return

      const nftTx = await utils.send(lucid, address)

      showToaster(`Datum sent to ${address}`, `Transaction: ${nftTx}`)
    } catch (e) {
      if (utility.isError(e)) showToaster("Could not send Datum", e.message)
      else if (typeof e === "string") showToaster("Could not send Datum", e)
    }
  }, [lucid, address, showToaster])

  const canSend = useMemo(() => !isNil(lucid) && !isNil(address), [lucid, address])

  return (
    <>
      <div>
        <CardanoWalletSelector />
      </div>

      <br />

      <div>
        This is a port of the Lucid &quot;Typed Data&quot; example. It shows how you can pay to a
        public key or native script address with a typed Datum.
      </div>
      <br />

      <div>
        <label>
          <span className={styles.label}>Address</span>
          <input
            className={styles.input}
            type="text"
            name="message"
            value={address || ""}
            onChange={(e) => setAddress(e.target.value.toString())}
          />
        </label>
      </div>

      <br />

      <div>
        <button disabled={!canSend} onClick={sendDatum} className={styles.button}>
          Send Datum
        </button>
      </div>
    </>
  )
}

const TypedDataExamplePage = () => (
  <ExampleWrapper options={{ ...options, allowedNetworks: ["Testnet"] }}>
    <TypedDataExample />
  </ExampleWrapper>
)

export default TypedDataExamplePage
