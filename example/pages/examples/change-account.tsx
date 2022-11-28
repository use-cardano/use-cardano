import { baseConfig } from "config/use-cardano-config"
import styles from "styles/index.module.css"
import { useCardano, useCardanoContext, WalletProviderSelector } from "use-cardano"

const ChangeAccountExamplePage = () => {
  useCardano(baseConfig)

  const { accountWarning: warning, account, accountLoaded } = useCardanoContext()

  const loadingContent = (address?: string | null) => (
    <>{accountLoaded ? <>{address || <br />}</> : <>Loading ...</>}</>
  )

  return (
    <div className={styles.container}>
      <h1>Change Account example</h1>

      <div>
        <WalletProviderSelector />
      </div>

      <br />

      <div>
        Change account in your wallet provider extension and see the addresses updating here.
      </div>

      <br />

      <div className={styles.warning}>{warning?.message || "Live account change is supported"}</div>

      <br />

      <div>
        <b>Current address</b>
      </div>

      <div>{loadingContent(account.address)}</div>

      <br />

      <div>
        <b>Current reward address</b>
      </div>

      <div>{loadingContent(account.rewardAddress)}</div>
    </div>
  )
}

export default ChangeAccountExamplePage
