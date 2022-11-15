import { UseCardanoError } from "error";
import { WalletApi } from "lucid-cardano";
declare type WalletApiName = "nami" | "eternl" | "ccvault";
declare const useWalletApi: (name: WalletApiName) => {
    walletApi: WalletApi | undefined;
    error: UseCardanoError | undefined;
};
export { useWalletApi };
