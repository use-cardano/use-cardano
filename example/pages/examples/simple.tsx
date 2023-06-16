import { ExampleWrapper } from "components/ExampleWrapper"
import { options } from "config/mynth-use-cardano-options"
import { CardanoWalletSelector, useCardano } from "mynth-use-cardano"

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
