import { baseConfig } from "config/use-cardano-config"
import * as mintingUtils from "lib/minting-utils"
import { useCallback, useEffect, useMemo, useState } from "react"
import styles from "styles/example.module.css"
import { useCardano, useCardanoContext, WalletProviderSelector } from "use-cardano"

let timeout: ReturnType<typeof setTimeout>

const LucidSimpleMintExamplePage = () => {
  useCardano({ ...baseConfig, allowedNetworks: ["testnet"] })

  const { lucid, account } = useCardanoContext()

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
      if (!lucid || !account?.address || !name) return

      const nftTx = await mintingUtils.mintNFT({ lucid, address: account.address, name })

      setTransaction(nftTx)
    } catch (e) {
      console.error(e)
    }
  }, [lucid, account?.address, name])

  const burnNFT = useCallback(async () => {
    setTransaction(undefined)

    try {
      if (!lucid || !account?.address || !name) return

      const nftTx = await mintingUtils.burnNFT({ lucid, address: account?.address, name })

      setTransaction(nftTx)
    } catch (e) {
      console.error(e)
    }
  }, [lucid, account?.address, name])

  const canMint = useMemo(() => lucid && account?.address && name, [lucid, account?.address, name])

  return (
    <>
      <div>
        <WalletProviderSelector />
      </div>

      <br />

      <div>
        This is a port of the Lucid &quot;Simple Mint&quot; example. It shows how to mint and burn
        NFTs using Lucid. This example uses a simple minting policy, which is that it is unique to
        the signer. If you change account, the policy id will change.
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

      <br />

      <div>
        <button disabled={!canMint} onClick={burnNFT} className={styles.button}>
          Burn NFT
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

export default LucidSimpleMintExamplePage
