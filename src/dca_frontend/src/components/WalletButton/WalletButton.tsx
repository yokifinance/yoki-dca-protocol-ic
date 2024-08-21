import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "./WalletButton.css";
import Popup from "../Popup/Popup";
import AuthModalButtons from "../AuthModalButtons/AuthModalButtons";

const WalletButton: React.FC = () => {
    const { identity, authClient } = useAuth();

    const [principalId, setPrincipalId] = useState<string>("");
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

    useEffect(() => {
        if (authClient) {
            const identity = authClient.getIdentity();
            setPrincipalId(identity.getPrincipal().toString());
        }
    });

    const handleOpenPupup = (e: React.FormEvent) => {
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    return (
        <>
            <div className="wallet-button-container">
                <button className="wallet-button" onClick={handleOpenPupup}>
                    {principalId}
                </button>
            </div>
            <Popup isOpen={isPopupOpen} onClose={handleClosePopup}>
                <AuthModalButtons />
            </Popup>
        </>
    );
};

export default WalletButton;
