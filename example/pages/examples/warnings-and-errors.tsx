import { ExampleWrapper } from "components/ExampleWrapper"
import { options } from "config/use-cardano-options"
import styles from "styles/example.module.css"
import { CardanoWalletSelector, useCardano } from "use-cardano"

const WarningsAndErrorsExample = () => {
  const { walletApiError, accountError, networkWarning, accountWarning } = useCardano()

  return (
    <div>
      <div>
        <div>
          <CardanoWalletSelector />
        </div>

        <br />

        <div>
          Change wallet provider and networks to see different errors and warnings as/if they occur.
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
      </div>
    </div>
  )
}

const WarningsAndErrorsExamplePage = () => (
  <ExampleWrapper options={{ ...options, allowedNetworks: ["Testnet"] }}>
    <WarningsAndErrorsExample />
  </ExampleWrapper>
)

export default WarningsAndErrorsExamplePage
