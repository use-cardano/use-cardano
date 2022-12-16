import { ExampleWrapper } from "components/ExampleWrapper"
import { baseConfig } from "config/use-cardano-config"
import styles from "styles/example.module.css"
import { useCardano, WalletSelector } from "use-cardano"

const ChangeAccountExample = () => {
  const { accountWarning: warning, account, accountLoaded } = useCardano()

  const loadingContent = (address?: string | null) => (
    <>{accountLoaded ? <>{address || <br />}</> : <>Loading ...</>}</>
  )

  return (
    <>
      <div>
        <WalletSelector />
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
    </>
  )
}

const ChangeAccountExamplePage = () => (
  <ExampleWrapper options={baseConfig}>
    <ChangeAccountExample />
  </ExampleWrapper>
)

export default ChangeAccountExamplePage
