// import styles from "styles/index.module.css"
import Link from "next/link"

const Index = () => {
  return (
    <div>
      <ul>
        <li>
          <Link href="/examples/wallet-select">Wallet Select</Link>
        </li>

        <li>
          <Link href="/examples/transaction">Transaction</Link>
        </li>
      </ul>
    </div>
  )
}

export default Index
