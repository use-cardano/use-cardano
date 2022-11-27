import { useCardanoConfig } from "config/use-cardano-config"
import styles from "styles/index.module.css"
import { useCardano, useCardanoContext, WalletProviderSelector } from "use-cardano"

const config = { ...useCardanoConfig, defaultWalletProvider: undefined }

const NoDefaultWalletProviderExamplePage = () => {
  useCardano(config)

  const { walletProvider } = useCardanoContext()

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
      </div>
    </div>
  )
}

export default NoDefaultWalletProviderExamplePage
