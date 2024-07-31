import React, { useState } from "react";
import "./FormNavigation.css";

interface FormNavigationProps {
    activeFormNavigationButton: number;
    onFormNavigationClick: (index: number) => void;
}

const FormNavigation: React.FC<FormNavigationProps> = ({ activeFormNavigationButton, onFormNavigationClick }) => {
    return (
        <div className="form-navigation">
            <ul className="form-navigation__links">
                <li
                    className={`form-navigation__element ${
                        activeFormNavigationButton === 0 ? "form-navigation__element_active" : ""
                    }`}
                    onClick={() => onFormNavigationClick(0)}
                >
                    <a className="form-navigation__link">New</a>
                </li>
                <li
                    className={`form-navigation__element ${
                        activeFormNavigationButton === 1 ? "form-navigation__element_active" : ""
                    }`}
                    onClick={() => onFormNavigationClick(1)}
                >
                    <a className="form-navigation__link">Portfolio</a>
                </li>
            </ul>
            <button className="form-navigation__button">Connect wallet</button>
        </div>
    );
};

export default FormNavigation;
