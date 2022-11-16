import { UseCardanoError } from "error";
import { Lucid, WalletApi } from "lucid-cardano";
import { UseCardanoWarning } from "../warnings";
declare type NodeProvider = "blockfrost" | "blockfrost-proxy";
declare type WalletProvider = "nami" | "eternl" | "ccvault" | "yoroi";
declare type UseCardanoNodeOptions = {
    provider?: NodeProvider;
    proxyUrl?: string;
    projectId?: string;
};
declare type UseCardanoOptions = {
    walletProvider?: WalletProvider;
    node?: UseCardanoNodeOptions;
};
interface UseCardanoState {
    networkId?: number;
    walletApi?: WalletApi;
    lucid?: Lucid;
    info: string[];
    warnings: UseCardanoWarning[];
    errors: UseCardanoError[];
}
declare const useCardano: (options: UseCardanoOptions) => UseCardanoState;
export type { WalletProvider };
export { useCardano };
