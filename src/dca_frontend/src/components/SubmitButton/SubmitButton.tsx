import React, { useEffect } from "react";
import "./SubmitButton.css";

interface SubmitButtonProps {
    label: string;
    isWalletConnected: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ label, isWalletConnected }) => {
    return (
        <button
            className="submit-button"
            type="submit"
            // disabled={isWalletConnected || Object.keys(errors).length > 0}
            onClick={() => console.log("здарова")}
        >
            {label}
        </button>
    );
};

export default SubmitButton;
