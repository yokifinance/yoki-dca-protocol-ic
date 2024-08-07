import React, { useEffect, useRef } from "react";
import "./AuthModal.css";
import closeButtonIcon from "../../images/cross-svgrepo-com.svg";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, children }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            onClose();
        }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            onClose();
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleKeyDown);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="auth-modal-overlay">
            <div className="auth-modal" ref={modalRef}>
                <button className="auth-modal__close-button" onClick={onClose}>
                    <img className="auth-modal__close-button-icon" src={closeButtonIcon}></img>
                </button>
                <span className="auth-modal__description">Connect your wallet</span>
                <div className="auth-modal__auth-buttons-container">{children}</div>
            </div>
        </div>
    );
};

export default AuthModal;
