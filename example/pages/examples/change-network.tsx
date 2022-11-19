import styles from "styles/index.module.css"
import { useCardano } from "use-cardano"

const ChangeNetworkExamplePage = () => {
  const cardano = useCardano({
    defaultWalletProvider: "nami",
    node: {
      provider: "blockfrost-proxy",
      proxyUrl: "/api/blockfrost",
    },
  })

  if (!cardano.fullyInitialized) return null

  const warning = cardano.warnings.find((w) => w.type === "NO_LIVE_ACCOUNT_CHANGE")

  return (
    <div className={styles.container}>
      <h1>Change Network example</h1>

      <div>{cardano.walletProvider.Selector}</div>

      <br />

      <div>
        Change network in your wallet provider extension and see the addresses updating here.
      </div>

      <br />

      {warning ? (
        <>
          <div className={styles.warning}>{warning.message}</div>

          <br />
        </>
      ) : (
        <>
          <br />
          <br />
        </>
      )}

      <br />

      <div>
        <b>Current network</b>
      </div>

      <div>{cardano.networkId}</div>
    </div>
  )
}

export default ChangeNetworkExamplePage
