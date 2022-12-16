import { ExampleWrapper } from "components/ExampleWrapper"
import { baseConfig } from "config/use-cardano-config"
import styles from "styles/example.module.css"
import { WalletProviderSelector } from "use-cardano"

const AutoConnectToGeroExample = () => (
  <>
    <div>
      In this example, as you refresh you page, it should automatically attempt to connect to Gero.
      It should not reconnect to the last selected wallet.
    </div>

    <br />

    <div>
      <WalletProviderSelector />
    </div>

    <br />

    <div className={styles.info}>
      Other examples can affect the behavior of this example. Clear local storage, key{" "}
      <b>use-cardano/reconnect-to</b>, to reset the example.
    </div>
  </>
)

const AutoConnectToGeroExamplePage = () => (
  <ExampleWrapper options={{ ...baseConfig, autoConnectTo: "gerowallet", autoReconnect: false }}>
    <AutoConnectToGeroExample />
  </ExampleWrapper>
)

export default AutoConnectToGeroExamplePage
