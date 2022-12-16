import { ExampleWrapper } from "components/ExampleWrapper"
import { baseConfig } from "config/use-cardano-config"
import * as utils from "lib/always-succeed-utils"
import { useCallback, useState } from "react"
import styles from "styles/example.module.css"
import { useCardano, WalletSelector } from "use-cardano"

/*
  AlwaysSucceeds Example
  Lock a UTxO with some ADA
  UTxO can be unlocked by anyone
  Showcasing PlutusV2
  Contract:
  validate :: () -> () -> ScriptContext -> Bool
  validate _ _ _ = True

  See underlying code in lib/always-succeed-utils.ts
 */

const AlwaysSucceedExample = () => {
  const { lucid, showToaster, hideToaster } = useCardano()

  const [lovelace, setLovelace] = useState(0)
  const [isLocking, setIsLocking] = useState(false)
  const [isRedeeming, setIsRedeeming] = useState(false)

  const lockUtxo = useCallback(
    async (value: number) => {
      if (!lucid) return
      if (isLocking || isRedeeming) return

      setIsLocking(true)

      try {
        const tx = await utils.lockUtxo(lucid, BigInt(value))

        showToaster("Locked UTXO", `Locked ${value} lovelace in tx ${tx}`)
      } catch (e) {
        if (e instanceof Error) showToaster("Could not lock UTXO", e.message)
      } finally {
        setIsLocking(false)
      }
    },
    [lucid, isLocking, isRedeeming, showToaster]
  )

  const redeemUtxo = useCallback(async () => {
    if (!lucid) return
    if (isLocking || isRedeeming) return

    setIsRedeeming(true)

    try {
      const tx = await utils.redeemUtxo(lucid)

      showToaster("Redeemed UTXO", `Redeemed all available lovelace in tx ${tx}`)
    } catch (e) {
      if (e instanceof Error) showToaster("Could not redeem UTXO", e.message)
    } finally {
      setIsRedeeming(false)
    }
  }, [lucid, isLocking, isRedeeming, showToaster])

  return (
    <>
      <div>
        <WalletSelector />
      </div>

      <br />

      <div>
        This is a port of the Lucid &quot;Always Succeed&quot; example. It also an example of how to
        use the use-cardano toaster to display custom messages.
      </div>

      <br />

      <div>
        <label>
          <span className={styles.label}>Lovelace</span>
          <input
            className={styles.input}
            type="number"
            min="0"
            step="1000"
            name="amount"
            value={lovelace}
            onChange={(e) => {
              setLovelace(Number(e.target.value))
            }}
          />
        </label>
      </div>

      <br />

      <div>
        <button
          disabled={!lucid || isLocking || lovelace <= 0}
          className={styles.button}
          onClick={() => {
            hideToaster()
            lockUtxo(lovelace)
          }}
        >
          Lock Utxo
        </button>

        {isLocking && <span className={styles.loading}> Locking...</span>}
      </div>

      <br />

      <div>
        <button disabled={!lucid || isRedeeming} className={styles.button} onClick={redeemUtxo}>
          Redeem Utxo
        </button>

        {isRedeeming && <span className={styles.loading}> Redeeming...</span>}
      </div>
    </>
  )
}

const LucidAlwaysSucceedExamplePage = () => (
  <ExampleWrapper options={{ ...baseConfig, allowedNetworks: ["testnet"] }}>
    <AlwaysSucceedExample />
  </ExampleWrapper>
)

export default LucidAlwaysSucceedExamplePage
