import { UseCardanoError } from "error";
import { Lucid, WalletApi } from "lucid-cardano";
import { UseCardanoWarning } from "../warnings";
declare type walletProvider = "nami" | "eternl" | "ccvault";
declare type UseCardanoOptions = {
    walletProvider?: walletProvider;
    nodeProvider?: "blockfrost";
};
interface UseCardanoState {
    networkId?: number;
    walletApi?: WalletApi;
    lucid?: Lucid;
    warnings: UseCardanoWarning[];
    errors: UseCardanoError[];
}
declare const useCardano: (options: UseCardanoOptions) => UseCardanoState;
export type { walletProvider };
export { useCardano };
