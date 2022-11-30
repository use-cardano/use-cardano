import { baseConfig } from "config/use-cardano-config"
import styles from "styles/index.module.css"
import { constants, useCardano, useCardanoContext, WalletProviderSelector } from "use-cardano"

const WalletProviderSelectExamplePage = () => {
  useCardano(baseConfig)

  const { walletProvider, availableProviders } = useCardanoContext()

  return (
    <div
      style={{
        marginLeft: 50,
        marginTop: 50,
      }}
    >
      <>
        <div>
          <WalletProviderSelector />
        </div>

        <br />

        <div>Selected wallet: {walletProvider}</div>

        <br />

        <div>Installed wallet extensions: {availableProviders.join(", ")}</div>

        <br />

        <div>
          Wallet extensions supported by use-cardano:{" "}
          {constants.supportedWalletProviders.join(", ")}
        </div>
      </>
    </div>
  )
}

export default WalletProviderSelectExamplePage
