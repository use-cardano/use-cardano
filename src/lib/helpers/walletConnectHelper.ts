import { getActiveConnector } from '@dcspark/adalib';
import { EnabledAPI } from '@dcspark/adalib/dist/types/CardanoInjected';
import { noop } from 'lodash';

export const enableWalletConnect = async () => {
  return await getActiveConnector().enable();
};

export const enableWalletConnectEventListeners = async (
  api: EnabledAPI, 
  onNetworkChange: (network: unknown) => Promise<void>, 
  onAccountChange: () => Promise<void>) => {

  api.onNetworkChange(onNetworkChange as (network: number) => Promise<undefined>);
  api.onAccountChange((addresses: string[]) => { return onAccountChange() as Promise<undefined>});
}

// Since walletConnectHelper only supports one type of wallet - walletconnect, the listeners will be
// automatically cleaned up once the provider disconnects. 
export const disableWalletConnectEventListeners = async (
  api: EnabledAPI, 
  onNetworkChange: (network: unknown) => Promise<void>, 
  onAccountChange: () => Promise<void>) => noop