import { createActor, canisterId } from "declarations/wallet_integrations_backend";
import { writable } from "svelte/store";
import { backend } from "$lib/canisters";
import { idlFactory } from "declarations/wallet_integrations_backend/wallet_integrations_backend.did.js";
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent } from "@dfinity/agent";

let actor;
let principal = writable("");

async function handleLogin(buttonId) {
    let authClient = await AuthClient.create();
    try {
        if (buttonId === "ii") {
            await new Promise((resolve, reject) => {
                authClient.login({
                    identityProvider:
                        process.env.DFX_NETWORK === "ic"
                            ? "https://identity.ic0.app"
                            : `http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943`,
                    onSuccess: () => {
                        setActorAfterLogin(authClient);
                        handleWhoAmI();
                        resolve();
                    },
                    onError: reject,
                });
            });
        } else if (buttonId === "nfid") {
            const APP_NAME = "NFID example";
            const APP_LOGO = "https://nfid.one/icons/favicon-96x96.png";
            const CONFIG_QUERY = `?applicationName=${APP_NAME}&applicationLogo=${APP_LOGO}`;
            const identityProvider = `https://nfid.one/authenticate${CONFIG_QUERY}`;

            await authClient.login({
                identityProvider,
                onSuccess: () => {
                    setActorAfterLogin(authClient);
                    handleWhoAmI();
                },
                onError: (error) => {
                    console.error("NFID login failed:", error);
                    throw error;
                },
            });
        } else if (buttonId === "plug") {
            if (!window.ic?.plug) {
                console.error("Plug wallet is not available.");
                return;
            }
            const whitelist = [canisterId];
            const hasAllowed = await window.ic.plug.requestConnect({ whitelist });
            if (!hasAllowed) {
                console.error("Connection was refused.");
                return;
            }
            console.log("Plug wallet is connected.");
            try {
                const backendActor = await window.ic.plug.createActor({
                    canisterId: canisterId,
                    interfaceFactory: idlFactory,
                });
                actor = backendActor;
                handleWhoAmI();
            } catch (e) {
                console.error("Failed to initialize the actor with Plug.", e);
            }
            console.log("Integration actor initialized successfully.");
        }
    } catch (error) {
        console.error("Login failed:", error);
    }
}

async function handleWhoAmI() {
    const principalResult = await actor.whoami();
    principal.set(principalResult.toString());
}

function setActorAfterLogin(authClient) {
    const identity = authClient.getIdentity();
    const agent = new HttpAgent({ identity });
    actor = createActor(canisterId, { agent });
}
