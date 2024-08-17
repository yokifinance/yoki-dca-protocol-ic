// CryptoConvertContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import CryptoConvert from "crypto-convert";

const CryptoConvertContext = createContext<CryptoConvert | undefined>(undefined);

export const CryptoConvertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [convert, setConvert] = useState<CryptoConvert>();

    useEffect(() => {
        const initializeCryptoConvert = async () => {
            const cryptoConvert = new CryptoConvert();
            await cryptoConvert.ready();
            setConvert(cryptoConvert);
        };

        initializeCryptoConvert();
    }, []);

    return <CryptoConvertContext.Provider value={convert}>{children}</CryptoConvertContext.Provider>;
};

export const useCryptoConvert = () => {
    const context = useContext(CryptoConvertContext);
    if (!context) {
        throw new Error("useCryptoConvert must be used within a CryptoConvertProvider");
    }
    return context;
};
