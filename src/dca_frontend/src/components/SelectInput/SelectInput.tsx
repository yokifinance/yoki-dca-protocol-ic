import React from "react";
import "./SelectInput.css";

interface SelectInputProps {
    label: string;
    id: string;
    value: string;
    options: string[];
    onChange: (value: string) => void;
    children?: React.ReactNode;
    hasError?: boolean;
}

const SelectInput: React.FC<SelectInputProps> = ({ label, id, value, options, onChange, children, hasError }) => {
    const checkForAdditionalInput = (children: React.ReactNode): string => {
        return children ? "has-additional-input" : "";
    };

    return (
        <>
            <div className={`select-input__container ${checkForAdditionalInput(children)}`}>
                <label htmlFor={id} className="select-input__label">
                    {label}
                </label>
                <div className={`select-input__controls ${checkForAdditionalInput(children)}`}>
                    <select
                        id={id}
                        className={`select-input__input ${checkForAdditionalInput(children)} ${
                            hasError ? "error" : ""
                        }`}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                    >
                        <option value="" disabled>
                            Select token
                        </option>
                        {options.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                    {children && <div className="select-input__text-field">{children}</div>}
                </div>
            </div>
        </>
    );
};

export default SelectInput;
