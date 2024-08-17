import React, { useRef, useState, useEffect } from "react";
import "./Form.css";
import SubmitButton from "../SubmitButton/SubmitButton";
import ConnectWalletButton from "../ConnectWalletButton/ConnectWalletButton";
import { useAuth } from "../../context/AuthContext";
import { useCalculateAmountsAndPayments } from "../../utils/useCalculateTotalAmount";
import RadioButtons from "../RadioButtons/RadioButtons";
import BalanceInfo from "../BalanceInfo/BalanceInfo";
import Popup from "../Popup/Popup";
import { handleOpenPosition } from "../../utils/auth";
import OpenPosition from "../OpenPosition/OpenPosition";
import FormSubtotal from "../FormSubtotal/FormSubtotal";
import { CryptoConvertProvider } from "../../context/CryptoConvertContext";

interface FormProps {
    isWalletConnected: boolean;
}

const Form: React.FC<FormProps> = ({ isWalletConnected }) => {
    const { isConnected, actorBackend, whitelist, principal } = useAuth();
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

    const [endDate, setEndDate] = useState<string>("");
    const [isFormValid, setIsFormValid] = useState<boolean>(false);

    const NEWtokenToBuy = useRef<HTMLSelectElement>(null);
    const NEWtokenToSell = useRef<HTMLSelectElement>(null);
    const NEWamountToSell = useRef<HTMLInputElement>(null);
    const [amountToSell, setAmountToSell] = useState<number>(1.0);
    const radioButtonsRef = useRef<{ getFrequency: () => string }>(null);

    useEffect(() => {
        validateForm();
    }, [endDate]);

    useEffect(() => {
        console.log(NEWamountToSell.current?.valueAsNumber);
    }, [NEWamountToSell.current?.value]);

    // Отключаем изменение значения при прокрутке колесика мыши
    useEffect(() => {
        const inputElement = NEWamountToSell.current;
        if (inputElement) {
            const handleWheel = (event: WheelEvent) => event.preventDefault();
            inputElement.addEventListener("wheel", handleWheel);

            // Убираем обработчик при размонтировании компонента
            return () => {
                inputElement.removeEventListener("wheel", handleWheel);
            };
        }
    }, []);

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
        const isFrequencyValid = radioButtonsRef.current?.getFrequency();
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
                    <select id="buy" className="select-input__input" ref={NEWtokenToBuy}>
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
                        <select id="sell" className="select-input__input" ref={NEWtokenToSell}>
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
                            ref={NEWamountToSell}
                            placeholder="Amount"
                            value={amountToSell !== undefined ? amountToSell : 0}
                            onChange={handleAmountChange}
                        />
                    </div>
                    <BalanceInfo />
                </div>

                <RadioButtons ref={radioButtonsRef} onDataChange={handleFrequencyChange} />

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

                {isConnected ? (
                    <SubmitButton
                        isWalletConnected={isWalletConnected}
                        disabled={!isFormValid}
                        buyOption={"ckBTC"}
                        sellOption={"ICP"}
                        frequency={radioButtonsRef.current?.getFrequency() || ""}
                        endDate={endDate}
                        amount={amountToSell}
                        isFormValid={isFormValid}
                    ></SubmitButton>
                ) : (
                    <ConnectWalletButton />
                )}
            </form>

            {/* Popup component that opens when the form is submitted */}
            {/* <CryptoConvertProvider>
                <Popup isOpen={isPopupOpen} onClose={handleClosePopup}>
                    <OpenPosition
                        buyOption={"ckBTC"}
                        sellOption={"ICP"}
                        frequency={radioButtonsRef.current?.getFrequency() || ""}
                        endDate={endDate}
                        amount={NEWamountToSell.current ? NEWamountToSell.current.valueAsNumber : NaN}
                    >
                        <FormSubtotal
                            buyOption={"ckBTC"}
                            sellOption={"ICP"}
                            frequency={radioButtonsRef.current?.getFrequency() || ""}
                            endDate={endDate}
                            amount={NEWamountToSell.current ? NEWamountToSell.current.valueAsNumber : NaN}
                        />
                    </OpenPosition>
                </Popup>
            </CryptoConvertProvider> */}
        </>
    );
};

export default Form;
