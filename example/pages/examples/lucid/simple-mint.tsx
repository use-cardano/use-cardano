import { baseConfig } from "config/use-cardano-config"
import * as utils from "lib/simple-mint-utils"
import { isObject } from "lodash"
import { useCallback, useMemo, useState } from "react"
import styles from "styles/example.module.css"
import { useCardano, useCardanoContext, WalletProviderSelector } from "use-cardano"

const isError = (e: any): e is { message: string } =>
  e instanceof Error || (isObject(e) && typeof (e as any)?.message === "string")

const LucidSimpleMintExamplePage = () => {
  useCardano({ ...baseConfig, allowedNetworks: ["testnet"] })
  const { lucid, account, showToaster } = useCardanoContext()

  const [name, setName] = useState("")

  const mintNFT = useCallback(async () => {
    try {
      if (!lucid || !account?.address || !name) return

      const nftTx = await utils.mintNFT({ lucid, address: account.address, name })

      showToaster("Minted NFT", `Transaction: ${nftTx}`)
    } catch (e) {
      if (isError(e)) showToaster("Could not mint NFT", e.message)
      else showToaster("Could not mint NFT", (e as any).toString())
    }
  }, [lucid, account?.address, showToaster, name])

  const burnNFT = useCallback(async () => {
    try {
      if (!lucid || !account?.address || !name) return

      const nftTx = await utils.burnNFT({ lucid, address: account?.address, name })

      showToaster("Burned NFT", `Transaction: ${nftTx}`)
    } catch (e) {
      if (isError(e)) showToaster("Could not mint NFT", e.message)
      else showToaster("Could not mint NFT", (e as any).toString())
    }
  }, [lucid, account?.address, showToaster, name])

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
    </>
  )
}

export default LucidSimpleMintExamplePage
