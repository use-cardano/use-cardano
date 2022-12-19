import { ExampleWrapper } from "components/ExampleWrapper"
import { options } from "config/use-cardano-options"
import { isNil } from "lodash"
import { CardanoWalletSelector, useCardano, utility } from "use-cardano"

const OnlyTestnetExample = () => {
  const { networkId, isValid } = useCardano()

  return (
    <>
      <div>
        <CardanoWalletSelector />
      </div>

      <br />

      <div>Try switching provider and network</div>

      {!isNil(networkId) && (
        <>
          <br />

          <div>Connected to {utility.toNetworkName(networkId)}</div>
        </>
      )}

      <br />

      <div>
        use-cardano is valid and can be used: <b>{isValid ? "yes" : "no"}</b>
      </div>
    </>
  )
}

const OnlyTestnetExamplePage = () => (
  <ExampleWrapper options={{ ...options, allowedNetworks: ["Testnet"] }}>
    <OnlyTestnetExample />
  </ExampleWrapper>
)

export default OnlyTestnetExamplePage
