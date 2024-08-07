import { AuthClient } from "@dfinity/auth-client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Actor, HttpAgent } from "@dfinity/agent";

const AuthContext = createContext();
const canisterId = process.env.CANISTER_ID_DCA_BACKEND;

const webapp_idl = ({ IDL }) => {
    return IDL.Service({ whoami: IDL.Func([], [IDL.Principal], ["query"]) });
};

export const getIdentityProvider = () => {
    let idpProvider;
    // Safeguard against server rendering
    if (typeof window !== "undefined") {
        const isLocal = process.env.DFX_NETWORK !== "ic";
        // Safari does not support localhost subdomains
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        if (isLocal && isSafari) {
            idpProvider = `http://localhost:4943/?canisterId=${process.env.CANISTER_ID_INTERNET_IDENTITY}`;
        } else if (isLocal) {
            idpProvider = `http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943`;
        }
    }
    return idpProvider;
};

export const defaultOptions = {
    // @type {import("@dfinity/auth-client").AuthClientCreateOptions}

    createOptions: {
        idleOptions: {
            // Set to true if you do not want idle functionality
            disableIdle: false,
        },
    },
    // @type {import("@dfinity/auth-client").AuthClientLoginOptions}
    loginOptions: {
        identityProvider: getIdentityProvider(),
    },
};

// /**
//  *
//  * @param options - Options for the AuthClient
//  * @param {AuthClientCreateOptions} options.createOptions - Options for the AuthClient.create() method
//  * @param {AuthClientLoginOptions} options.loginOptions - Options for the AuthClient.login() method
//  * @returns
//  */
export const useAuthClient = (options = defaultOptions) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authClient, setAuthClient] = useState(null);
    const [identity, setIdentity] = useState(null);
    const [principal, setPrincipal] = useState(null);
    const [whoamiActor, setWhoamiActor] = useState(null);

    useEffect(() => {
        // Initialize AuthClient
        AuthClient.create(options.createOptions).then(async (client) => {
            updateClient(client);
        });
    }, []);

    const login = () => {
        authClient.login({
            ...options.loginOptions,
            onSuccess: () => {
                updateClient(authClient);
            },
        });
    };

    async function updateClient(client) {
        const isAuthenticated = await client.isAuthenticated();
        setIsAuthenticated(isAuthenticated);

        const identity = client.getIdentity();
        setIdentity(identity);

        const principal = identity.getPrincipal();
        setPrincipal(principal);

        setAuthClient(client);
        // Using the identity obtained from the auth client, we can create an agent to interact with the IC.

        const agent = new HttpAgent({ host: "http://127.0.0.1:4943" }, identity);

        const actor = Actor.createActor(webapp_idl, {
            agent,
            canisterId: canisterId,
        });
        await agent.fetchRootKey();
        setWhoamiActor(actor);
    }

    async function logout() {
        await authClient?.logout();
        await updateClient(authClient);
    }

    return {
        isAuthenticated,
        login,
        logout,
        authClient,
        identity,
        principal,
        whoamiActor,
    };
};

// /**
//  * @type {React.FC}
//  */
export const AuthProvider = ({ children }) => {
    const auth = useAuthClient();

    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
