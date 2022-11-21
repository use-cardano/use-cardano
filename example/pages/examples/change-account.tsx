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

  const warning = cardano.warnings.find((w) => w.type === "NO_LIVE_ACCOUNT_CHANGE")

  const loadingContent = (address?: string | null) => (
    <>{cardano.account.loaded ? <>{address || <br />}</> : <>Loading ...</>}</>
  )

  return (
    <div className={styles.container}>
      <h1>Change Account example</h1>

      <div>{cardano.walletProvider.Selector}</div>

      <br />

      <div>
        Change account in your wallet provider extension and see the addresses updating here.
      </div>

      <br />

      <div className={styles.warning}>{warning?.message || "Live account change is supported"}</div>

      <br />

      <div>
        <b>Current used address</b>
      </div>

      <div>{loadingContent(cardano.account.address)}</div>

      <br />

      <div>
        <b>Current unused address</b>
      </div>

      <div>{loadingContent(cardano.account.unusedAddress)}</div>

      <br />

      <div>
        <b>Current reward address</b>
      </div>

      <div>{loadingContent(cardano.account.rewardAddress)}</div>
    </div>
  )
}

export default ChangeAccountExamplePage
