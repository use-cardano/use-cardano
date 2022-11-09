import { Lucid } from "lucid-cardano";
declare const useTransaction: (lucid?: Lucid) => {
    error: Error | undefined;
    successMessage: string | undefined;
    lovelace: number;
    setLovelace: (value: string) => void;
    toAccount: string;
    setToAccount: (value: string) => void;
    sendTransaction: () => Promise<void>;
};
export { useTransaction };
