import React, { useState, useEffect, useRef } from "react";
import "./Main.css";
import FormContainer from "../FormContainer/FormContainer";
import FormNavigation from "../FormNavigation/FormNavigation";
import Form from "../Form/Form";
import { useCalculateAmountsAndPayments } from "../../utils/useCalculateTotalAmount";
import { validateForm, FormErrors } from "../../utils/validation";
import Portfolio from "../Portfolio/Portfolio";
import SubscriptionDetails from "../SubscriptionDetails/SubscriptionDetails";
import { CryptoConvertProvider } from "../../context/CryptoConvertContext";

const Main: React.FC = () => {
    const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [activeFormNavigationButton, setActiveFormNavigationButton] = useState<number>(0);
    const [showSubscriptionDetails, setShowSubscriptionDetails] = useState<boolean>(false);

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

    return (
        <CryptoConvertProvider>
            <main className="main">
                <FormContainer>
                    {!showSubscriptionDetails ? (
                        <>
                            <FormNavigation
                                activeFormNavigationButton={activeFormNavigationButton}
                                onFormNavigationClick={setActiveFormNavigationButton}
                            />
                            {activeFormNavigationButton === 0 ? (
                                <Form isWalletConnected={isWalletConnected} />
                            ) : (
                                <Portfolio onDetailsClick={() => setShowSubscriptionDetails(true)} />
                            )}
                        </>
                    ) : (
                        <SubscriptionDetails />
                    )}
                </FormContainer>
            </main>
        </CryptoConvertProvider>
    );
};

export default Main;
