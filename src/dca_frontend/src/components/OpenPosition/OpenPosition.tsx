import React, { useState } from "react";
import "./OpenPosition.css";
import { handleOpenPosition } from "../../utils/auth";
import { Position, Frequency } from "../../../declarations/dca_backend/dca_backend.did.js";
import { useAuth } from "../../context/AuthContext";
import { Principal } from "@dfinity/principal";

interface OpenPositionProps {
    children: React.ReactNode;
    buyOption: string;
    sellOption: string;
    frequency: string;
    endDate: string;
    amount: number;
    onClose: () => void;
    numberOfPayments: number;
}

const OpenPosition: React.FC<OpenPositionProps> = ({
    children,
    buyOption,
    sellOption,
    frequency,
    endDate,
    amount,
    onClose,
    numberOfPayments,
}) => {
    const { isConnected, actorBackend, actorLedger, whitelist, principal } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isPositionCreated, setIsPositionCreated] = useState<boolean>(false);

    const mapToFrequency = (frequency: string): Frequency => {
        switch (frequency) {
            case "Weekly":
                return { Weekly: null };
            case "Daily":
                return { Daily: null };
            case "Monthly":
                return { Monthly: null };
            default:
                throw new Error("Invalid frequency");
        }
    };

    const openPosition = async () => {
        setIsSubmitting(true);

        try {
            const totalPurchasesAmmount = (amount * 10000000000000000 + 10_000) * numberOfPayments;

            const approveArgs = {
                amount: totalPurchasesAmmount,
                spender: {
                    owner: Principal.fromText(whitelist[1]),
                    subaccount: [],
                },
                fee: [],
                memo: [],
                from_subaccount: [],
                created_at_time: [],
                expected_allowance: [],
                expires_at: [],
            };

            const approve = await actorLedger.icrc2_approve(approveArgs);
            if (approve.Ok) {
                const mappedFrequency = mapToFrequency(frequency);
                const response = await handleOpenPosition(
                    actorBackend,
                    whitelist,
                    principal,
                    BigInt(amount * 100000000),
                    mappedFrequency,
                    BigInt(numberOfPayments)
                );
                if (response.ok !== undefined) {
                    setIsPositionCreated(true);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="open-position">
            <p className="open-position__description">Once confirmed, this subscription will be created:</p>
            <div className="open-position__children">{children}</div>
            <p className="open-position__warn-text">Your first purchase will proceed right away</p>
            <ul className="open-position__buttons">
                <li className="open-position__button open-position__button_approve">
                    <button onClick={openPosition} disabled={isSubmitting}>
                        {isPositionCreated ? "Position created" : isSubmitting ? "Creating..." : "Create subscription"}
                    </button>
                </li>
                <li className="open-position__button open-position__button_change" onClick={onClose}>
                    <button disabled={isSubmitting}>Correct form</button>
                </li>
            </ul>
        </div>
    );
};

export default OpenPosition;
