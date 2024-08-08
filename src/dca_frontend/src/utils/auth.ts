import PlugConnect from "@psychedelic/plug-connect";
import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../declarations/dca_backend/dca_backend.did.js";
import { IDL } from "@dfinity/candid";

//PlugWallet Auth

export const handlePlugConnect = async (): Promise<string | undefined> => {
    try {
        const publicKey = await window.ic.plug.requestConnect();
        console.log(`The connected user's public key is:`, publicKey);
        const principalId = await window.ic.plug.agent.getPrincipal();
        console.log(principalId);
        return principalId.toText();
    } catch (e) {
        console.log(e);
        return undefined;
    }
};

export const checkIsPlugConnected = async (): Promise<boolean> => {
    const isConnected = await window.ic.plug.isConnected();
    console.log(isConnected);
    return isConnected;
};

export const disconnectPlug = async (): Promise<void> => {
    try {
        await window.ic.plug.disconnect();
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
    return undefined; // Return undefined if none of the conditions are met
};

export const handleInternetIdentityAuth = async (): Promise<AuthClient | void> => {
    try {
        const authClient = await AuthClient.create();
        const identityProvider = getIdentityProvider(); // Make sure this function is defined

        await new Promise<void>((resolve, reject) => {
            authClient.login({
                identityProvider: identityProvider,
                onSuccess: () => {
                    resolve();
                },
                onError: reject,
            });
        });

        return authClient; // Return the authClient on successful login
    } catch (error) {
        console.error("Login to Internet Identity failed:", error);
        return undefined;
    }
};

export const createActor = async (client: AuthClient, canisterId: string, idlFactory: IDL.InterfaceFactory) => {
    const identity = client.getIdentity();
    const agent = new HttpAgent({ identity, host: "http://127.0.0.1:4943" });

    const actor = Actor.createActor(idlFactory, {
        agent,
        canisterId: canisterId,
    });
    await agent.fetchRootKey();
    return actor;
};

export const checkIsInternetIdentityConected = async (client: AuthClient) => {
    const isAuthenticated = await client.isAuthenticated();
    console.log(isAuthenticated);
};

// const createActor

// async function updateClient1(client) {
//     const isAuthenticated = await client.isAuthenticated();
//     // setIsAuthenticated(isAuthenticated);

//     const identity = client.getIdentity();
//     // setIdentity(identity);

//     const principal = identity.getPrincipal();
//     // setPrincipal(principal);

//     // setAuthClient(client);
//     // Using the identity obtained from the auth client, we can create an agent to interact with the IC.

//     const agent = new HttpAgent({ identity, host: "http://127.0.0.1:4943" });

//     const actor = Actor.createActor(webapp_idl, {
//         agent,
//         canisterId: canisterId,
//     });
//     await agent.fetchRootKey();
//     // setWhoamiActor(actor);
// }

//Plug & Internet Identity

// async function updateClient(client) {
//     const isAuthenticated = await client.isAuthenticated();
//     setIsAuthenticated(isAuthenticated);

//     const identity = client.getIdentity();
//     setIdentity(identity);

//     const principal = identity.getPrincipal();
//     setPrincipal(principal);

//     setAuthClient(client);
//     // Using the identity obtained from the auth client, we can create an agent to interact with the IC.

//     const agent = new HttpAgent({ identity, host: "http://127.0.0.1:4943" });

//     const actor = Actor.createActor(webapp_idl, {
//         agent,
//         canisterId: canisterId,
//     });
//     await agent.fetchRootKey();
//     setWhoamiActor(actor);
// }
