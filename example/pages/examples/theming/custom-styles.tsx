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
        .cardano-toaster {
          background: red;
          color: white;
          font-weight: bold;
        }

        .cardano-toaster__close-button {
          color: white;
        }

        .cardano-toaster-notification-container {
          background: red;
          color: white;
        }

        .cardano-wallet-selector__button,
        .cardano-wallet-selector__menu__item,
        .cardano-wallet-selector__menu__item:last-child {
          border-color: darkblue;
          border-width: 8px;
        }

        .cardano-wallet-selector__button,
        .cardano-wallet-selector__menu__item button {
          background: blue;
          color: white;
        }

        .cardano-wallet-selector__menu__item:last-child button {
          border-radius: 0px;
        }

        .cardano-wallet-selector__menu__item button:disabled {
          color: darkblue;
        }

        .cardano-wallet-selector__menu__item button:not(:disabled):hover {
          background: white;
          color: blue;
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
