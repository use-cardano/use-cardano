# use-cardano

use-cardano is a react context, hook, and set of components that makes interacting with the Cardano blockchain easy. It allows you to build web3 applications, connect wallets and performing tasks such as signing transactions, and interacting with smart contracts. Visit the official [documentation](https://use-cardano.alangaming.com/) for installation instructions, configuration options, and live examples.

The package leverages [lucid](https://github.com/spacebudz/lucid) for transaction building and off-chain code to interact with smart contracts. For more information on that, visit the [lucid documentation](https://lucid.spacebudz.io/).

This package uses blockfrost as the Cardano node provider by default. You can sign up here with a free or paid subscription: [blockfrost](https://blockfrost.io/)
## Minimal Example

```tsx filename="minimal-example.tsx" copy
import "use-cardano/styles/use-cardano.css"
import { useCardano, CardanoProvider, CardanoWalletSelector, CardanoToaster } from "use-cardano"

const UseCardanoNodeOptions = {
  provider: 'blockfrost',
  // this exposes your API key to the client, consider using blockfrost-proxy instead
  projectId: process.env.REACT_APP_BLOCKFROST_PROJECT_ID_MAINNET
}

const UseCardanoOptions = {
  testnetNetwork: 'Preview',
  node: UseCardanoNodeOptions
}

const Content = () => {
  const { account } = useCardano()

  return (
    <>
      <CardanoWalletSelector />

      <div>Connected Address: {account.address || 'No wallet connected.'}</div>
    </>
  )
}

const App = () => (
  <CardanoProvider options={UseCardanoOptions}>
    <Content />

    <CardanoToaster />
  </CardanoProvider>
)
```

## Contributing / Development

See the [contributing](/docs/CONTRIBUTING) doc for instructions on how to contribute to the development of the library.

## LICENSE

MIT, see [LICENSE](/LICENSE) for more information.
