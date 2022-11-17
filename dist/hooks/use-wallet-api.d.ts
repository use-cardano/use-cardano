import { UseCardanoError } from "error";
import { WalletApi } from "lucid-cardano";
import { WalletProvider } from "./use-cardano";
declare const useWalletApi: (name: WalletProvider) => {
    walletApi: WalletApi | undefined;
    error: UseCardanoError | undefined;
};
export { useWalletApi };
