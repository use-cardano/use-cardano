import { ExampleWrapper } from "components/ExampleWrapper"
import { options } from "config/use-cardano-options"
import { AvailableProvider, useCardano } from "use-cardano"

const CustomWalletSelectorExample = () => {
  const { availableProviders, setWalletProvider } = useCardano()

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

const CustomWalletSelectorExamplePage = () => (
  <ExampleWrapper options={options}>
    <CustomWalletSelectorExample />
  </ExampleWrapper>
)

export default CustomWalletSelectorExamplePage
