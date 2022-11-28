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
      </ul>
    </div>
  )
}

export default Index
