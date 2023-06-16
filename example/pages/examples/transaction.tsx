import { ExampleWrapper } from "components/ExampleWrapper"
import { options } from "config/mynth-use-cardano-options"
import { useTransaction } from "hooks/use-transaction"
import styles from "styles/example.module.css"
import { CardanoWalletSelector, useCardano } from "mynth-use-cardano"

const TransactionExample = () => {
  const { isValid, lucid, networkId } = useCardano()

  const tx = useTransaction(isValid, lucid)

  return (
    <>
      <div>
        <div>
          <CardanoWalletSelector />
        </div>

        <br />

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
      </div>

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
          disabled={!tx.canTransact || !!tx.error}
          className={styles.button}
          onClick={tx.sendTransaction}
        >
          Send transaction
        </button>

        {isValid === false ? (
          <p className={styles.info}>
            <small>connect a wallet to send a transaction</small>
          </p>
        ) : !tx.successMessage && !tx.error && !tx.canTransact ? (
          <p className={styles.info}>
            <small>specify a lovelace amount and account to send a transaction</small>
          </p>
        ) : null}

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
    </>
  )
}

const TransactionExamplePage = () => (
  <ExampleWrapper options={{ ...options, allowedNetworks: ["Testnet", "Mainnet"] }}>
    <TransactionExample />
  </ExampleWrapper>
)

export default TransactionExamplePage
