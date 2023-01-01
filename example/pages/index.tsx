import Link from "next/link"
import exampleStyles from "styles/example.module.css"
import styles from "styles/home.module.css"

const Index = () => {
  return (
    <div className={exampleStyles.container}>
      <div>
        <h1>use-cardano examples</h1>
      </div>

      <ul className={styles.examplesList}>
        <li className={styles.item}>
          <Link className={styles.link} href="/examples/simple">
            Simple
          </Link>
        </li>

        <li className={styles.item}>
          <Link className={styles.link} href="/examples/change-wallet-provider">
            Change Wallet Provider
          </Link>
        </li>

        <li className={styles.item}>
          <Link className={styles.link} href="/examples/change-account">
            Change Account
          </Link>
        </li>

        <li className={styles.item}>
          <Link className={styles.link} href="/examples/change-network">
            Change Network
          </Link>
        </li>

        <li className={styles.item}>
          <Link className={styles.link} href="/examples/transaction">
            Transaction
          </Link>
        </li>

        <li className={styles.item}>
          <Link className={styles.link} href="/examples/warnings-and-errors">
            Warnings and Errors
          </Link>
        </li>

        <li className={styles.item}>
          <Link className={styles.link} href="/examples/listing-assets">
            Listing Assets
          </Link>
        </li>

        <li className={styles.item}>
          <Link className={styles.link} href="/examples/configuration/auto-connect-to-nami">
            Configuration / Auto Connect to Nami
          </Link>
        </li>

        <li className={styles.item}>
          <Link className={styles.link} href="/examples/configuration/auto-connect-to-eternl">
            Configuration / Auto Connect to Eternl
          </Link>
        </li>

        <li className={styles.item}>
          <Link className={styles.link} href="/examples/configuration/auto-connect-to-gero">
            Configuration / Auto Connect to Gero
          </Link>
        </li>

        <li className={styles.item}>
          <Link className={styles.link} href="/examples/configuration/auto-connect-to-flint">
            Configuration / Auto Connect to Flint
          </Link>
        </li>

        <li className={styles.item}>
          <Link className={styles.link} href="/examples/configuration/no-auto-reconnect">
            Configuration / No Auto Reconnect
          </Link>
        </li>

        <li className={styles.item}>
          <Link className={styles.link} href="/examples/configuration/auto-connect-and-reconnect">
            Configuration / Auto Connect and Reconnect
          </Link>
        </li>

        <li className={styles.item}>
          <Link className={styles.link} href="/examples/configuration/only-mainnet">
            Configuration / Only Mainnet
          </Link>
        </li>

        <li className={styles.item}>
          <Link className={styles.link} href="/examples/configuration/only-testnet">
            Configuration / Only Testnet
          </Link>
        </li>

        <li className={styles.item}>
          <Link className={styles.link} href="/examples/configuration/mainnet-and-testnet">
            Configuration / Mainnet and Testnet
          </Link>
        </li>

        <li className={styles.item}>
          <Link className={styles.link} href="/examples/customization/toaster-position">
            Customization / Toaster Position
          </Link>
        </li>

        <li className={styles.item}>
          <Link className={styles.link} href="/examples/theming/custom-styles">
            Theming / Custom Styles
          </Link>
        </li>

        <li className={styles.item}>
          <Link className={styles.link} href="/examples/manual/toaster-operations">
            Manual / Toaster Operations
          </Link>
        </li>

        <li className={styles.item}>
          <Link className={styles.link} href="/examples/manual/your-own-wallet-provider-selector">
            Manual / You Own Wallet Provider Selector
          </Link>
        </li>

        <li className={styles.item}>
          <Link className={styles.link} href="/examples/lucid/always-succeed">
            Lucid / Always Succeed
          </Link>
        </li>

        <li className={styles.item}>
          <Link className={styles.link} href="/examples/lucid/matching-keyhash">
            Lucid / Matching Keyhash
          </Link>
        </li>

        <li className={styles.item}>
          <Link className={styles.link} href="/examples/lucid/matching-numbers">
            Lucid / Matching Numbers
          </Link>
        </li>

        <li className={styles.item}>
          <Link className={styles.link} href="/examples/lucid/simple-mint">
            Lucid / Simple Mint
          </Link>
        </li>

        <li className={styles.item}>
          <Link className={styles.link} href="/examples/lucid/parameterized-script">
            Lucid / Parameterized Script
          </Link>
        </li>

        <li className={styles.item}>
          <Link className={styles.link} href="/examples/lucid/typed-data">
            Lucid / Typed Data
          </Link>
        </li>

        <li className={styles.item}>
          <Link className={styles.link} href="/examples/lucid/sign-message">
            Lucid / Sign Message
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default Index
