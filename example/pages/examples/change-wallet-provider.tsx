import { baseConfig } from "config/use-cardano-config"
import {
    AvailableProvider, constants, useCardano, useCardanoContext, WalletProviderSelector
} from "use-cardano"

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

        <div>
          Installed wallet extensions:{" "}
          {availableProviders.map((p: AvailableProvider) => p.name).join(", ")}
        </div>

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
