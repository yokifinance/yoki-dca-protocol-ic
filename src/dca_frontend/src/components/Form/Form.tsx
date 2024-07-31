import React from "react";
import "./Form.css";
import FormSubtotal from "../FormSubtotal/FormSubtotal";
import RadioButtons from "../RadioButtons/RadioButtons";
import SelectInput from "../SelectInput/SelectInput";
import DatePicker from "../DatePicker/DatePicker";
import SubmitButton from "../SubmitButton/SubmitButton";
import { FormErrors } from "../../utils/validation";

interface FormProps {
    buyOption: string;
    sellOption: string;
    frequency: string;
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
    frequency,
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
}) => {
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
                    frequency={frequency}
                    setFrequency={onFrequencyChange}
                    hasError={isSubmitted && !!errors.frequency}
                />
                <DatePicker endDate={endDate} setEndDate={onEndDateChange} hasError={isSubmitted && !!errors.endDate} />
                <FormSubtotal
                    buyOption={buyOption}
                    sellOption={sellOption}
                    frequency={frequency}
                    endDate={endDate}
                    amount={amount}
                />
                <div>Total Amount: {totalAmount}</div>
                <SubmitButton
                    label="Submit"
                    isWalletConnected={isWalletConnected}
                    onSubmit={onSubmit}
                    errors={errors}
                />
            </form>
        </>
    );
};

export default Form;
