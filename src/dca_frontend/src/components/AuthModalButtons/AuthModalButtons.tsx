import React, { useEffect } from "react";
import "./AuthModalButtons.css";
import InternetIdentityIcon from "../../images/internet-computer-icp-logo.svg";
import PlugIcon from "../../images/plugLogo.png";
import { handleInternetIdentityAuth, createActor, disconnectInternetIdentity } from "../../utils/auth";
import { useAuth } from "../../context/AuthContext";
import { Principal } from "@dfinity/principal"; // Import Principal
import { idlFactory as backend } from "../../../declarations/dca_backend/dca_backend.did.js";
import { idlFactory as legger } from "../../../declarations/icp_ledger_canister/icp_ledger_canister.did.js";

const AuthModalButtons: React.FC = () => {
    const {
        authClient,
        isConnected,
        identity,
        principal,
        actorBackend,
        actorLedger,
        whitelist,
        setAuthClient,
        setIsConnected,
        setIdentity,
        setPrincipal,
        setActorBackend,
        setActorLedger,
        setWhitelist,
    } = useAuth();

    useEffect(() => {
        const id1 = process.env.CANISTER_ID_INTERNET_IDENTITY;
        const id2 = process.env.CANISTER_ID_DCA_BACKEND;
        const id3 = process.env.CANISTER_ID_ICP_LEDGER_CANISTER;
        const id4 = process.env.CANISTER_ID_CKBTC_LEDGER_CANISTER;

        const filteredWhitelist = [id1, id2, id3, id4].filter((id): id is string => !!id);
        setWhitelist(filteredWhitelist);
    }, [setWhitelist]);

    const handleLoginToInternetIdentity = async () => {
        try {
            const client = await handleInternetIdentityAuth();
            if (client) {
                setIsConnected(true);
                setAuthClient(client);
                const identity = client.getIdentity();
                const actorBackend = await createActor(whitelist[1], backend, identity);
                const actorLedger = await createActor(whitelist[2], legger, identity); // Pass all required arguments

                setActorBackend(actorBackend);
                setActorLedger(actorLedger);
                setPrincipal(identity.getPrincipal());
                setIdentity(identity);
            }
        } catch (error) {
            console.warn(`Failed to auth to InternetIdentity: ${error}`);
        }
    };

    const handleLogout = async () => {
        if (isConnected && authClient && identity) {
            await disconnectInternetIdentity(authClient);
            setIsConnected(false);
            setPrincipal(undefined);
            setIdentity(undefined);
            setAuthClient(undefined);
            setActorBackend(null);
        }
    };

    return (
        <ul className="auth-modal-buttons__list">
            {isConnected ? (
                <li className="auth-modal-button__item">
                    <button onClick={handleLogout} className="auth-modal-button auth-modal-button_disconnect">
                        <span>Disconnect</span>
                    </button>
                </li>
            ) : (
                <>
                    <li className="auth-modal-button__item">
                        <button
                            onClick={handleLoginToInternetIdentity}
                            className="auth-modal-button auth-modal-button_ii"
                        >
                            <span>Internet Identity</span>
                            <img
                                className="auth-modal-button__image"
                                src={InternetIdentityIcon}
                                alt="Internet Identity"
                            />
                        </button>
                    </li>
                    <li className="auth-modal-button__item auth-modal-button__item_under-construction">
                        <button disabled className="auth-modal-button auth-modal-button_plug">
                            <span>Plug Wallet</span>
                            <img className="auth-modal-button__image" src={PlugIcon} alt="Plug Wallet" />
                        </button>
                    </li>
                </>
            )}
        </ul>
    );
};

export default AuthModalButtons;
