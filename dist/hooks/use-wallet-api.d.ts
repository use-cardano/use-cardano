import { WalletApi } from "lucid-cardano";
declare type WalletApiName = "nami" | "eternl" | "ccvault";
declare const useWalletApi: (name: WalletApiName) => {
    walletApi: WalletApi | undefined;
    error: Error | undefined;
};
export { useWalletApi };
