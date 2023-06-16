import { ExampleWrapper } from "components/ExampleWrapper"
import { options } from "config/mynth-use-cardano-options"
import styles from "styles/example.module.css"
import { CardanoWalletSelector } from "mynth-use-cardano"

const NoAutoReconnectExample = () => (
  <>
    <div>
      In this example, as you refresh you page, it should <b>not</b> attempt to reconnect to the
      last selected wallet. It should not automatically attempt to connect to Nami or Eternl on your
      first visit.
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

const NoAutoReconnectExamplePage = () => (
  <ExampleWrapper options={{ ...options, autoReconnect: false }}>
    <NoAutoReconnectExample />
  </ExampleWrapper>
)

export default NoAutoReconnectExamplePage
