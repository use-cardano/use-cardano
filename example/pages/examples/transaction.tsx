import styles from "styles/index.module.css"
import { useCardano } from "use-cardano"

const TransactionExamplePage = () => {
  const cardano = useCardano({
    defaultWalletProvider: "nami",
    node: {
      provider: "blockfrost-proxy",
      proxyUrl: "/api/blockfrost",
    },
  })

  const { tx } = cardano

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
      {cardano.walletProvider.Selector}

      <br />

      {cardano.warnings.length > 0 && (
        <>
          <br />

          <div>Warnings</div>

          {cardano.warnings.map((warning, i) => (
            <div key={`${warning.type}.${i}`} className={styles.info}>
              <small>{warning.message}</small>
            </div>
          ))}
        </>
      )}
      {cardano.context.walletApiError && (
        <>
          <br />

          <div>Errors</div>

          <div className={styles.info}>
            <small>{cardano.context.walletApiError.message}</small>
          </div>
        </>
      )}
      {cardano.info.length > 0 && (
        <>
          <br />

          <div>Info</div>

          {cardano.info.map((info, i) => (
            <div key={`${i}.${info}`} className={styles.info}>
              <small>{info}</small>
            </div>
          ))}
        </>
      )}
      {cardano.networkId === 1 && (
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
    <div className={styles.container}>
      <h1 className={styles.title}>Cardano Lucid Blockfrost Proxy API Example</h1>

      {header}

      <br />

      {mainContent}
    </div>
  )
}

export default TransactionExamplePage
