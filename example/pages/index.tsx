// import styles from "styles/index.module.css"
import Link from "next/link"

const Index = () => {
  return (
    <div>
      <ul>
        <li>
          <Link href="/examples/change-wallet-provider">Change Wallet Provider</Link>
        </li>

        <li>
          <Link href="/examples/change-account">Change Account</Link>
        </li>

        <li>
          <Link href="/examples/change-network">Change Network</Link>
        </li>

        <li>
          <Link href="/examples/transaction">Transaction</Link>
        </li>

        <li>
          <Link href="/examples/configuration/auto-connect-to-nami">
            Configuration / Auto Connect to Nami
          </Link>
        </li>

        <li>
          <Link href="/examples/configuration/auto-connect-to-eternl">
            Configuration / Auto Connect to Eternl
          </Link>
        </li>

        <li>
          <Link href="/examples/configuration/auto-reconnect">
            Configuration / Auto Reconnect
          </Link>
        </li>
        
        <li>
          <Link href="/examples/configuration/auto-connect-and-reconnect">
            Configuration / Auto Connect and Reconnect
          </Link>
        </li>
        
        <li>
          <Link href="/examples/configuration/only-mainnet">
            Configuration / Only Mainnet
          </Link>
        </li>
                
        <li>
          <Link href="/examples/configuration/only-testnet">
            Configuration / Only Testnet
          </Link>
        </li>
                
        <li>
          <Link href="/examples/configuration/mainnet-and-testnet">
            Configuration / Mainnet and Testnet
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default Index
