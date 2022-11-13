import { Lucid } from "lucid-cardano";
declare type walletProvider = "nami" | "eternl" | "ccvault";
declare type UseCardanoOptions = {
    walletProvider?: walletProvider;
    nodeProvider?: "blockfrost";
};
declare const useCardano: (options: UseCardanoOptions) => {
    networkId: number | undefined;
    walletApi: import("lucid-cardano").WalletApi | undefined;
    lucid: Lucid | undefined;
    error: Error | undefined;
};
export type { walletProvider };
export { useCardano };
