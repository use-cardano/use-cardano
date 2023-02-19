import { ExampleWrapper } from "components/ExampleWrapper"
import { options } from "config/use-cardano-options"
import { CardanoWalletSelector, UseCardanoConsumer } from "use-cardano"

const ConsumerExample = () => {
  return (
    <div>
      <div>
        <CardanoWalletSelector />
      </div>

      <br />

      <p>
        This example uses {"</UseCardanoConsumer>"} to access the useCardano hook. This helps limit
        the number of times the component is re-renders. It&apos;s also a very convenient way to
        access the useCardano hook in a class component.
      </p>

      <UseCardanoConsumer>
        {({ account }) => account.address && <div>Connected to {account.address}</div>}
      </UseCardanoConsumer>
    </div>
  )
}

const ConsumerExamplePage = () => (
  <ExampleWrapper options={options}>
    <ConsumerExample />
  </ExampleWrapper>
)

export default ConsumerExamplePage
