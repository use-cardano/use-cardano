import { baseConfig } from "config/use-cardano-config"
import * as utils from "lib/always-succeed-utils"
import { useCallback, useEffect, useState } from "react"
import styles from "styles/example.module.css"
import { useCardano, useCardanoContext, WalletProviderSelector } from "use-cardano"

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

let timeout: ReturnType<typeof setTimeout>

const LucidAlwaysSucceedExamplePage = () => {
  useCardano({ ...baseConfig, allowedNetworks: ["testnet"] })

  const [lovelace, setLovelace] = useState(0)
  const [feedback, setFeedback] = useState<string>()
  const [error, setError] = useState<string>()
  const [isLocking, setIsLocking] = useState(false)
  const [isRedeeming, setIsRedeeming] = useState(false)

  const { lucid } = useCardanoContext()

  useEffect(() => {
    if (!feedback) return

    timeout = setTimeout(() => {
      setFeedback(undefined)
    }, 5000)

    return () => clearTimeout(timeout)
  }, [feedback])

  const lockUtxo = useCallback(
    async (value: number) => {
      if (!lucid) return
      if (isLocking || isRedeeming) return

      setError(undefined)
      setIsLocking(true)

      try {
        const tx = await utils.lockUtxo(lucid, BigInt(value))

        setFeedback(`Locked ${value} lovelace in tx ${tx}`)
      } catch (e) {
        setFeedback(undefined)
        if (e instanceof Error) setError(e.message)
      } finally {
        setIsLocking(false)
      }
    },
    [lucid, isLocking, isRedeeming]
  )

  const redeemUtxo = useCallback(async () => {
    if (!lucid) return
    if (isLocking || isRedeeming) return

    setError(undefined)
    setIsRedeeming(true)

    try {
      const tx = await utils.redeemUtxo(lucid)

      setFeedback(`Redeemed all available lovelace in tx ${tx}`)
    } catch (e) {
      setFeedback(undefined)
      if (e instanceof Error) setError(e.message)
    } finally {
      setIsRedeeming(false)
    }
  }, [lucid, isLocking, isRedeeming])

  return (
    <>
      <div>
        <WalletProviderSelector />
      </div>

      <br />

      <div>This is a port of the Lucid example Always Succeed.</div>

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
              if (error) setError(undefined)

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
          onClick={() => lockUtxo(lovelace)}
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

      {feedback && (
        <>
          <br />

          <div>
            <small className={styles.info}>{feedback}</small>
          </div>
        </>
      )}

      {error && (
        <>
          <br />

          <div className={styles.warning}>
            <small className={styles.info}>{error}</small>
          </div>
        </>
      )}
    </>
  )
}

export default LucidAlwaysSucceedExamplePage
