import React, { useState, useEffect } from "react";
import "./Main.css";
import FormContainer from "../FormContainer/FormContainer";
import FormNavigation from "../FormNavigation/FormNavigation";
import Form from "../Form/Form";
import { useCalculateTotalAmount } from "../../utils/useCalculateTotalAmount";
import { validateForm, FormErrors } from "../../utils/validation";
import Portfolio from "../Portfolio/Portfolio";
import SubscriptionDetails from "../SubscriptionDetails/SubscriptionDetails";

const Main: React.FC = () => {
    const [buyOption, setBuyOption] = useState<string>("");
    const [sellOption, setSellOption] = useState<string>("");
    const [frequency, setFrequency] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [amount, setAmount] = useState<number>(1.0);
    const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [activeFormNavigationButton, setActiveFormNavigationButton] = useState<number>(0);
    const [showSubscriptionDetails, setShowSubscriptionDetails] = useState<boolean>(false);

    const totalAmount = useCalculateTotalAmount(amount, frequency, endDate);

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setShowSubscriptionDetails(false);
            }
        };
        window.addEventListener("keydown", handleEsc);

        return () => {
            window.removeEventListener("keydown", handleEsc);
        };
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);
        const formErrors = validateForm(buyOption, sellOption, amount, endDate, frequency);
        if (Object.keys(formErrors).length === 0) {
            // Если нет ошибок, выполнить логику сабмита
            console.log({ buyOption, sellOption, frequency, endDate });
        } else {
            // Если есть ошибки, установить их в состояние
            setErrors(formErrors);
            console.log(formErrors);
        }
    };

    return (
        <main className="main">
            <FormContainer>
                {!showSubscriptionDetails ? (
                    <>
                        <FormNavigation
                            activeFormNavigationButton={activeFormNavigationButton}
                            onFormNavigationClick={setActiveFormNavigationButton}
                        />
                        {activeFormNavigationButton === 0 ? (
                            <Form
                                buyOption={buyOption}
                                sellOption={sellOption}
                                frequency={frequency}
                                endDate={endDate}
                                amount={amount}
                                isWalletConnected={isWalletConnected}
                                errors={errors}
                                isSubmitted={isSubmitted}
                                onBuyOptionChange={setBuyOption}
                                onSellOptionChange={setSellOption}
                                onFrequencyChange={setFrequency}
                                onEndDateChange={setEndDate}
                                onAmountChange={setAmount}
                                onSubmit={handleSubmit}
                                totalAmount={totalAmount}
                            />
                        ) : (
                            <Portfolio onDetailsClick={() => setShowSubscriptionDetails(true)} />
                        )}
                    </>
                ) : (
                    <SubscriptionDetails />
                )}
            </FormContainer>
        </main>
    );
};

export default Main;
