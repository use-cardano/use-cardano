import { baseConfig } from "config/use-cardano-config"
import styles from "styles/example.module.css"
import { useCardano, WalletProviderSelector } from "use-cardano"

const AutoConnectToEternlExamplePage = () => {
  useCardano({ ...baseConfig, autoConnectTo: "eternl", autoReconnect: false })

  return (
    <>
      <div>
        In this example, as you refresh you page, it should automatically attempt to connect to
        Eternl. It should not reconnect to the last selected wallet.
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

export default AutoConnectToEternlExamplePage
