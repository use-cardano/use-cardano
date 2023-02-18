import { ExampleWrapper } from "components/ExampleWrapper"
import { options } from "config/use-cardano-options"
import { CardanoWalletSelector, UseCardanoConsumer } from "use-cardano"

const SimpleExample = () => {
  return (
    <div>
      <div>
        <CardanoWalletSelector />
      </div>

      <br />

      <UseCardanoConsumer>
        {({ account }) => account.address && <div>Connected to {account.address}</div>}
      </UseCardanoConsumer>
    </div>
  )
}

const SimpleExamplePage = () => (
  <ExampleWrapper options={options}>
    <SimpleExample />
  </ExampleWrapper>
)

export default SimpleExamplePage
