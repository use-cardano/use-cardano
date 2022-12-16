import { ExampleWrapper } from "components/ExampleWrapper"
import { options } from "config/use-cardano-options"
import { AvailableProvider, constants, useCardano, CardanoWalletSelector } from "use-cardano"

const WalletProviderSelectExample = () => {
  const { walletProvider, availableProviders } = useCardano()

  return (
    <>
      <div>
        <CardanoWalletSelector />
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
  <ExampleWrapper options={options}>
    <WalletProviderSelectExample />
  </ExampleWrapper>
)

export default WalletProviderSelectExamplePage
