import React, { useEffect, useState } from "react";
import "./SubmitButton.css";
import OpenPosition from "../OpenPosition/OpenPosition";
import FormSubtotal from "../FormSubtotal/FormSubtotal";
import Popup from "../Popup/Popup";

interface SubmitButtonProps {
    isWalletConnected: boolean;
    disabled: boolean;
    buyOption: string;
    sellOption: string;
    frequency: string;
    endDate: string;
    amount: number;
    isFormValid: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
    isWalletConnected,
    disabled,
    buyOption,
    sellOption,
    frequency,
    endDate,
    amount,
    isFormValid,
}) => {
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

    const handleSubmitForm = (e: React.FormEvent) => {
        e.preventDefault();
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    return (
        <>
            <button
                className={`submit-button ${disabled ? "submit-button--disabled" : ""}`}
                type="submit"
                onClick={handleSubmitForm}
                disabled={disabled}
            >
                Submit
            </button>
            <Popup isOpen={isPopupOpen} onClose={handleClosePopup}>
                <OpenPosition
                    buyOption={"ckBTC"}
                    sellOption={"ICP"}
                    frequency={frequency}
                    endDate={endDate}
                    amount={amount}
                >
                    <FormSubtotal
                        buyOption={"ckBTC"}
                        sellOption={"ICP"}
                        frequency={frequency}
                        endDate={endDate}
                        amount={amount}
                    />
                </OpenPosition>
            </Popup>
        </>
    );
};

export default SubmitButton;
