import React, { useEffect, useRef, useState } from "react";
import "./Popup.css";
import closeButtonIcon from "../../images/cross-svgrepo-com.svg";

interface PopupProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Popup: React.FC<PopupProps> = ({ isOpen, onClose, children }) => {
    const [isVisible, setIsVisible] = useState(isOpen);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            const timeoutId = setTimeout(() => setIsVisible(false), 300); // Время должно совпадать с длительностью анимации
            return () => clearTimeout(timeoutId);
        }
    }, [isOpen]);

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

    if (!isVisible) {
        return null;
    }

    return (
        <div className={`popup-overlay ${isOpen ? "popup-overlay-show" : "popup-overlay-hide"}`}>
            <div className={`popup ${isOpen ? "popup-show" : "popup-hide"}`} ref={modalRef}>
                <button className="popup__close-button" onClick={onClose}>
                    <img className="popup__close-button-icon" src={closeButtonIcon} alt="Close" />
                </button>
                <div className="popup__container">{children}</div>
            </div>
        </div>
    );
};

export default Popup;
