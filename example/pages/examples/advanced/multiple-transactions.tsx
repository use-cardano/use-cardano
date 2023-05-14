import { ExampleWrapper } from "components/ExampleWrapper"
import { options } from "config/use-cardano-options"
import { useMultipleTransactions } from "hooks/use-multiple-transactions"
import { Fragment } from "react"
import styles from "styles/example.module.css"
import { CardanoWalletSelector, useCardano } from "use-cardano"

const MultipleTransactionsExample = () => {
  const { isValid, lucid, networkId } = useCardano()

  const { transactions, ...tx } = useMultipleTransactions(isValid, lucid)

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

      {transactions.map(({ toAccount, policyId, lovelace }, i) => (
        <Fragment key={`transaction.${i}`}>
          <div>
            <div>
                <label>
                    <span className={styles.label}>Asset Policy ID</span>

                    <input
                        className={styles.input}
                        type="text"
                        placeholder="ADA"
                        value={policyId || ""}
                        onChange={(e) => tx.setPolicy(i, e.target.value?.toString())}
                    />
                </label>
            </div>

            <div>
              <label>
                <span className={styles.label}>To Account</span>

                <input
                  className={styles.input}
                  style={{}}
                  type="text"
                  placeholder="addr..."
                  value={toAccount}
                  onChange={(e) => tx.setToAccount(i, e.target.value?.toString())}
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
                  value={lovelace}
                  onChange={(e) => tx.setLovelace(i, e.target.value?.toString())}
                />
              </label>

              <button
                className={styles.button}
                style={{
                  padding: "0.5rem 1rem",
                  marginLeft: "1rem",
                  marginTop: 0,
                }}
                onClick={() => tx.removeTransaction(i)}
              >
                Remove transaction
              </button>
            </div>
          </div>

          <br />
        </Fragment>
      ))}


<div>
  <button className={styles.button} onClick={tx.addTransaction}>
    Add transaction
  </button>
</div>

<br />

      <div>
        <button
          disabled={!tx.canTransact || !!tx.error}
          className={styles.button}
          onClick={tx.sendTransaction}
        >
          {transactions.length > 1 ? "Send transactions" : "Send transaction"}
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

const MultipleTransactionsExamplePage = () => (
  <ExampleWrapper options={{ ...options, allowedNetworks: ["Testnet", "Mainnet"] }}>
    <MultipleTransactionsExample />
  </ExampleWrapper>
)

export default MultipleTransactionsExamplePage
