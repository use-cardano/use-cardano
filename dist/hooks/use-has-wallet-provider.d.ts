import { WalletProvider } from "./use-cardano";
declare const useWalletProviders: (walletProvider: WalletProvider) => {
    currentProviderIsAvailable: boolean | undefined;
    availableWalletProviders: string[];
};
export { useWalletProviders };
