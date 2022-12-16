import { ExampleWrapper } from "components/ExampleWrapper"
import { baseConfig } from "config/use-cardano-config"
import { isNil } from "lodash"
import { useCardano, utility, WalletSelector } from "use-cardano"

const OnlyMainnetExample = () => {
  const { networkId, isValid } = useCardano()

  return (
    <>
      <div>
        <WalletSelector />
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

const OnlyMainnetExamplePage = () => (
  <ExampleWrapper options={{ ...baseConfig, allowedNetworks: ["mainnet"] }}>
    <OnlyMainnetExample />
  </ExampleWrapper>
)

export default OnlyMainnetExamplePage
