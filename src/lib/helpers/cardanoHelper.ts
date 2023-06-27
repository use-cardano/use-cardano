import { WalletProvider } from "mynth-use-cardano";
import { isNil } from "lodash"
import { WalletApi } from "lucid-cardano";

export const enableCardanoProvider = async (walletProvider: WalletProvider) => {
    if (window.cardano && window.cardano[walletProvider]) {
      return await window.cardano[walletProvider].enable();
    } else {
      throw new Error(`Provider ${walletProvider} is not available.`);
    }
  };

export const enableCardanoEventListeners = async (
  api: WalletApi, 
  onNetworkChange: (network: unknown) => Promise<void>, 
  onAccountChange: () => Promise<void>) => {
  const hasEventListener = !isNil(api.experimental?.on) && !isNil(api.experimental?.off)

  if (hasEventListener) {
    api.experimental?.on("networkChange", (...args: unknown[]) => {
      const [network] = args;
      if (typeof network === 'number') {
        return onNetworkChange(network);
      }
      return Promise.resolve();
    });
    
    api.experimental?.on("accountChange", (...args: unknown[]) => {
        return onAccountChange();
    });  }
}

export const disableCardanoEventListeners = async (
  api: WalletApi, 
  onNetworkChange: (network: unknown) => Promise<void>, 
  onAccountChange: () => Promise<void>) => {
  const hasEventListener = !isNil(api.experimental?.on) && !isNil(api.experimental?.off)

  if (hasEventListener) {
    api.experimental?.off("networkChange", (...args: unknown[]) => {
      const [network] = args;
      if (typeof network === 'number') {
        return onNetworkChange(network);
      }
      return Promise.resolve();
    });
    api.experimental?.off("accountChange", (...args: unknown[]) => {
      return onAccountChange();
    });  
  }
}
