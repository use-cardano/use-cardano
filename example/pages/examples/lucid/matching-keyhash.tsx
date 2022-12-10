import { baseConfig } from "config/use-cardano-config"
import * as utils from "lib/matching-keyhash-utils"
import Head from "next/head"
import { useCallback, useState } from "react"
import styles from "styles/example.module.css"
import { useCardano, useCardanoContext, WalletProviderSelector } from "use-cardano"

/*
  MatchingPubKeyHash Example
  Lock a UTxO with a PubKeyHash
  UTxO can be unlocked by providing the same PubKeyHash in the redeemer
  Showcasing Helios; Link: https://github.com/Hyperion-BT/Helios

  See underlying code in lib/matching-keyhash-utils.ts
 */

const LucidMatchingKeyhashExamplePage = () => {
  useCardano({ ...baseConfig, allowedNetworks: ["testnet"] })

  const [lovelace, setLovelace] = useState(0)
  const [isLocking, setIsLocking] = useState(false)
  const [isRedeeming, setIsRedeeming] = useState(false)

  const { lucid, showToaster, hideToaster } = useCardanoContext()

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
      <Head>
        <script
          type="module"
          async
          src="https://raw.githubusercontent.com/Hyperion-BT/Helios/v0.4.0/helios.js"
        ></script>
      </Head>

      <div>
        <WalletProviderSelector />
      </div>

      <br />

      <div>
        This is a port of the Lucid &quot;Matching Keyhash&quot; example. It works the same as the
        &quot;Always Succeed&quot; example, but with the difference that it&apos;s only the account
        that locks lovelace that is able to redeem it. It also showcases{" "}
        <a target="_blank" rel="noreferrer" href="https://github.com/Hyperion-BT/Helios">
          Helios
        </a>
        .
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

export default LucidMatchingKeyhashExamplePage
