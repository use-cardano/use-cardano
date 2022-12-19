import { ExampleWrapper } from "components/ExampleWrapper"
import { options } from "config/use-cardano-options"
import { utf8ToHex } from "lucid-cardano"
import { useCallback, useState } from "react"
import styles from "styles/example.module.css"
import { CardanoWalletSelector, useCardano, utility } from "use-cardano"

const SignMessageExample = () => {
  const {
    lucid,
    showToaster,
    hideToaster,
    account: { address },
  } = useCardano()

  const [message, setMessage] = useState<string>()
  const [isSigning, setIsSigning] = useState(false)

  const signMessage = useCallback(async () => {
    if (!lucid || !address || !message) return

    setIsSigning(true)

    try {
      const payload = utf8ToHex(message)

      const signedMessage = await lucid.newMessage(address, payload).sign()
      const hasSigned: boolean = lucid.verifyMessage(address, payload, signedMessage)

      if (!hasSigned) throw new Error("Could not sign message")

      showToaster("Signed message", message)
      setMessage(undefined)
    } catch (e) {
      if (utility.isError(e)) showToaster("Could not sign message", e.message)
      else if (typeof e === "string") showToaster("Could not sign message", e)
    } finally {
      setIsSigning(false)
    }
  }, [lucid, address, message, showToaster])

  return (
    <>
      <div>
        <CardanoWalletSelector />
      </div>

      <br />

      <div>
        This is a port of the Lucid &quot;Sign Message&quot; example. It lets you enter a message
        and sign it on the blockchain using lucid.
      </div>

      <br />

      <div>
        <label>
          <span className={styles.label}>Message</span>
          <input
            className={styles.input}
            type="text"
            name="message"
            value={message || ""}
            onChange={(e) => setMessage(e.target.value.toString())}
          />
        </label>
      </div>

      <br />

      <div>
        <button
          disabled={!lucid || !address || isSigning || !message}
          className={styles.button}
          onClick={() => {
            hideToaster()
            signMessage()
          }}
        >
          Sign Message
        </button>

        {isSigning && <span className={styles.loading}> Signing...</span>}
      </div>
    </>
  )
}

const LucidSignMessageExamplePage = () => (
  <ExampleWrapper options={{ ...options, allowedNetworks: ["Testnet"] }}>
    <SignMessageExample />
  </ExampleWrapper>
)

export default LucidSignMessageExamplePage
