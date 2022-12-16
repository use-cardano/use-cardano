import { ExampleWrapper } from "components/ExampleWrapper"
import { baseConfig } from "config/use-cardano-config"
import { useCardano, WalletProviderSelector } from "use-cardano"

const SimpleExample = () => {
  const { account } = useCardano()

  return (
    <div>
      <div>
        <WalletProviderSelector />
      </div>

      <br />

      <div>Hello {account.address}!</div>
    </div>
  )
}

const SimpleExamplePage = () => (
  <ExampleWrapper options={baseConfig}>
    <SimpleExample />
  </ExampleWrapper>
)

export default SimpleExamplePage
