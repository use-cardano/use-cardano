import { baseConfig } from "config/use-cardano-config"
import { useTransaction } from "hooks/use-transaction"
import styles from "styles/example.module.css"
import { useCardano, useCardanoContext, WalletProviderSelector } from "use-cardano"

const TransactionExamplePage = () => {
  useCardano({ ...baseConfig, allowedNetworks: ["testnet", "mainnet"] })

  const { lucid, networkId, walletApiError, accountError, networkWarning, accountWarning } =
    useCardanoContext()

  const tx = useTransaction(lucid)

  const mainContent = (
    <>
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

        {!tx.successMessage && !tx.error && !tx.canTransact && (
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
    </>
  )

  const header = (
    <div>
      <div>
        <WalletProviderSelector />
      </div>

      <br />

      {(accountWarning || networkWarning) && (
        <>
          <br />

          <div>Warnings</div>

          {accountWarning && (
            <div className={styles.info}>
              <small>{accountWarning.message}</small>
            </div>
          )}

          {networkWarning && (
            <div className={styles.info}>
              <small>{networkWarning.message}</small>
            </div>
          )}
        </>
      )}

      {(walletApiError || accountError) && (
        <>
          <br />

          <div>Errors</div>

          {walletApiError && (
            <div className={styles.info}>
              <small>{walletApiError.message}</small>
            </div>
          )}

          {accountError && (
            <div className={styles.info}>
              <small>{accountError.message}</small>
            </div>
          )}
        </>
      )}

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
  )

  return (
    <>
      {header}

      <br />

      {mainContent}
    </>
  )
}

export default TransactionExamplePage
