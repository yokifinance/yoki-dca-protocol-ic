import React, { Children, useState } from "react";
import "./OpenPosition.css";
import { handleOpenPosition } from "../../utils/auth";
import { Position, Frequency } from "../../../declarations/dca_backend/dca_backend.did.js";
import { useAuth } from "../../context/AuthContext";

interface OpenPositionProps {
    children: React.ReactNode;
    buyOption: string;
    sellOption: string;
    frequency: string;
    endDate: string;
    amount: number;
}

const OpenPosition: React.FC<OpenPositionProps> = ({ children, buyOption, sellOption, frequency, endDate, amount }) => {
    const { isConnected, actorBackend, whitelist, principal } = useAuth();

    const mapToFrequency = (frequency: string): Frequency => {
        switch (frequency) {
            case "Weekly":
                return { Weekly: null };
            case "Daily":
                return { Daily: null };
            case "Monthly":
                return { Monthly: null };
            default:
                console.log(frequency);
                throw new Error("Invalid frequency");
        }
    };

    const openPosition = () => {
        const mappedFrequency = mapToFrequency(frequency);
        handleOpenPosition(actorBackend, whitelist, principal, BigInt(amount), mappedFrequency, BigInt(100));
    };

    return (
        <div className="open-position">
            <p className="open-position__description">Once confirmed, this subscription will be created:</p>
            <div className="open-position__children">{children}</div>
            <p className="open-position__warn-text">Your first purchase will proceed right away</p>
            <ul className="open-position__buttons">
                <li className="open-position__button open-position__button_approve">
                    <button onClick={openPosition}>Create subscription</button>
                </li>
                <li className="open-position__button open-position__button_change">
                    <button>Correct form</button>
                </li>
            </ul>
        </div>
    );
};

export default OpenPosition;
