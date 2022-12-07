import { baseConfig } from "config/use-cardano-config"
import { mintingUtils } from "lib/minting-utils"
import { Script } from "lucid-cardano"
import { useCallback, useEffect, useMemo, useState } from "react"
import styles from "styles/example.module.css"
import { useCardano, useCardanoContext, WalletProviderSelector } from "use-cardano"

const MintExamplePage = () => {
  useCardano({ ...baseConfig, allowedNetworks: ["testnet"] })

  const { lucid, account } = useCardanoContext()

  const [mintingPolicy, setMintingPolicy] = useState<Script>()
  const [policyId, setPolicyId] = useState<string>()
  const [name, setName] = useState("")

  useEffect(() => {
    if (!lucid || !account?.address) return

    const newMintingPolicy = mintingUtils.getMintingPolicy(lucid, account.address)
    const newPolicyId = mintingUtils.getPolicyId(lucid, newMintingPolicy)

    setMintingPolicy(newMintingPolicy)
    setPolicyId(newPolicyId)
  }, [lucid, account?.address])

  const mintNFT = useCallback(async () => {
    try {
      if (!lucid || !mintingPolicy || !policyId || !name) return

      const nft = await mintingUtils.mintNFT({ lucid, mintingPolicy, policyId, name })

      console.log("minted NFT", nft)
    } catch (e) {
      console.error(e)
    }
  }, [lucid, mintingPolicy, policyId, name])

  const burnNFT = useCallback(async () => {
    try {
      if (!lucid || !mintingPolicy || !policyId || !name) return

      const nft = await mintingUtils.burnNFT({ lucid, mintingPolicy, policyId, name })

      console.log("burned NFT", nft)
    } catch (e) {
      console.error(e)
    }
  }, [lucid, mintingPolicy, policyId, name])

  const canMint = useMemo(
    () => lucid && mintingPolicy && policyId && name,
    [lucid, mintingPolicy, policyId, name]
  )

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

export default MintExamplePage
