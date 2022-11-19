import styles from "styles/index.module.css"
import { useCardano } from "use-cardano"

const ChangeAccountExamplePage = () => {
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
      <h1>Change Account example</h1>

      <div>{cardano.walletProvider.Selector}</div>

      <br />

      <div>
        Change account in your wallet provider extension and see the addresses updating here.
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

      {cardano.account.loaded ? (
        <>
          <div>
            <b>Current used address</b>
          </div>

          <div>{cardano.account.address ? cardano.account.address : <br />}</div>

          <br />

          <div>
            <b>Current unused address</b>
          </div>

          <div>{cardano.account.unusedAddress ? cardano.account.unusedAddress : <br />}</div>

          <br />

          <div>
            <b>Current reward address</b>
          </div>

          <div>{cardano.account.rewardAddress ? cardano.account.rewardAddress : <br />}</div>
        </>
      ) : (
        <div>Loading account...</div>
      )}
    </div>
  )
}

export default ChangeAccountExamplePage
