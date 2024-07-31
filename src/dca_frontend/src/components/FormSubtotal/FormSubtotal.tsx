import React from "react";
import "./FormSubtotal.css";

interface FormSubtotalProps {
    buyOption: string;
    sellOption: string;
    frequency: string;
    endDate: string;
    amount: number;
}

const FormSubtotal: React.FC<FormSubtotalProps> = ({ buyOption, sellOption, frequency, endDate, amount }) => {
    return (
        <div className="form-subtotal">
            <p className="form-subtotal__title">Details</p>
            <ul className="form-subtotal__list">
                <li className="form-subtotal__element">
                    <span>I will Purchase:</span>
                    <span>{buyOption}</span>
                </li>
                <li className="form-subtotal__element">
                    <span>Payment:</span>
                    <span>
                        {amount}, {sellOption} / {frequency}
                    </span>
                </li>
                <li className="form-subtotal__element">
                    <span>Untill:</span>
                    <span>{endDate}</span>
                </li>
            </ul>
        </div>
    );
};

export default FormSubtotal;
