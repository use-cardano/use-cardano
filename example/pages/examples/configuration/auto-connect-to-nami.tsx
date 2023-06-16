import { ExampleWrapper } from "components/ExampleWrapper"
import { options } from "config/mynth-use-cardano-options"
import styles from "styles/example.module.css"
import { CardanoWalletSelector } from "mynth-use-cardano"

const AutoConnectToNamiExample = () => (
  <>
    <div>
      In this example, as you refresh you page, it should automatically attempt to connect to Nami.
      It should not reconnect to the last selected wallet.
    </div>

    <br />

    <div>
      <CardanoWalletSelector />
    </div>

    <br />

    <div className={styles.info}>
      Other examples can affect the behavior of this example. Clear local storage, key{" "}
      <b>mynth-use-cardano/reconnect-to</b>, to reset the example.
    </div>
  </>
)

const AutoConnectToNamiExamplePage = () => (
  <ExampleWrapper options={{ ...options, autoConnectTo: "nami", autoReconnect: false }}>
    <AutoConnectToNamiExample />
  </ExampleWrapper>
)

export default AutoConnectToNamiExamplePage
