import styles from "styles/index.module.css"
import { useCardano } from "use-cardano"

const WalletSelectExamplePage = () => {
  const cardano = useCardano({
    defaultWalletProvider: "nami",
    node: {
      provider: "blockfrost-proxy",
      proxyUrl: "/api/blockfrost",
    },
  })

  return (
    <div
      style={{
        marginLeft: 50,
        marginTop: 50,
      }}
    >
      <div className={styles.container}>
        <div>{cardano.walletProvider.Selector}</div>

        <br />

        <div>Selected wallet: {cardano.walletProvider.current}</div>
        
        <br />

        <div>Installed wallet extensions: {cardano.walletProvider.available.join(", ")}</div>
                
        <br />

        <div>Wallet extensions supported by use-cardano: {cardano.walletProvider.supported.join(", ")}</div>
      </div>
    </div>
  )
}

export default WalletSelectExamplePage
