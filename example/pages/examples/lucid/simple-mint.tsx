import { baseConfig } from "config/use-cardano-config"
import * as mintingUtils from "lib/minting-utils"
import { useCallback, useMemo, useState } from "react"
import styles from "styles/example.module.css"
import { useCardano, useCardanoContext, WalletProviderSelector } from "use-cardano"

const LucidSimpleMintExamplePage = () => {
  useCardano({ ...baseConfig, allowedNetworks: ["testnet"] })

  const { lucid, account } = useCardanoContext()

  const [name, setName] = useState("")

  const mintNFT = useCallback(async () => {
    try {
      if (!lucid || !account?.address || !name) return

      const nft = await mintingUtils.mintNFT({ lucid, address: account.address, name })

      console.log("minted NFT", nft)
    } catch (e) {
      console.error(e)
    }
  }, [lucid, account?.address, name])

  const burnNFT = useCallback(async () => {
    try {
      if (!lucid || !account?.address || !name) return

      const nft = await mintingUtils.burnNFT({ lucid, address: account?.address, name })

      console.log("burned NFT", nft)
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
    </>
  )
}

export default LucidSimpleMintExamplePage
