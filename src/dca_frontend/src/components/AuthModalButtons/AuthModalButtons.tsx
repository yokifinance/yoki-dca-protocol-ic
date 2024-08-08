import React, { useState } from "react";
import "./AuthModalButtons.css";
import InternetIdentityIcon from "../../images/internet-computer-icp-logo.svg";
import PlugIcon from "../../images/plugLogo.png";
import { AuthClient } from "@dfinity/auth-client";
import {
    handlePlugConnect,
    checkIsPlugConnected,
    disconnectPlug,
    handleInternetIdentityAuth,
    checkIsInternetIdentityConected,
} from "../../utils/auth";

const AuthModalButtons: React.FC = () => {
    const [authClient, setAuthClient] = useState<AuthClient | undefined>(undefined);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    const handleLoginToIi = async () => {
        const client = await handleInternetIdentityAuth();
        if (client) {
            setAuthClient(client);
        }
    };

    const handleCheckInternetIdentityConnection = async () => {
        if (authClient) {
            await checkIsInternetIdentityConected(authClient);
        } else {
            console.warn("AuthClient is not available");
        }
    };

    const handleLoginToPlug = async () => {
        await handlePlugConnect();
    };

    return (
        <ul className="auth-modal-buttons__list">
            <li className="auth-modal-button__item">
                <button onClick={handleLoginToIi} className="auth-modal-button auth-modal-button_ii">
                    <span>Internet Identity</span>
                    <img className="auth-modal-button__image" src={InternetIdentityIcon} alt="Internet Identity" />
                </button>
            </li>
            <li className="auth-modal-button__item">
                <button
                    onClick={handleCheckInternetIdentityConnection}
                    className="auth-modal-button auth-modal-button_plug"
                >
                    <span>Plug</span>
                    <img className="auth-modal-button__image" src={PlugIcon} alt="Plug" />
                </button>
            </li>
        </ul>
    );
};

export default AuthModalButtons;
