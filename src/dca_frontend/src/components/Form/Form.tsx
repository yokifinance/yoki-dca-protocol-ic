import React, { useRef, useState, useCallback } from "react";
import "./Form.css";
import SubmitButton from "../SubmitButton/SubmitButton";
import ConnectWalletButton from "../ConnectWalletButton/ConnectWalletButton";
import { useAuth } from "../../context/AuthContext";
import { useCalculateAmountsAndPayments } from "../../utils/useCalculateTotalAmount";
import RadioButtons from "../RadioButtons/RadioButtons";
import BalanceInfo from "../BalanceInfo/BalanceInfo";
import { Position, Frequency } from "../../../declarations/dca_backend/dca_backend.did.js";
import { handleOpenPosition } from "../../utils/auth";

interface FormProps {
    isWalletConnected: boolean;
}

const Form: React.FC<FormProps> = ({ isWalletConnected }) => {
    const { isConnected, actorBackend, whitelist, principal } = useAuth();

    const [endDate, setEndDate] = useState<string>("");

    const NEWtokenToBuy = useRef<HTMLSelectElement>(null);
    const NEWtokenToSell = useRef<HTMLSelectElement>(null);
    const NEWamountToSell = useRef<HTMLInputElement>(null);
    const radioButtonsRef = useRef<{ getFrequency: () => string }>(null);

    const totalAmount = useCalculateAmountsAndPayments(
        NEWamountToSell.current?.valueAsNumber || 0,
        radioButtonsRef.current?.getFrequency() || "",
        endDate
    );

    const mapToFrequency = (frequency: string): Frequency => {
        switch (frequency) {
            case "Weekly":
                return { Weekly: null };
            case "Daily":
                return { Daily: null };
            case "Monthly":
                return { Monthly: null };
            default:
                console.log(frequency);
                throw new Error("Invalid frequency");
        }
    };

    const handleSubmitForm = (e: React.FormEvent) => {
        e.preventDefault();

        const amountToSell = NEWamountToSell.current?.valueAsNumber || 0;
        const frequency = mapToFrequency(radioButtonsRef.current?.getFrequency() || "");

        handleOpenPosition(actorBackend, whitelist, principal, BigInt(amountToSell), frequency, BigInt(100));
    };

    return (
        <form className="form" onSubmit={handleSubmitForm}>
            <div className="select-input__container">
                <label htmlFor="buy" className="select-input__label">
                    You buy:
                </label>
                <select id="buy" className="select-input__input" ref={NEWtokenToBuy}>
                    <option value="" disabled>
                        Select token
                    </option>
                    {["BTC", "ETH", "TON"].map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>

            <div className="select-input__container select-input__container_last">
                <label htmlFor="sell" className="select-input__label">
                    You sell:
                </label>
                <div className="select-input__controls">
                    <select id="sell" className="select-input__input" ref={NEWtokenToSell}>
                        <option value="" disabled>
                            Select token
                        </option>
                        {["USD", "GEL", "RUB"].map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                    <input
                        className="select-input__text-field"
                        type="number"
                        min={0}
                        ref={NEWamountToSell}
                        placeholder="Amount"
                    />
                </div>
                <BalanceInfo />
            </div>

            <RadioButtons ref={radioButtonsRef} onDataChange={() => {}} />

            <div className="date-picker">
                <label htmlFor="endDate" className="date-picker__label">
                    End date:
                </label>
                <input
                    className="date-picker__input"
                    type="date"
                    id="endDate"
                    value={endDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </div>
            {/* <SubmitButton label="Submit" isWalletConnected={isWalletConnected} /> */}

            {isConnected ? (
                <SubmitButton label="Submit" isWalletConnected={isWalletConnected} />
            ) : (
                <ConnectWalletButton />
            )}
        </form>
    );
};

export default Form;
