import { baseConfig } from "config/use-cardano-config"
import { AvailableProvider, useCardano, useCardanoContext } from "use-cardano"

const CustomWalletProviderSelectorExamplePage = () => {
  useCardano(baseConfig)

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

export default CustomWalletProviderSelectorExamplePage
