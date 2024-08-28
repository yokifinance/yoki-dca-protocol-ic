import React, { useState, useRef, useEffect } from "react";
import "./DropDownList.css";

interface Option {
    label: string;
    value: string;
    icon: React.ReactNode;
    available: boolean;
}

interface DropDownListProps {
    selectedOption: string | null;
    onChange: (selected: string) => void;
    options: Option[];
    width?: string;
    buttonTitle: string;
}

const DropDownList: React.FC<DropDownListProps> = ({
    selectedOption,
    onChange,
    options,
    width = "100%",
    buttonTitle,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSelectionChange = (value: string, available: boolean) => {
        if (available) {
            onChange(value);
            setIsOpen(false);
        }
    };

    const selectedOptionObject = options.find((option) => option.value === selectedOption);

    return (
        <div className="custom-dropdown-menu" ref={dropdownRef} style={{ width }}>
            <button className="custom-dropdown-menu__button" onClick={() => setIsOpen(!isOpen)}>
                {selectedOptionObject ? (
                    <>
                        <span className="custom-dropdown-menu__icon">{selectedOptionObject.icon}</span>
                        {selectedOptionObject.label}
                    </>
                ) : (
                    buttonTitle
                )}
            </button>
            {isOpen && (
                <ul className="custom-dropdown-menu__list">
                    {options.map((option) => (
                        <li
                            key={option.value}
                            className={`custom-dropdown-menu__item ${
                                selectedOption === option.value ? "selected" : ""
                            } ${!option.available ? "disabled" : ""}`}
                            onClick={() => handleSelectionChange(option.value, option.available)}
                        >
                            <span className="custom-dropdown-menu__icon">{option.icon}</span>
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DropDownList;
