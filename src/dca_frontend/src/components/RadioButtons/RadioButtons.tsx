import React from "react";
import "./RadioButtons.css";

interface RadioButtonsProps {
    frequency: string;
    hasError: boolean;
    setFrequency: (value: string) => void;
}

const RadioButtons: React.FC<RadioButtonsProps> = ({ frequency, setFrequency, hasError }) => {
    const options = ["1 day", "1 week", "2 weeks", "4 weeks", "1 hour", "4 hours", "8 hours", "12 hours"];

    return (
        <>
            <span className="radio-button-title">Recurring Cycle</span>
            <div className={`radio-button-container ${hasError ? "error" : ""}`}>
                {options.map((option, index) => (
                    <div className="radio-button" key={option}>
                        <input
                            type="radio"
                            id={`radio-${index}`}
                            name="frequency"
                            value={option}
                            checked={frequency === option}
                            onChange={(e) => setFrequency(e.target.value)}
                        />
                        <label className="radio-button__label" htmlFor={`radio-${index}`}>
                            {option}
                        </label>
                    </div>
                ))}
            </div>
        </>
    );
};

export default RadioButtons;
