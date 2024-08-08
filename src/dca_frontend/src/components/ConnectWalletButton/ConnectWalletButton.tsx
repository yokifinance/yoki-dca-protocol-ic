// ConnectWalletButton.tsx
import React, { useState } from "react";
import "./ConnectWalletButton.css";
import AuthModal from "../AuthModal/AuthModal";
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
            <button className="connect-wallet-button" onClick={handleButtonClick}>
                Connect Wallet
            </button>
            <AuthModal isOpen={isModalOpen} onClose={handleCloseModal}>
                <AuthModalButtons />
            </AuthModal>
        </div>
    );
};

export default ConnectWalletButton;
