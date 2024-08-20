import React, { useEffect, useState } from "react";
import "./SubmitButton.css";
import OpenPosition from "../OpenPosition/OpenPosition";
import FormSubtotal from "../FormSubtotal/FormSubtotal";
import Popup from "../Popup/Popup";
import { differenceInDays, parseISO } from "date-fns";

interface SubmitButtonProps {
    isWalletConnected: boolean;
    disabled: boolean;
    buyOption: string;
    sellOption: string;
    frequency: string;
    endDate: string;
    amount: number;
    isFormValid: boolean;
    tst: (e: React.FormEvent) => void;
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
    tst,
}) => {
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
    const [numberOfPayments, setNumberOfPayments] = useState<number>(0);
    const [totalAmount, setTotalAmount] = useState<number>(0);

    const convertFrequencyToDays = (frequency: string): number => {
        const frequencyMapping: { [key: string]: number } = {
            Daily: 1,
            Weekly: 7,
            Monthly: 28,
        };
        return frequencyMapping[frequency] || 1;
    };

    const calculateAmountsAndPayments = (amount: number, frequency: string, endDate: string): Object => {
        const today = new Date();
        const dateWithoutTime = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const end = parseISO(endDate);
        const endDateWithountTime = new Date(end.getFullYear(), end.getMonth(), end.getDate());
        const daysDifference = differenceInDays(endDateWithountTime, dateWithoutTime) + 1;
        const frequencyInDays = convertFrequencyToDays(frequency);
        let numberOfPayments = Math.ceil(daysDifference / frequencyInDays);
        setNumberOfPayments(numberOfPayments);
        const totalAmount = amount * numberOfPayments;
        setTotalAmount(totalAmount);

        return { totalAmount, numberOfPayments };
    };

    useEffect(() => {
        calculateAmountsAndPayments(amount, frequency, endDate);
    }, [isPopupOpen]);

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
                onSubmit={tst}
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
                    onClose={handleClosePopup}
                    numberOfPayments={numberOfPayments}
                >
                    <FormSubtotal
                        buyOption={"ckBTC"}
                        sellOption={"ICP"}
                        frequency={frequency}
                        endDate={endDate}
                        amount={amount}
                        totalAmount={totalAmount}
                        numberOfPayments={numberOfPayments}
                    />
                </OpenPosition>
            </Popup>
        </>
    );
};

export default SubmitButton;
