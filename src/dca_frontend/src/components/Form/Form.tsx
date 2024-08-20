import React, { useRef, useState, useEffect } from "react";
import "./Form.css";
import SubmitButton from "../SubmitButton/SubmitButton";
import ConnectWalletButton from "../ConnectWalletButton/ConnectWalletButton";
import { useAuth } from "../../context/AuthContext";
import RadioButtons from "../RadioButtons/RadioButtons";
import BalanceInfo from "../BalanceInfo/BalanceInfo";
import { differenceInDays, parseISO } from "date-fns";

interface FormProps {
    isWalletConnected: boolean;
}

interface CalculatedValues {
    totalAmount: number;
    numberOfPayments: number;
}

const Form: React.FC<FormProps> = ({ isWalletConnected }) => {
    const { isConnected } = useAuth();

    const [endDate, setEndDate] = useState<string>("");
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [amountToSell, setAmountToSell] = useState<number>(1.0);

    const tokenToBuyRef = useRef<HTMLSelectElement>(null);
    const tokenToSellRef = useRef<HTMLSelectElement>(null);
    const amountToSellRef = useRef<HTMLInputElement>(null);
    const frequencyRef = useRef<{ getFrequency: () => string }>(null);

    useEffect(() => {
        validateForm();
    }, [endDate, amountToSell, frequencyRef]);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.valueAsNumber;
        setAmountToSell(value);
        validateForm();
    };

    const handleFrequencyChange = () => {
        validateForm();
    };

    const validateForm = () => {
        const isAmountValid = amountToSell > 0;
        const isFrequencyValid = frequencyRef.current?.getFrequency();
        const isEndDateValid = endDate !== "";

        setIsFormValid(!!isAmountValid && !!isFrequencyValid && !!isEndDateValid);
    };

    const handleSubmitForm = (e: React.FormEvent) => {
        e.preventDefault();
    };

    return (
        <>
            <form className="form" onSubmit={handleSubmitForm}>
                <div className="select-input__container">
                    <label htmlFor="buy" className="select-input__label">
                        You buy:
                    </label>
                    <select id="buy" className="select-input__input" ref={tokenToBuyRef}>
                        <option value="" disabled>
                            Select token
                        </option>
                        {["BTC"].map((option) => (
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
                        <select id="sell" className="select-input__input" ref={tokenToSellRef}>
                            <option value="" disabled>
                                Select token
                            </option>
                            {["ICP"].map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        <input
                            className="select-input__text-field"
                            type="number"
                            min={1}
                            ref={amountToSellRef}
                            placeholder="Amount"
                            value={amountToSell !== undefined ? amountToSell : 0}
                            onChange={handleAmountChange}
                        />
                    </div>
                    <BalanceInfo />
                </div>

                <RadioButtons ref={frequencyRef} onDataChange={handleFrequencyChange} />

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

                {/* {isConnected ? (
                    <SubmitButton
                        isWalletConnected={isWalletConnected}
                        disabled={!isFormValid}
                        buyOption={"ckBTC"}
                        sellOption={"ICP"}
                        frequency={frequencyRef.current?.getFrequency() || ""}
                        endDate={endDate}
                        amount={amountToSell}
                        isFormValid={isFormValid}
                        tst={handleSubmitForm}
                    ></SubmitButton>
                ) : (
                    <ConnectWalletButton />
                )} */}
                <SubmitButton
                    isWalletConnected={isWalletConnected}
                    disabled={!isFormValid}
                    buyOption={"ckBTC"}
                    sellOption={"ICP"}
                    frequency={frequencyRef.current?.getFrequency() || ""}
                    endDate={endDate}
                    amount={amountToSell}
                    isFormValid={isFormValid}
                    tst={handleSubmitForm}
                ></SubmitButton>
            </form>
        </>
    );
};

export default Form;
