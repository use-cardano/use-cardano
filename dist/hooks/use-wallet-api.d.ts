import { WalletApi } from "lucid-cardano";
declare type WalletApiName = "nami" | "eternl" | "ccvault";
declare const useWalletApi: (name: WalletApiName) => WalletApi | undefined;
export { useWalletApi };
