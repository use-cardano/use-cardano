import { ExampleWrapper } from "components/ExampleWrapper"
import { baseConfig } from "config/use-cardano-config"
import { AvailableProvider, useCardanoContext } from "use-cardano"

const CustomWalletProviderSelectorExample = () => {
  const { availableProviders, setWalletProvider } = useCardanoContext()

  return (
    <>
      <div
        style={{
          maxWidth: "400px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        {availableProviders.map((provider: AvailableProvider) => (
          <div key={provider.key}>
            <button onClick={() => setWalletProvider(provider.key)}>{provider.name}</button>
          </div>
        ))}
      </div>

      <br />

      <div>
        Example showing how you can build your own custom component using the underlying data from
        use-cardano.
      </div>
    </>
  )
}

const CustomWalletProviderSelectorExamplePage = () => (
  <ExampleWrapper options={baseConfig}>
    <CustomWalletProviderSelectorExample />
  </ExampleWrapper>
)

export default CustomWalletProviderSelectorExamplePage
