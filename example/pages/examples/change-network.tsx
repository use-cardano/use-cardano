import styles from "styles/index.module.css"
import { useCardano, WalletProviderSelector } from "use-cardano"

const ChangeNetworkExamplePage = () => {
  const cardano = useCardano({
    defaultWalletProvider: "eternl",
    node: {
      provider: "blockfrost-proxy",
      proxyUrl: "/api/blockfrost",
    },
  })

  const { networkId, networkWarning: warning } = cardano.context

  return (
    <div className={styles.container}>
      <h1>Change Network example</h1>

      <div>
        <WalletProviderSelector />
      </div>

      <br />

      <div>
        Change network in your wallet provider extension and see the addresses updating here.
      </div>

      <br />

      <div className={styles.warning}>{warning?.message || "Live network change is active"}</div>

      <br />

      <div>
        <b>Current network</b>
      </div>

      <div>
        {networkId} {networkId === 1 ? "(Mainnet)" : networkId === 0 ? "(Testnet)" : ""}
      </div>
    </div>
  )
}

export default ChangeNetworkExamplePage
