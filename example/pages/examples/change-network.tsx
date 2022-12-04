import { baseConfig } from "config/use-cardano-config"
import styles from "styles/index.module.css"
import { useCardano, useCardanoContext, WalletProviderSelector } from "use-cardano"

const ChangeNetworkExamplePage = () => {
  useCardano(baseConfig)

  const { networkId, networkWarning: warning } = useCardanoContext()

  return (
    <>
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
    </>
  )
}

export default ChangeNetworkExamplePage
