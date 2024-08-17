import React, { useEffect, useState } from "react";
import "./FormSubtotal.css";
import icpIcon from "../../images/internet-computer-icp-logo.svg";
import ckBTCIcon from "../../images/ckBTC.svg";
import { useCryptoConvert } from "../../context/CryptoConvertContext";

interface FormSubtotalProps {
    buyOption: string;
    sellOption: string;
    frequency: string;
    endDate: string;
    amount: number;
}

const FormSubtotal: React.FC<FormSubtotalProps> = ({ buyOption, sellOption, frequency, endDate, amount }) => {
    const [formattedDate, setFormattedDate] = useState<string>("");
    const [btcAmount, setBtcAmount] = useState<number | null>(null);
    const convert = useCryptoConvert();

    useEffect(() => {
        const dateObj = new Date(endDate);

        const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "long",
            day: "numeric",
        };

        setFormattedDate(dateObj.toLocaleDateString("en-US", options));
    }, []);

    useEffect(() => {
        const convertToken = async () => {
            if (convert) {
                try {
                    const convertedIcp = await convert.ICP.BTC(amount);
                    if (convertedIcp) {
                        setBtcAmount(convertedIcp);
                    }
                } catch (error) {
                    console.warn("Error converting ICP to BTC:", error);
                }
            }
        };

        convertToken();
    }, []);

    return (
        <div className="form-subtotal">
            <ul className="form-subtotal__list">
                <li className="form-subtotal__element">
                    <span className="form-subtotal__element-description">You will sell:</span>
                    <div className="form-subtotal__element-sub-container">
                        <span className="form-suntotal__element-value">
                            {amount} {sellOption}
                        </span>
                        <img className="auth-modal-button__image" src={icpIcon} alt="Internet Identity" />
                    </div>
                </li>
                <li className="form-subtotal__element">
                    <span className="form-subtotal__element-description">You will buy:</span>
                    <div className="form-subtotal__element-sub-container">
                        <span className="form-suntotal__element-value">
                            {btcAmount ? btcAmount : ""} {buyOption}
                        </span>
                        <img className="auth-modal-button__image" src={ckBTCIcon} alt="Internet Identity" />
                    </div>
                </li>
                <li className="form-subtotal__element">
                    <span className="form-subtotal__element-description">How often:</span>
                    <span className="form-suntotal__element-value">{frequency}</span>
                </li>
                <li className="form-subtotal__element">
                    <span className="form-subtotal__element-description">Untill:</span>
                    <span className="form-suntotal__element-value"> {formattedDate}</span>
                </li>
            </ul>
        </div>
    );
};

export default FormSubtotal;
