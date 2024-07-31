import React, { useState, useEffect } from "react";
import { Actor, HttpAgent } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";

const webapp_id = process.env.CANISTER_ID_DCA_IDENTITY;

const createWebappIdl = ({ IDL }) => {
    return IDL.Service({ whoami: IDL.Func([], [IDL.Principal], ["query"]) });
};

const AuthComponent = () => {
    const [principal, setPrincipal] = useState(null);
    const [iiUrl, setIiUrl] = useState("");

    useEffect(() => {
        let url;
        if (process.env.DFX_NETWORK === "local") {
            url = `http://localhost:4943/?canisterId=${process.env.CANISTER_ID_DCA_FRONTEND}`;
        } else if (process.env.DFX_NETWORK === "ic") {
            url = `https://${process.env.CANISTER_ID_DCA_FRONTEND}.ic0.app`;
        } else {
            url = `https://${process.env.CANISTER_ID_DCA_FRONTEND}.dfinity.network`;
        }
        setIiUrl(url);
        console.log(url);
        console.log(process.env.DFX_NETWORK);
    }, []);

    const login = async () => {
        const authClient = await AuthClient.create();

        await new Promise((resolve, reject) => {
            authClient.login({
                identityProvider: iiUrl,
                onSuccess: resolve,
                onError: reject,
            });
        });

        const identity = authClient.getIdentity();
        const agent = new HttpAgent({ identity });

        const webapp = Actor.createActor(createWebappIdl, {
            agent,
            canisterId: webapp_id,
        });

        const userPrincipal = await webapp.whoami();
        setPrincipal(userPrincipal.toText());
    };

    return (
        <div>
            <button onClick={login}>Login with Internet Identity</button>
            {principal && <p>Your Principal ID: {principal}</p>}
        </div>
    );
};

export default AuthComponent;
