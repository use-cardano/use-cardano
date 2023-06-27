import { WalletProvider } from 'mynth-use-cardano';
import { enableCardanoProvider, enableCardanoEventListeners, disableCardanoEventListeners } from './cardanoHelper';
import { enableWalletConnect, enableWalletConnectEventListeners, disableWalletConnectEventListeners } from './walletConnectHelper';
import { WalletApi } from "lucid-cardano";
import { EnabledAPI } from "@dcspark/adalib/dist/types/CardanoInjected";

export const walletProviderHelper = (walletProvider: WalletProvider) => {
const getProviderApi = async () => {
    let api;
    if (walletProvider !== "walletconnect") {
      api = await enableCardanoProvider(walletProvider);
      return api;
    } else {
      api = await enableWalletConnect();
      return api;
    }
  };

    const enableEventListeners = (
    api: WalletApi | EnabledAPI, 
    onNetworkChange: (network: unknown) => Promise<void>, 
    onAccountChange: () => Promise<void>) => {
    if (walletProvider !== "walletconnect") {
      enableCardanoEventListeners(api as WalletApi, onNetworkChange, onAccountChange);
    } else {
      enableWalletConnectEventListeners(api as EnabledAPI, onNetworkChange, onAccountChange);
    }
  };

  const disableEventListeners = (
    api: WalletApi | EnabledAPI, 
    onNetworkChange: (network: unknown) => Promise<void>, 
    onAccountChange: () => Promise<void>) => {
    if (walletProvider !== "walletconnect") {
      disableCardanoEventListeners(api as WalletApi, onNetworkChange, onAccountChange);
    } else {
      disableWalletConnectEventListeners(api as EnabledAPI, onNetworkChange, onAccountChange);
    }
  };

  return { getProviderApi, enableEventListeners, disableEventListeners };
};