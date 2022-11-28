import { baseConfig } from "config/use-cardano-config"
import styles from "styles/index.module.css"
import { useCardano, WalletProviderSelector } from "use-cardano"

const AutoConnectToNamiExamplePage = () => {
  useCardano({ ...baseConfig, autoConnectTo: "nami", autoReconnect: false })

  return (
    <div className={styles.container}>
      <h1>Auto Connect to Nami Example</h1>

      <div>
        In this example, as you refresh you page, it should automatically attempt to connect to
        Nami. It should not reconnect to the last selected wallet.
      </div>

      <br />

      <WalletProviderSelector />

      <br />
      <br />

      <div className={styles.info}>
        Other examples can affect the behavior of this example. Clear local storage, key{" "}
        <b>use-cardano/reconnect-to</b>, to reset the example.
      </div>
    </div>
  )
}

export default AutoConnectToNamiExamplePage
