import { ExampleWrapper } from "components/ExampleWrapper"
import { options } from "config/use-cardano-options"
import styles from "styles/example.module.css"
import { CardanoWalletSelector } from "use-cardano"

const AutoConnectToEternlExample = () => (
  <>
    <div>
      In this example, as you refresh you page, it should automatically attempt to connect to
      Eternl. It should not reconnect to the last selected wallet.
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

const AutoConnectToEternlExamplePage = () => (
  <ExampleWrapper options={{ ...options, autoConnectTo: "eternl", autoReconnect: false }}>
    <AutoConnectToEternlExample />
  </ExampleWrapper>
)

export default AutoConnectToEternlExamplePage
