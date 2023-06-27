import { isNil } from "lodash"
import { useEffect } from "react"
import { UseCardanoOptionsWithDefaults } from "mynth-use-cardano"

import { 
  init,
  WalletConnectConnector,
  cardanoPreprodWalletConnect,
  cardanoMainnetWalletConnect, 
  cardanoPreviewWalletConnect
} from '@dcspark/adalib';

export const useWalletConnectInitialization = (options: UseCardanoOptionsWithDefaults) => {
  const { autoReconnect, testnetNetwork, walletconnect } = options

  const initializeWalletConnect = async () => {
    if (isNil(walletconnect)) return;
  
    try {
      init(
        () => ({
          connectorName: WalletConnectConnector.connectorName(),
          connectors: [
            new WalletConnectConnector({
              relayerRegion: `wss://relay.walletconnect.com`,
              metadata: {
                description: walletconnect.desc,
                name: walletconnect.name,
                icons: walletconnect.icons,
                url: walletconnect.url
              },
              autoconnect: autoReconnect,
              qrcode: walletconnect.qrcode
            })
          ],
          chosenChain: isNil(testnetNetwork) ? cardanoMainnetWalletConnect() : 
            testnetNetwork === 'Preview' ? cardanoPreviewWalletConnect() : cardanoPreprodWalletConnect()
        }),
        walletconnect.projectId
      );
    } catch(e) {
      console.error(e)
    }
  }

  useEffect(() => {
    initializeWalletConnect()
  }, [])
}
