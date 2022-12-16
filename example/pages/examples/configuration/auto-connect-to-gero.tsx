import { ExampleWrapper } from "components/ExampleWrapper"
import { options } from "config/use-cardano-options"
import styles from "styles/example.module.css"
import { CardanoWalletSelector } from "use-cardano"

const AutoConnectToGeroExample = () => (
  <>
    <div>
      In this example, as you refresh you page, it should automatically attempt to connect to Gero.
      It should not reconnect to the last selected wallet.
    </div>

    <br />

    <div>
      <CardanoWalletSelector />
    </div>

    <br />

    <div className={styles.info}>
      Other examples can affect the behavior of this example. Clear local storage, key{" "}
      <b>use-cardano/reconnect-to</b>, to reset the example.
    </div>
  </>
)

const AutoConnectToGeroExamplePage = () => (
  <ExampleWrapper options={{ ...options, autoConnectTo: "gerowallet", autoReconnect: false }}>
    <AutoConnectToGeroExample />
  </ExampleWrapper>
)

export default AutoConnectToGeroExamplePage
