import { ExampleWrapper } from "components/ExampleWrapper"
import { baseConfig } from "config/use-cardano-config"
import { isNil } from "lodash"
import { useCardano, utility, WalletProviderSelector } from "use-cardano"

const OnlyMainnetExample = () => {
  const { networkId, isValid } = useCardano()

  return (
    <>
      <div>
        <WalletProviderSelector />
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
