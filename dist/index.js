import { Lucid, Blockfrost } from 'lucid-cardano';
import { useState, useEffect, useCallback } from 'react';

const useNetworkId = (walletApi) => {
    const [networkId, setNetworkId] = useState();
    const onNetworkChange = (newNetworkId) => {
        setNetworkId(newNetworkId);
    };
    useEffect(() => {
        if (!(walletApi === null || walletApi === void 0 ? void 0 : walletApi.experimental))
            return;
        walletApi.getNetworkId().then(setNetworkId);
        walletApi.experimental.on("networkChange", onNetworkChange);
        return () => {
            walletApi.experimental.off("networkChange", onNetworkChange);
        };
    }, [walletApi]);
    return networkId;
};

const useWalletApi = () => {
    const [walletApi, setWalletApi] = useState();
    useEffect(() => {
        var _a;
        if (!((_a = window.cardano) === null || _a === void 0 ? void 0 : _a.nami))
            return;
        window.cardano.nami.enable().then(setWalletApi);
    }, []);
    return walletApi;
};

const lucid = await Lucid.new();
const useLucid = () => {
    const walletApi = useWalletApi();
    const networkId = useNetworkId(walletApi);
    useEffect(() => {
        if (walletApi === undefined)
            return;
        lucid.selectWallet(walletApi);
    }, [walletApi]);
    useEffect(() => {
        if (networkId === undefined)
            return;
        lucid.switchProvider(new Blockfrost(`/api/blockfrost/${networkId}`), networkId === 0 ? "Testnet" : "Mainnet");
    }, [networkId]);
    return {
        networkId,
        walletApi,
        lucid,
    };
};

const useHasNamiExtension = () => {
    const [hasNamiExtension, setHasNamiExtension] = useState();
    useEffect(() => {
        // give the browser a chance to load the extension
        // and for it to inject itself into the window object
        const timeout = setTimeout(() => {
            var _a;
            setHasNamiExtension(!!((_a = window.cardano) === null || _a === void 0 ? void 0 : _a.nami));
        }, 10);
        return () => {
            clearTimeout(timeout);
        };
    }, []);
    return hasNamiExtension;
};

const useTransaction = (lucid) => {
    const [successMessage, setSuccessMessage] = useState();
    const [error, setError] = useState();
    const [lovelace, setLovelace] = useState(0);
    const [toAccount, setToAccount] = useState("");
    useEffect(() => {
        if (!successMessage)
            return;
        const timeout = setTimeout(() => setSuccessMessage(undefined), 5000);
        return () => clearTimeout(timeout);
    }, [successMessage]);
    const sendTransaction = useCallback(async () => {
        if (!lucid || !toAccount || !lovelace)
            return;
        try {
            const tx = await lucid
                .newTx()
                .payToAddress(toAccount, { lovelace: BigInt(lovelace) })
                .complete();
            const signedTx = await tx.sign().complete();
            const txHash = await signedTx.submit();
            setLovelace(0);
            setToAccount("");
            setSuccessMessage(`Transaction submitted with hash ${txHash}`);
        }
        catch (e) {
            if (e instanceof Error)
                setError(e);
            else
                console.error(e);
        }
    }, [lucid, toAccount, lovelace]);
    const lovelaceSetter = useCallback((value) => {
        setError(undefined);
        setSuccessMessage(undefined);
        const parsed = parseInt(value);
        if (isNaN(parsed))
            return;
        setLovelace(parsed);
    }, []);
    const toAccountSetter = useCallback((value) => {
        setError(undefined);
        setSuccessMessage(undefined);
        setToAccount(value);
    }, []);
    return {
        error,
        successMessage,
        lovelace,
        setLovelace: lovelaceSetter,
        toAccount,
        setToAccount: toAccountSetter,
        sendTransaction,
    };
};

export { useHasNamiExtension, useLucid, useTransaction };
//# sourceMappingURL=index.js.map
