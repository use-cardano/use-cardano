import { ExampleWrapper } from "components/ExampleWrapper"
import { options } from "config/use-cardano-options"
import styles from "styles/example.module.css"
import { CardanoWalletSelector } from "use-cardano"

const CustomStylesExample = () => (
  <>
    <div>
      <CardanoWalletSelector />
    </div>

    <br />

    <div>This example shows how you can override use-cardano styles.</div>

    <br />

    <div>
      <small className={styles.info}>
        This example is styled with an <code>&lt;style jsx global&gt;&lt;/style&gt;</code> tag. This
        is not recommended for production use, but since you cannot import global styles in a
        next.js page, this is the only way to style the example.
      </small>
    </div>

    <br />

    <div>
      <small className={styles.info}>
        A tip is to inspect the DOM. All the stylable classes on the respective elements are visible
        with the basic styles applied.
      </small>
    </div>

    <style jsx global>
      {`
        .use-cardano-wallet-provider-toaster-container {
          background: red;
          color: white;
          font-weight: bold;
        }

        .use-cardano-wallet-provider-toaster-close {
          color: white;
        }

        .use-cardano-wallet-provider-toaster-notification-container {
          background: red;
          color: white;
        }

        .use-cardano-wallet-provider-selector-opener,
        .use-cardano-wallet-provider-selector-opener-list-item,
        .use-cardano-wallet-provider-selector-opener-list-item-last {
          border-color: darkblue;
          border-width: 8px;
        }

        .use-cardano-wallet-provider-selector-opener,
        .use-cardano-wallet-provider-selector-opener-list-item {
          background: blue;
          color: white;
        }

        .use-cardano-wallet-provider-selector-opener-list-item-not-installed {
          color: darkblue;
        }
      `}
    </style>
  </>
)

const CustomStylesExamplePage = () => (
  <ExampleWrapper options={options}>
    <CustomStylesExample />
  </ExampleWrapper>
)

export default CustomStylesExamplePage
