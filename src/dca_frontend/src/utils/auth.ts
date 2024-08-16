import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent, Identity } from "@dfinity/agent";
import { IDL } from "@dfinity/candid";
import { Principal } from "@dfinity/principal";
import { Frequency } from "../../declarations/dca_backend/dca_backend.did";

//PlugWallet Auth

export const handlePlugConnect = async (whitelist: string[]): Promise<boolean | undefined> => {
    try {
        if (window.ic && window.ic.plug) {
            const publicKey = await window.ic.plug.requestConnect({
                whitelist,
            });
            // console.log(`The connected user's public key is:`, publicKey);

            const principalId = await window.ic.plug.agent.getPrincipal();
            // console.log(principalId);
            if (await checkIsPlugConnected()) {
                return true;
            }
        } else {
            console.warn("Plug wallet is not available");
            return undefined;
        }
    } catch (e) {
        console.warn(e);
        return undefined;
    }
};

export const checkIsPlugConnected = async (): Promise<boolean> => {
    const isConnected = await window.ic.plug.isConnected();
    return isConnected;
};

export const disconnectPlug = async (): Promise<void> => {
    try {
        await window.ic.plug.disconnect();
        await checkIsPlugConnected();
    } catch (error) {
        console.log(error);
    }
};

//to do
// write createActor
// input => canisterIds, interface
// window.ic.plug.createActor
// return => actor (backend method)

// InternetIdentity Auth

export const getIdentityProvider = (): string | undefined => {
    if (typeof window !== "undefined") {
        const isLocal = process.env.DFX_NETWORK !== "ic";
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        if (isLocal && isSafari) {
            return `http://localhost:4943/?canisterId=${process.env.CANISTER_ID_INTERNET_IDENTITY}`;
        } else if (isLocal) {
            return `http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943`;
        }
    }
    return undefined;
};

export const handleInternetIdentityAuth = async (): Promise<AuthClient | void> => {
    try {
        const authClient = await AuthClient.create();
        const identityProvider = getIdentityProvider();
        console.log(identityProvider); // Make sure this function is defined

        await new Promise<void>((resolve, reject) => {
            authClient.login({
                identityProvider: identityProvider,
                onSuccess: () => {
                    resolve();
                },
                onError: reject,
            });
        });

        return authClient;
    } catch (error) {
        console.error("Login to Internet Identity failed:", error);
        return undefined;
    }
};

export const createActor = async (canisterId: string, idlFactory: IDL.InterfaceFactory, identity: Identity) => {
    const agent = new HttpAgent({ identity, host: "http://127.0.0.1:4943" });

    const actor = Actor.createActor(idlFactory, {
        agent,
        canisterId: canisterId,
    });
    await agent.fetchRootKey();
    return actor;
};

export const checkIsInternetIdentityConnected = async (
    client: AuthClient | undefined
): Promise<boolean | undefined> => {
    if (client) {
        const isAuthenticated = await client.isAuthenticated();
        console.log(isAuthenticated);
        return isAuthenticated;
    } else {
        console.warn("Internet Identity is unavialable");
        return undefined;
    }
};

export const disconnectInternetIdentity = async (client: AuthClient) => {
    console.log(`Client? ${client}`);
    await client.logout();
};

export const handleOpenPosition = async (
    actor: any,
    whitelist: string[],
    principal: Principal | undefined,
    amount: bigint,
    frequency: Frequency,
    purchasesLeft: bigint
) => {
    const position = {
        tokenToSell: Principal.fromText(whitelist[2]),
        beneficiary: principal,
        tokenToBuy: Principal.fromText(whitelist[3]),
        lastPurchaseResult: [],
        nextRunTime: [],
        amountToSell: amount,
        frequency: frequency,
        purchasesLeft: purchasesLeft,
    };

    try {
        if (actor.openPosition && principal) {
            const op = await actor.openPosition(position);
            console.log(op);
        }
    } catch (error) {
        console.log(error);
    }
};
