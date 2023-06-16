# mynth-use-cardano

mynth-use-cardano is forked from use-cardano which is a react context, hook, and set of components that makes interacting with the Cardano blockchain easy. It allows you to build web3 applications, connect wallets and performing tasks such as signing transactions, and interacting with smart contracts. Visit the official [documentation](https://use-cardano.alangaming.com/) for installation instructions, configuration options, and live examples.

The package leverages [lucid](https://github.com/spacebudz/lucid) for transaction building and off-chain code to interact with smart contracts. For more information on that, visit the [lucid documentation](https://lucid.spacebudz.io/).

## Minimal Example

```tsx filename="minimal-example.tsx" copy
import "mynth-use-cardano/styles/use-cardano.css"
import { useCardano, CardanoProvider, CardanoWalletSelector, CardanoToaster } from "mynth-use-cardano"

const Content = () => {
  const { account } = useCardano()

  return (
    <>
      <CardanoWalletSelector />

      <div>Connected Address: {account.address}</div>
    </>
  )
}

const App = () => (
  <CardanoProvider options={options}>
    <Content />

    <CardanoToaster />
  </CardanoProvider>
)
```

## Contributing / Development

See the [contributing](/docs/CONTRIBUTING) doc for instructions on how to contribute to the development of the library.

## LICENSE

MIT, see [LICENSE](/LICENSE) for more information.
