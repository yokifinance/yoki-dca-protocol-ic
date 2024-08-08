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
        console.log(identityProvider);
    }, [identityProvider]);

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
            console.log(`Client has created successfully`);
            setAuthClient(client);
        } catch (error) {
            console.error("Failed to create AuthClient", error);
        }
    };

    const getConnectionStatus = async () => {
        const connectionStatus = await window.ic.plug.isConnected();
        return connectionStatus;
    };
    const handleWhoAmIClick = async () => {
        const tst = await actor.whoami();
        // console.log(dca_backend.whoami());
        // const tst = await dca_backend.whoami();
        setResult(tst);
    };

    const handlePlugConnect = async () => {
        if (window.ic?.plug) {
            const isConnected = await window.ic.plug.isConnected();
            if (!isConnected) {
                console.error("Plug is not connected");
                return;
            }
            const principal = await window.ic.plug.agent.getPrincipal();
            console.log("Connected with Plug:", principal.toString());
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

// import React, { useEffect, useState } from "react";
// import PlugConnect from "@psychedelic/plug-connect";
// import { AuthClient } from "@dfinity/auth-client";
// import { Actor, HttpAgent } from "@dfinity/agent";
// import { IDL } from "@dfinity/candid";
// // import { idlFactory as webapp_idl } from "path_to_idl_file"; // Update this import to your actual IDL file path

// declare global {
//     interface Window {
//         ic: any; // Adjust this type based on the actual type of window.ic
//     }
// }

// const webapp_idl: IDL.InterfaceFactory = ({ IDL }) => {
//     return IDL.Service({ whoami: IDL.Func([], [IDL.Principal], ["query"]) });
// };

// const PlugWalletButton: React.FC = () => {
//     const [canisterIds, setCanisterIds] = useState<string[]>([]);
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [identityProvider, setIdentityProvider] = useState<string>("");

//     useEffect(() => {
//         const idInternetIdentity = process.env.CANISTER_ID_INTERNET_IDENTITY;
//         const idDcaBackend = process.env.CANISTER_ID_DCA_BACKEND;
//         setCanisterIds([idInternetIdentity, idDcaBackend].filter((id) => id) as string[]);
//     }, []);

//     const getIdentityProvider = () => {
//         if (typeof window !== "undefined") {
//             const isLocal = process.env.DFX_NETWORK !== "ic";
//             const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
//             if (isLocal && isSafari) {
//                 setIdentityProvider(`http://localhost:4943/?canisterId=${process.env.CANISTER_ID_INTERNET_IDENTITY}`);
//             } else if (isLocal) {
//                 setIdentityProvider(`http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943`);
//             }
//         }
//     };

//     const defaultOptions = {
//         // @type {import("@dfinity/auth-client").AuthClientCreateOptions}

//         createOptions: {
//             idleOptions: {
//                 // Set to true if you do not want idle functionality
//                 disableIdle: false,
//             },
//         },
//         // @type {import("@dfinity/auth-client").AuthClientLoginOptions}
//         loginOptions: {
//             identityProvider: getIdentityProvider(),
//         },
//     };

//     const handlePlugConnect = async () => {
//         if (window.ic?.plug?.isConnected()) {
//             console.log(window.ic.plug.isConnected());
//             const principal = await window.ic.plug.agent.getPrincipal();
//             console.log("Connected with Plug:", principal);
//             const actor = await window.ic.plug.createActor({
//                 canisterId: canisterIds[1], // Use DCA Backend Canister ID
//                 interfaceFactory: webapp_idl,
//             });
//             // Do something with the actor
//         }
//     };

//     const handleInternetIdentityConnect = async () => {
//         const authClient = await AuthClient.create();
//         await authClient.login({
//             identityProvider: process.env.CANISTER_ID_INTERNET_IDENTITY,
//             onSuccess: async () => {
//                 const identity = authClient.getIdentity();
//                 const agent = new HttpAgent({ identity });
//                 const actor = Actor.createActor(webapp_idl, {
//                     agent,
//                     canisterId: canisterIds[1], // Use DCA Backend Canister ID
//                 });
//                 setIsAuthenticated(true);
//                 console.log("Connected with Internet Identity:", identity.getPrincipal());
//                 // Do something with the actor
//             },
//         });
//     };

//     return (
//         <div>
//             <h1>Multi-Wallet Integration</h1>
//             <PlugConnect whitelist={canisterIds} onConnectCallback={handlePlugConnect} />
//             <button onClick={handleInternetIdentityConnect}>Connect with Internet Identity</button>
//         </div>
//     );
// };
