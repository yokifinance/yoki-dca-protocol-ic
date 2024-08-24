import "./PlugWalletButton.css";
import React, { useEffect, useState } from "react";
import PlugConnect from "@psychedelic/plug-connect";
import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/dca_backend/dca_backend.did.js";

declare global {
    interface Window {
        ic: any; // Adjust this type based on the actual type of window.ic
    }
}

const PlugWalletButton: React.FC = () => {
    const [canisterIds, setCanisterIds] = useState<string[]>([]);
    const [result, setResult] = useState<string>("");
    const [actor, setActor] = useState<any>(null);
    const [identityProvider, setIdentityProvider] = useState<string>("");
    const [authClient, setAuthClient] = useState<AuthClient | undefined>(undefined);
    const [walletProvider, setWalleetProvider] = useState<string | undefined>(undefined);

    useEffect(() => {
        const id1 = process.env.CANISTER_ID_INTERNET_IDENTITY;
        const id2 = process.env.CANISTER_ID_DCA_BACKEND;
        const ids = [id1, id2].filter((id): id is string => !!id); // Type guard to filter out undefined values

        setCanisterIds(ids);
        getIdentityProvider();

        // getConnectionStatus();
        initializeAuthClient();
    }, []);

    const initializeAuthClient = async () => {
        try {
            const client = await AuthClient.create();
            setAuthClient(client);
        } catch (error) {
            console.warn("Failed to create AuthClient", error);
        }
    };

    const handleWhoAmIClick = async () => {
        const tst = await actor.whoami();
        setResult(tst);
    };

    const handlePlugConnect = async () => {
        if (window.ic?.plug) {
            const isConnected = await window.ic.plug.isConnected();
            if (!isConnected) {
                console.error("Plug is not connected");
                return;
            }
            const whoamiActor = await window.ic.plug.createActor({
                canisterId: canisterIds[1],
                interfaceFactory: idlFactory,
            });

            setActor(whoamiActor);
        }
    };

    const handleInternetIdentityAuth = async () => {
        try {
            let authClient = await AuthClient.create();
            getIdentityProvider();
            await new Promise((resolve, reject) => {
                authClient.login({
                    identityProvider: identityProvider,
                    onSuccess: () => {
                        setActorAfterLogin(authClient);
                    },
                    onError: reject,
                });
            });
        } catch (error) {
            console.error("Login to Internet Identity failed:", error);
        }
    };

    const getIdentityProvider = () => {
        if (typeof window !== "undefined") {
            const isLocal = process.env.DFX_NETWORK !== "ic";
            const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
            if (isLocal && isSafari) {
                setIdentityProvider(`http://localhost:4943/?canisterId=${process.env.CANISTER_ID_INTERNET_IDENTITY}`);
            } else if (isLocal) {
                setIdentityProvider(`http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943`);
            }
        }
    };

    const setActorAfterLogin = async (authClient: AuthClient) => {
        const identity = authClient.getIdentity();
        const agent = new HttpAgent({ identity, host: "http://127.0.0.1:4943" });
        const whoamiActor = Actor.createActor(idlFactory, {
            agent,
            canisterId: canisterIds[1],
        });
        await agent.fetchRootKey();
        setActor(whoamiActor);
    };

    return (
        <div>
            <PlugConnect whitelist={canisterIds} onConnectCallback={handlePlugConnect} />
            <button onClick={handleInternetIdentityAuth}>Connect with II</button>
            <button onClick={handleWhoAmIClick}>Who am I</button>
            <input className="tst" type="text" id="whoami" readOnly value={result} placeholder="your Identity" />
        </div>
    );
};

export default PlugWalletButton;
