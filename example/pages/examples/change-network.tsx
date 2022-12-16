import { ExampleWrapper } from "components/ExampleWrapper"
import { baseConfig } from "config/use-cardano-config"
import styles from "styles/example.module.css"
import { useCardano, CardanoWalletSelector } from "use-cardano"

const ChangeNetworkExample = () => {
  const { networkId, networkWarning: warning } = useCardano()

  return (
    <>
      <div>
        <CardanoWalletSelector />
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
    </>
  )
}

const ChangeNetworkExamplePage = () => (
  <ExampleWrapper options={baseConfig}>
    <ChangeNetworkExample />
  </ExampleWrapper>
)

export default ChangeNetworkExamplePage
