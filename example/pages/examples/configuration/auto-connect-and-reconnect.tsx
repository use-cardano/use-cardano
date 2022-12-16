import { ExampleWrapper } from "components/ExampleWrapper"
import { baseConfig } from "config/use-cardano-config"
import styles from "styles/example.module.css"
import { WalletSelector } from "use-cardano"

const AutoConnectAndReconnectExample = () => (
  <>
    <div>
      In this example, as you refresh you page, it should attempt to reconnect to the last selected
      wallet. It should also automatically attempt to connect to Nami on your first visit.
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

const AutoConnectAndReconnectExamplePage = () => (
  <ExampleWrapper options={{ ...baseConfig, autoConnectTo: "nami", autoReconnect: true }}>
    <AutoConnectAndReconnectExample />
  </ExampleWrapper>
)

export default AutoConnectAndReconnectExamplePage
