import { useCardanoConfig } from "pages/config/use-cardano-config"
import styles from "styles/index.module.css"
import {
    supportedWalletProviders, useCardano, useCardanoContext, WalletProviderSelector
} from "use-cardano"

const WalletProviderSelectExamplePage = () => {
  useCardano(useCardanoConfig)

  const { walletProvider, availableProviders } = useCardanoContext()

  return (
    <div
      style={{
        marginLeft: 50,
        marginTop: 50,
      }}
    >
      <div className={styles.container}>
        <div>
          <WalletProviderSelector />
        </div>

        <br />

        <div>Selected wallet: {walletProvider}</div>

        <br />

        <div>Installed wallet extensions: {availableProviders.join(", ")}</div>

        <br />

        <div>Wallet extensions supported by use-cardano: {supportedWalletProviders.join(", ")}</div>
      </div>
    </div>
  )
}

export default WalletProviderSelectExamplePage
