import { ExampleWrapper } from "components/ExampleWrapper"
import { options } from "config/mynth-use-cardano-options"
import { CardanoToaster, CardanoWalletSelector, useCardano } from "mynth-use-cardano"

const CustomizationToasterPositionExample = () => {
  const { account } = useCardano()

  return (
    <div>
      <CardanoToaster position="bottomright" />
      <CardanoToaster position="topleft" />
      <CardanoToaster position="bottomleft" />

      <div>
        <CardanoWalletSelector />
      </div>

      <br />

      {account.address && <div>Connected to {account.address}</div>}
    </div>
  )
}

const CustomizationToasterPositionExamplePage = () => (
  <ExampleWrapper options={options}>
    <CustomizationToasterPositionExample />
  </ExampleWrapper>
)

export default CustomizationToasterPositionExamplePage
