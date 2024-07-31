import React, { useEffect } from "react";
import "./SubmitButton.css";

interface SubmitButtonProps {
    label: string;
    isWalletConnected: boolean;
    errors: object;
    onSubmit: (e: React.FormEvent) => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ label, isWalletConnected, onSubmit, errors }) => {
    return (
        <button
            className="submit-button"
            type="submit"
            disabled={isWalletConnected || Object.keys(errors).length > 0}
            onClick={onSubmit}
        >
            {label}
        </button>
    );
};

export default SubmitButton;
