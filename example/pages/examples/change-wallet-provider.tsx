import styles from "styles/index.module.css"
import { supportedWalletProviders, useCardano, WalletProviderSelector } from "use-cardano"

const WalletProviderSelectExamplePage = () => {
  const cardano = useCardano({
    defaultWalletProvider: "nami",
    node: {
      provider: "blockfrost-proxy",
      proxyUrl: "/api/blockfrost",
    },
  })

  const { walletProvider, availableProviders } = cardano.context

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
