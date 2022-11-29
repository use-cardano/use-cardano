import { baseConfig } from "config/use-cardano-config"
import styles from "styles/index.module.css"
import { useCardano, useCardanoContext, utility, WalletProviderSelector } from "use-cardano"

const OnlyMainnetExamplePage = () => {
  useCardano({
    ...baseConfig,
    allowedNetworks: ["mainnet"],
  })

  const { networkId, isValid } = useCardanoContext()

  return (
    <div className={styles.container}>
      <h1>Only Mainnet Allowed</h1>

      <div>
        <WalletProviderSelector />
      </div>

      <br />

      <div>Try switching provider and network</div>

      <br />

      <div>Connected to {utility.toNetworkName(networkId)}</div>

      <br />

      <div>
        <pre style={{ display: "inline" }}>use-cardano</pre> is valid and can be used:{" "}
        <b>{isValid ? "yes" : "no"}</b>
      </div>
    </div>
  )
}

export default OnlyMainnetExamplePage
