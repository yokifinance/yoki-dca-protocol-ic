import React, { createContext, useState, useContext, ReactNode } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { Identity } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";

interface AuthContextType {
    authClient: AuthClient | undefined;
    isConnected: boolean;
    identity: Identity | undefined;
    principal: Principal | undefined;
    actor: any;
    whitelist: string[];
    setAuthClient: React.Dispatch<React.SetStateAction<AuthClient | undefined>>;
    setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
    setIdentity: React.Dispatch<React.SetStateAction<Identity | undefined>>;
    setPrincipal: React.Dispatch<React.SetStateAction<Principal | undefined>>;
    setActor: React.Dispatch<React.SetStateAction<any>>;
    setWhitelist: React.Dispatch<React.SetStateAction<string[]>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [authClient, setAuthClient] = useState<AuthClient | undefined>(undefined);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [identity, setIdentity] = useState<Identity | undefined>(undefined);
    const [principal, setPrincipal] = useState<Principal | undefined>(undefined);
    const [actor, setActor] = useState<any>(null);
    const [whitelist, setWhitelist] = useState<string[]>([]);

    return (
        <AuthContext.Provider
            value={{
                authClient,
                isConnected,
                identity,
                principal,
                actor,
                whitelist,
                setAuthClient,
                setIsConnected,
                setIdentity,
                setPrincipal,
                setActor,
                setWhitelist,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
