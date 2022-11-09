import { Lucid } from "lucid-cardano";
declare const useLucid: () => {
    networkId: number | undefined;
    walletApi: import("lucid-cardano").WalletApi | undefined;
    lucid: Lucid;
};
export { useLucid };
