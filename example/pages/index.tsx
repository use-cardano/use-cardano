import { useState } from "react"
import { useCardano, useHasExtension, useTransaction, WalletProvider } from "use-cardano"

import styles from "../styles/index.module.css"

const Index = () => {
  const [walletProvider, setWalletProvider] = useState<WalletProvider>("nami")
  const hasExtension = useHasExtension("nami")
  const { lucid, networkId } = useCardano({ walletProvider })
  const tx = useTransaction(lucid)

  // strict equals to avoid undefined
  if (hasExtension === false)
    return <div>This example only works with the Nami extension installed. Please install it.</div>

  // not initialized yet
  if (!lucid) return null

  const canTransact = tx.lovelace > 0 && tx.toAccount

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Cardano Lucid Blockfrost Proxy API Example</h1>

      <div>
        Selected Wallet Provider: {walletProvider}
        <div>
          <button onClick={() => setWalletProvider("nami")}>Nami</button>{" "}
          <button onClick={() => setWalletProvider("eternl")}>eternl</button>
        </div>
        {walletProvider !== "nami" && (
          <div className={styles.info}>
            <small>
              {walletProvider} does not emit events when switching networks in the wallet UI. You
              will need to <b>reload the page after switching network</b>
            </small>
          </div>
        )}
      </div>

      <br />

      <div>
        Connected to the{" "}
        <b>
          {networkId === 0
            ? "Testnet"
            : networkId === 1
            ? "Mainnet"
            : "Invalid network, use Testnet or Mainnet"}
        </b>{" "}
        Network
        <div className={styles.info}>
          <small>You can switch network in the nami wallet extension</small>
        </div>
      </div>

      {networkId === 1 && (
        <>
          <br />
          <div>
            <b className={styles.warning}>
              ⚠️ mainnet - be aware that you are sending real ADA to real people! ⚠️
            </b>
          </div>
        </>
      )}

      <br />

      <div>
        <label>
          <span className={styles.label}>To Account</span>

          <input
            className={styles.input}
            type="text"
            placeholder="addr..."
            value={tx.toAccount}
            onChange={(e) => tx.setToAccount(e.target.value?.toString())}
          />
        </label>
      </div>

      <div>
        <label>
          <span className={styles.label}>Lovelace</span>
          <input
            className={styles.input}
            type="number"
            min="0"
            step="1000"
            name="amount"
            value={tx.lovelace}
            onChange={(e) => tx.setLovelace(e.target.value?.toString())}
          />
        </label>
      </div>

      <div>
        <button
          disabled={!canTransact || !!tx.error}
          className={styles.button}
          onClick={tx.sendTransaction}
        >
          Send transaction
        </button>

        {!tx.successMessage && !tx.error && !canTransact && (
          <p className={styles.info}>
            <small>specify a lovelace amount and account to send a transaction</small>
          </p>
        )}

        {tx.error && (
          <p className={styles.info}>
            <small>{tx.error.message}</small>
          </p>
        )}

        {tx.successMessage && (
          <p className={styles.info}>
            <small>{tx.successMessage}</small>
          </p>
        )}
      </div>
    </div>
  )
}

export default Index
