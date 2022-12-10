import { baseConfig } from "config/use-cardano-config"
import * as utils from "lib/matching-numbers-utils"
import { isNil } from "lodash"
import { UTxO } from "lucid-cardano"
import { useCallback, useEffect, useState } from "react"
import styles from "styles/example.module.css"
import { useCardano, useCardanoContext, WalletProviderSelector } from "use-cardano"

/*
  MatchingNumbers Example
  Lock a UTxO with a number and some ADA
  UTxO can be unlocked when the same number is provided in the redeemer
  Contract:
  validate :: Integer -> Integer -> ScriptContext -> Bool
  validate a b _ = a == b

  See underlying code in lib/matching-numbers-utils.ts
 */

let interval: ReturnType<typeof setInterval>

const LucidMatchingNumbersExamplePage = () => {
  useCardano({ ...baseConfig, allowedNetworks: ["testnet"] })

  const [lockedData, setLockedData] = useState<UTxO>()
  const [number, setNumber] = useState(1) // "Dictionary" key / number
  const [lovelace, setLovelace] = useState(0)
  const [isLocking, setIsLocking] = useState(false)
  const [isRedeeming, setIsRedeeming] = useState(false)

  const { lucid, showToaster, hideToaster } = useCardanoContext()

  // Continuously fetch locked data
  useEffect(() => {
    if (!lucid) return

    if (!lockedData) utils.getLockedData(lucid).then(setLockedData)

    if (interval) clearInterval(interval)

    interval = setInterval(() => {
      utils.getLockedData(lucid).then(setLockedData)
    }, 10000)

    return () => clearInterval(interval)
  }, [lucid, lockedData])

  const lockUtxo = useCallback(
    async (value: number) => {
      if (!lucid) return
      if (isLocking || isRedeeming) return

      setIsLocking(true)

      try {
        const tx = await utils.lockUtxo(lucid, number, BigInt(value))

        showToaster("Locked UTXO", `Locked ${value} lovelace at key ${number} in tx ${tx}`)
        setNumber(1)
        setLovelace(0)
      } catch (e) {
        if (e instanceof Error) showToaster("Could not lock UTXO", e.message)
      } finally {
        setIsLocking(false)
      }
    },
    [lucid, isLocking, isRedeeming, showToaster, number]
  )

  const redeemUtxo = useCallback(async () => {
    if (!lucid) return
    if (isLocking || isRedeeming) return

    setIsRedeeming(true)

    try {
      const tx = await utils.redeemUtxo(lucid, number)

      showToaster("Redeemed UTXO", `Redeemed all available lovelace from key ${number} in tx ${tx}`)
    } catch (e) {
      if (e instanceof Error) showToaster("Could not redeem UTXO", e.message)
    } finally {
      setIsRedeeming(false)
    }
  }, [lucid, isLocking, isRedeeming, showToaster, number])

  return (
    <>
      <div>
        <WalletProviderSelector />
      </div>

      <br />

      <div>
        This is a port of the Lucid &quot;Matching Numbers&quot; example. It lets you lock and
        redeem lovelace with a specific number as a key. If you lock lovelace under a number, it
        will override the previously locked number.
      </div>

      {!isNil(lockedData?.assets["lovelace"]) && (
        <>
          <br />

          <div>{(lockedData?.assets["lovelace"] as BigInt).toString()} lovelace locked</div>
        </>
      )}

      <br />

      <div>
        <label>
          <span className={styles.label}>Number / Key</span>
          <input
            className={styles.input}
            type="number"
            min="1"
            step="1"
            name="number/ key"
            value={number}
            onChange={(e) => {
              setNumber(Number(e.target.value))
            }}
          />
        </label>
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
          disabled={!lucid || isLocking || lovelace <= 0 || number <= 0}
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
        <button
          disabled={!lucid || isRedeeming || isNil(number)}
          className={styles.button}
          onClick={redeemUtxo}
        >
          Redeem Utxo
        </button>

        {isRedeeming && <span className={styles.loading}> Redeeming...</span>}
      </div>
    </>
  )
}

export default LucidMatchingNumbersExamplePage
