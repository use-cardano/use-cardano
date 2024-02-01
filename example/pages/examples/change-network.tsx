import { ExampleWrapper } from "components/ExampleWrapper"
import { options as baseOptions } from "config/use-cardano-options"
import styles from "styles/example.module.css"
import { useCardano, CardanoWalletSelector, UseCardanoOptions } from "use-cardano"

const options: UseCardanoOptions = {
  ...baseOptions,
  allowedNetworks: ["Mainnet", "Testnet"],
}

const ChangeNetworkExample = () => {
  const { networkId, networkWarning: warning } = useCardano()

  return (
    <>
      <div>
        <CardanoWalletSelector />
      </div>

      <br />

      <div>Change network in your wallet provider extension and see the addresses updating here.</div>

      <br />

      <div className={styles.warning}>
        {warning?.message ||
          "Your wallet supports live network change, changing network will take effect immediately"}
      </div>

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
  <ExampleWrapper options={options}>
    <ChangeNetworkExample />
  </ExampleWrapper>
)

export default ChangeNetworkExamplePage
