import { baseConfig } from "config/use-cardano-config"
import styles from "styles/example.module.css"
import { useCardano, useCardanoContext, WalletProviderSelector } from "use-cardano"

const ManualToasterOperationsExamplePage = () => {
  useCardano({ ...baseConfig, allowedNetworks: ["mainnet", "testnet"] })

  const { hideToaster, showToaster } = useCardanoContext()

  return (
    <>
      <div>
        <WalletProviderSelector />
      </div>

      <br />

      <div>
        Switch wallet provider and then click the button below to manually hide the toaster.
      </div>

      <br />

      <div>
        <button onClick={hideToaster} className={styles.manualToasterButton}>
          Manually hide toaster
        </button>
      </div>
      <br />

      <div>
        Click the button below to manually open the toaster at any time, displaying the last set
        message.
      </div>

      <br />

      <div>
        <button onClick={() => showToaster()} className={styles.manualToasterButton}>
          Manually show toaster
        </button>
      </div>
    </>
  )
}

export default ManualToasterOperationsExamplePage
