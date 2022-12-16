import { ExampleWrapper } from "components/ExampleWrapper"
import { baseConfig } from "config/use-cardano-config"
import {
  AvailableProvider,
  constants,
  useCardano,
  WalletProviderSelector,
} from "use-cardano"

const WalletProviderSelectExample = () => {
  const { walletProvider, availableProviders } = useCardano()

  return (
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
        Wallet extensions supported by use-cardano: {constants.supportedWalletProviders.join(", ")}
      </div>
    </>
  )
}

const WalletProviderSelectExamplePage = () => (
  <ExampleWrapper options={baseConfig}>
    <WalletProviderSelectExample />
  </ExampleWrapper>
)

export default WalletProviderSelectExamplePage
