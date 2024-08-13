import React, { useImperativeHandle, useState, forwardRef } from "react";
import "./RadioButtons.css";

interface RadioButtonsProps {
    onDataChange: (data: string) => void;
}

const RadioButtons = forwardRef((props: RadioButtonsProps, ref) => {
    const [frequency, setFrequency] = useState<string>("");

    useImperativeHandle(ref, () => ({
        getFrequency: () => frequency,
    }));

    console.log("rb");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFrequency = e.target.value;
        setFrequency(newFrequency);
        props.onDataChange(newFrequency); // Вызываем onDataChange при изменении
    };

    const options = ["1 day", "1 week", "2 weeks"];

    return (
        <>
            <span className="radio-button-title">Recurring Cycle:</span>
            <div className="radio-button-container">
                {options.map((option, index) => (
                    <div className="radio-button" key={option}>
                        <input
                            type="radio"
                            id={`radio-${index}`}
                            name="frequency"
                            value={option}
                            checked={frequency === option}
                            onChange={handleInputChange}
                        />
                        <label className="radio-button__label" htmlFor={`radio-${index}`}>
                            {option}
                        </label>
                    </div>
                ))}
            </div>
        </>
    );
});

export default RadioButtons;
