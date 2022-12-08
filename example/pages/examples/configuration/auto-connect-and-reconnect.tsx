import { baseConfig } from "config/use-cardano-config"
import styles from "styles/example.module.css"
import { useCardano, WalletProviderSelector } from "use-cardano"

const AutoConnectExamplePage = () => {
  useCardano({ ...baseConfig, autoConnectTo: "nami", autoReconnect: true })

  return (
    <>
      <div>
        In this example, as you refresh you page, it should attempt to reconnect to the last
        selected wallet. It should also automatically attempt to connect to Nami on your first
        visit.
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
}

export default AutoConnectExamplePage
