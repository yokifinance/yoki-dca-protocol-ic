import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "./WalletInfo.css";
import copyIcon from "../../images/copy-4-svgrepo-com.svg";
import doneIcon from "../../images/checkmark-xs-svgrepo-com.svg";
import icpIcon from "../../images/internet-computer-icp-logo.svg";

interface WalletInfoProps {
    principalId: string;
}

const WalletInfo: React.FC<WalletInfoProps> = ({ principalId }) => {
    const [isCopied, setIsCopied] = useState<boolean>(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(principalId);
            setIsCopied(true);

            // Скрыть иконку done через 1.5 секунды и вернуть копию иконки
            setTimeout(() => {
                setIsCopied(false);
            }, 1500);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };
    return (
        <>
            <ul className="wallet-info">
                <li className="wallet-info__element">
                    <div className="wallet-info__element-container">
                        <div className="wallet-info__element-sub-container">
                            <img className="wallet-info__icon" src={icpIcon} />
                            <span className="wallet-info__element">Principal ID</span>
                        </div>
                        <div className="wallet-info__element-sub-container">
                            <span className="wallet-info__value">{principalId}</span>
                            <img
                                className="wallet-info__icon wallet-info__icon_copy"
                                src={isCopied ? doneIcon : copyIcon}
                                alt="Copy Icon"
                                onClick={handleCopy}
                            />
                        </div>
                    </div>
                </li>
            </ul>
        </>
    );
};

export default WalletInfo;
