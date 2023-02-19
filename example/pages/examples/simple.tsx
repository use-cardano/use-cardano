import { ExampleWrapper } from "components/ExampleWrapper"
import { options } from "config/use-cardano-options"
import { CardanoWalletSelector, useCardano } from "use-cardano"

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
  <ExampleWrapper options={options}>
    <SimpleExample />
  </ExampleWrapper>
)

export default SimpleExamplePage
