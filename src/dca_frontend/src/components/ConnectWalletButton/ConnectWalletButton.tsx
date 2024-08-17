// ConnectWalletButton.tsx
import React, { useState } from "react";
import "./ConnectWalletButton.css";
import Popup from "../Popup/Popup";
import AuthModalButtons from "../AuthModalButtons/AuthModalButtons";

const ConnectWalletButton: React.FC = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const handleButtonClick = () => {
        setIsPopupOpen(true);
    };

    const handleCloseModal = () => {
        setIsPopupOpen(false);
    };

    return (
        <div>
            <button type="button" className="connect-wallet-button" onClick={handleButtonClick}>
                Connect Wallet
            </button>
            <Popup isOpen={isPopupOpen} onClose={handleCloseModal}>
                <AuthModalButtons />
            </Popup>
        </div>
    );
};

export default ConnectWalletButton;
