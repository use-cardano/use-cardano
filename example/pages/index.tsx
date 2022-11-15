import { useState } from "react"
import { useCardano, useHasExtension, useTransaction, WalletProvider } from "use-cardano"

import styles from "../styles/index.module.css"

const Index = () => {
  const [walletProvider, setWalletProvider] = useState<WalletProvider>("nami")

  const cardano = useCardano({
    walletProvider,
    node: {
      proxyUrl: "/api/blockfrost",
      provider: "blockfrost-proxy",
    },
  })

  const hasExtension = useHasExtension(walletProvider)
  const tx = useTransaction(cardano.lucid)

  // not initialized yet
  if (!cardano.lucid) return null

  const canTransact = tx.lovelace > 0 && tx.toAccount

  const mainContent = (
    <>
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
    </>
  )

  const header = (
    <div>
      Selected Wallet Provider: {walletProvider}
      <div>
        <button onClick={() => setWalletProvider("nami")}>Nami</button>{" "}
        <button onClick={() => setWalletProvider("eternl")}>eternl</button>{" "}
        <button onClick={() => setWalletProvider("yoroi")}>yoroi</button>
      </div>
      {hasExtension === false && (
        <div className={styles.info}>
          <small>
            You do not have the {walletProvider} extension installed. Please install it or switch
            provider.
          </small>
        </div>
      )}
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
      {cardano.errors.length > 0 && (
        <>
          <br />

          <div>Errors</div>

          {cardano.errors.map((error, i) => (
            <div key={`${i}.${error.type}`} className={styles.info}>
              <small>{error.message}</small>
            </div>
          ))}
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

export default Index
