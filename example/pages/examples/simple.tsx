import { ExampleWrapper } from "components/ExampleWrapper"
import { baseConfig } from "config/use-cardano-config"
import { useCardano, CardanoWalletSelector } from "use-cardano"

const SimpleExample = () => {
  const { account } = useCardano()

  return (
    <div>
      <div>
        <CardanoWalletSelector />
      </div>

      <br />

      {account.address && <div>Connected to {account.address}</div>}
    </div>
  )
}

const SimpleExamplePage = () => (
  <ExampleWrapper options={baseConfig}>
    <SimpleExample />
  </ExampleWrapper>
)

export default SimpleExamplePage
