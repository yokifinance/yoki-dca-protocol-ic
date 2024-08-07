import React from "react";
import "./AuthModalButtons.css";
import InternetIdentityIcon from "../../images/internet-computer-icp-logo.svg"; // путь к вашей иконке
import PlugIcon from "../../images/plugLogo.png"; // путь к вашей иконке

const InternetIdentityButton: React.FC = () => (
    <button className="auth-modal-button">
        <span>Internet Identity</span>
        <img className="auth-modal-button__image" src={InternetIdentityIcon} alt="Internet Identity" />
    </button>
);

const PlugButton: React.FC = () => (
    <button className="auth-modal-button">
        <span>Plug</span>
        <img className="auth-modal-button__image" src={PlugIcon} alt="Plug" />
    </button>
);

export { InternetIdentityButton, PlugButton };
