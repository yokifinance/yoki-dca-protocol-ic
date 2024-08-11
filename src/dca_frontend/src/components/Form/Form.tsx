import React, { ReactHTMLElement, useRef } from "react";
import "./Form.css";
import FormSubtotal from "../FormSubtotal/FormSubtotal";
import RadioButtons from "../RadioButtons/RadioButtons";
import SelectInput from "../SelectInput/SelectInput";
import DatePicker from "../DatePicker/DatePicker";
import SubmitButton from "../SubmitButton/SubmitButton";
import { FormErrors } from "../../utils/validation";
import { useAuth } from "../../context/AuthContext";
import ConnectWalletButton from "../ConnectWalletButton/ConnectWalletButton";

interface FormProps {
    NEWtokenToBuy: React.RefObject<HTMLInputElement>;
    NEWtokenToSell: React.RefObject<HTMLInputElement>;
    NEWfrequency: React.RefObject<HTMLInputElement>;
    NEWnextRunTime: React.RefObject<HTMLInputElement>;
    NEWamountToSell: React.RefObject<HTMLInputElement>;
    buyOption: string;
    sellOption: string;
    frequency1: string;
    endDate: string;
    amount: number;
    isWalletConnected: boolean;
    errors: FormErrors;
    isSubmitted: boolean;
    onBuyOptionChange: (value: string) => void;
    onSellOptionChange: (value: string) => void;
    onFrequencyChange: (value: string) => void;
    onEndDateChange: (value: string) => void;
    onAmountChange: (value: number) => void;
    onSubmit: (e: React.FormEvent) => void;
    totalAmount: number;
}

const Form: React.FC<FormProps> = ({
    buyOption,
    sellOption,
    frequency1,
    endDate,
    amount,
    isWalletConnected,
    errors,
    isSubmitted,
    onBuyOptionChange,
    onSellOptionChange,
    onFrequencyChange,
    onEndDateChange,
    onAmountChange,
    onSubmit,
    totalAmount,
    NEWtokenToBuy,
    NEWtokenToSell,
    NEWfrequency,
    NEWnextRunTime,
    NEWamountToSell,
}) => {
    const {
        authClient,
        isConnected,
        identity,
        principal,
        actor,
        whitelist,
        setAuthClient,
        setIsConnected,
        setIdentity,
        setPrincipal,
        setActor,
        setWhitelist,
    } = useAuth(); // Use the AuthContext

    return (
        <>
            <form onSubmit={onSubmit} className="form">
                <SelectInput
                    label="You buy:"
                    id="buy"
                    value={buyOption}
                    options={["BTC", "ETH", "TON"]}
                    onChange={onBuyOptionChange}
                    hasError={isSubmitted && !!errors.buyOption}
                />
                <SelectInput
                    label="You sell:"
                    id="sell"
                    value={sellOption}
                    options={["USD", "GEL", "RUB"]}
                    onChange={onSellOptionChange}
                    hasError={isSubmitted && !!errors.sellOption}
                >
                    <input
                        type="number"
                        min={0}
                        value={amount}
                        onChange={(e) => onAmountChange(parseFloat(e.target.value))}
                        placeholder="Amount"
                        className={isSubmitted && errors.amount ? "error" : ""}
                    />
                </SelectInput>
                <RadioButtons
                    frequency={frequency1}
                    setFrequency={onFrequencyChange}
                    hasError={isSubmitted && !!errors.frequency}
                />
                <DatePicker endDate={endDate} setEndDate={onEndDateChange} hasError={isSubmitted && !!errors.endDate} />
                {isConnected ? (
                    <SubmitButton
                        label="Submit"
                        isWalletConnected={isWalletConnected}
                        onSubmit={onSubmit}
                        errors={errors}
                    />
                ) : (
                    <ConnectWalletButton />
                )}
            </form>
        </>
    );
};

export default Form;
