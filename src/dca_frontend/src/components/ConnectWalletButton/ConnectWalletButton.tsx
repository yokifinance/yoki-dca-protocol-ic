// ConnectWalletButton.tsx
import React, { useState } from "react";
import "./ConnectWalletButton.css";
import Popup from "../Popup/Popup";
import AuthModalButtons from "../AuthModalButtons/AuthModalButtons";

const ConnectWalletButton: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleButtonClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <button type="button" className="connect-wallet-button" onClick={handleButtonClick}>
                Connect Wallet
            </button>
            <Popup isOpen={isModalOpen} onClose={handleCloseModal}>
                <AuthModalButtons />
            </Popup>
        </div>
    );
};

export default ConnectWalletButton;
