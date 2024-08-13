import React, { useEffect } from "react";
import "./AuthModalButtons.css";
import InternetIdentityIcon from "../../images/internet-computer-icp-logo.svg";
import { handleInternetIdentityAuth, createActor, disconnectInternetIdentity } from "../../utils/auth";
import { useAuth } from "../../context/AuthContext";
import { Principal } from "@dfinity/principal"; // Import Principal
import { idlFactory } from "../../../declarations/dca_backend/dca_backend.did.js";
import { idlFactory as legger } from "../../../declarations/icp_ledger_canister/icp_ledger_canister.did.js";

const AuthModalButtons: React.FC = () => {
    const {
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
                const actor = await createActor(whitelist[2], legger, identity); // Pass all required arguments

                setActor(actor);
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
            setActor(null);
        }
    };

    const handleOpenPositionMethod = async () => {
        const position = {
            tokenToSell: Principal.fromText(whitelist[2]),
            beneficiary: principal,
            tokenToBuy: Principal.fromText(whitelist[3]),
            lastPurchaseResult: [], // Replace with an actual Result__2 value or null
            nextRunTime: [], // Replace with an actual Time value or null
            amountToSell: 10_000, // Ensure this is a BigInt
            frequency: { Daily: null }, // Use 'Daily', 'Weekly', or 'Monthly'
        };

        try {
            // const op = await actor.openPosition(position);
            // console.log(op);
            // let result = await actor.whoami();
            // console.log(result);
            let lol = Principal.fromText("klcto-2xe2e-hjit4-wphri-c3ify-wgrjd-jc5c2-pbvjd-gpwdx-ib2ra-hae");
            const res = await actor.icrc1_balance_of({ owner: lol, subaccount: [] });
            console.log(res);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <ul className="auth-modal-buttons__list">
            <li>
                <button onClick={handleOpenPositionMethod} className="auth-modal-button auth-modal-button_openposition">
                    <span>open Position</span>
                </button>
            </li>
            {isConnected ? (
                <li className="auth-modal-button__item">
                    <button onClick={handleLogout} className="auth-modal-button auth-modal-button_disconnect">
                        <span>Disconnect</span>
                    </button>
                </li>
            ) : (
                <li className="auth-modal-button__item">
                    <button onClick={handleLoginToInternetIdentity} className="auth-modal-button auth-modal-button_ii">
                        <span>Internet Identity</span>
                        <img className="auth-modal-button__image" src={InternetIdentityIcon} alt="Internet Identity" />
                    </button>
                </li>
            )}
        </ul>
    );
};

export default AuthModalButtons;
