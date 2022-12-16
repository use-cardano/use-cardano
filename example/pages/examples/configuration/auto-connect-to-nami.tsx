import { ExampleWrapper } from "components/ExampleWrapper"
import { baseConfig } from "config/use-cardano-config"
import styles from "styles/example.module.css"
import { WalletSelector } from "use-cardano"

const AutoConnectToNamiExample = () => (
  <>
    <div>
      In this example, as you refresh you page, it should automatically attempt to connect to Nami.
      It should not reconnect to the last selected wallet.
    </div>

    <br />

    <div>
      <WalletSelector />
    </div>

    <br />

    <div className={styles.info}>
      Other examples can affect the behavior of this example. Clear local storage, key{" "}
      <b>use-cardano/reconnect-to</b>, to reset the example.
    </div>
  </>
)

const AutoConnectToNamiExamplePage = () => (
  <ExampleWrapper options={{ ...baseConfig, autoConnectTo: "nami", autoReconnect: false }}>
    <AutoConnectToNamiExample />
  </ExampleWrapper>
)

export default AutoConnectToNamiExamplePage
