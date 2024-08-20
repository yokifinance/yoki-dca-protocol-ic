import React, { useEffect, useState } from "react";
import "./Portfolio.css";
import { useAuth } from "../../context/AuthContext";
import { Position } from "../../../declarations/dca_backend/dca_backend.did.js";
import icpIcon from "../../images/internet-computer-icp-logo.svg";
import { useCryptoConvert } from "../../context/CryptoConvertContext";
import ckBTCIcon from "../../images/ckBTC.svg";
import inProgressIcon from "../../images/repeat-svgrepo-com.svg";
import doneIcon from "../../images/checkmark-xs-svgrepo-com.svg";

interface PortfolioProps {
    onDetailsClick: () => void;
}

const Portfolio: React.FC<PortfolioProps> = ({ onDetailsClick }) => {
    const { isConnected, actorBackend } = useAuth();
    const [positions, setPosition] = useState<Position[]>([]);
    const convert = useCryptoConvert();

    useEffect(() => {
        const getAllPosition = async () => {
            try {
                const pos = await actorBackend.getAllPositions();
                if (pos.ok) {
                    setPosition(pos.ok);
                    console.log(pos.ok);
                }
            } catch (error) {
                console.log("Error fetching positions:", error);
            }
        };

        if (isConnected) {
            getAllPosition();
        } else {
            console.warn("II isn't connected");
        }
    }, [isConnected, actorBackend]);

    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<number | null>(null);

    const convertToken = async (amountToConvert: BigInt) => {
        try {
            const convertedIcp = await convert.ICP.BTC(Number(amountToConvert));
            return convertedIcp;
        } catch (error) {
            console.warn("Error converting ICP to BTC:", error);
        }
    };

    const handleButtonClick = (id: number) => {
        console.log(`Button clicked for item with index: ${id}`);
        setSelectedItem(id);
        setShowPopup(!showPopup);
    };

    const handleClosePosition = async () => {
        if (selectedItem !== null) {
            try {
                // Convert selectedItem to bigint
                const indexBigInt = BigInt(selectedItem);
                const result = await actorBackend.closePosition(indexBigInt);

                if (result.ok) {
                    console.log("Position closed successfully");
                    // Remove the position from the list
                    setPosition((prevPositions) => prevPositions.filter((_, index) => index !== selectedItem));
                } else {
                    console.error("Error closing position:", result.err);
                }
            } catch (error) {
                console.error("Error calling closePosition:", error);
            }
        }
    };

    const castAmounts = (amount: BigInt): string => {
        const devidedAmount = Number(amount) / 100000000;
        return devidedAmount.toString();
    };

    const getCurrentStatus = (purchasesLeft: BigInt): boolean => {
        console.log(purchasesLeft);
        if (Number(purchasesLeft) > 0) {
            return false;
        }
        return true;
    };

    // const countTotalAmount = ()

    return (
        <ul className="portfolio">
            {positions.map((item, index) => (
                <li className="portfolio-item" key={index}>
                    <div className="portfolio-item__status-container">
                        <div className="portfolio-item__status-sub-container">
                            <img
                                className="portfolio-item__status-icon"
                                src={getCurrentStatus(item.purchasesLeft) ? doneIcon : inProgressIcon}
                                alt="Internet Identity"
                            />
                            <span className="portfolio-item__value">{Object.keys(item.frequency)[0]}</span>
                        </div>
                        <span className="portfolio-item__warn-description">
                            {getCurrentStatus(item.purchasesLeft) ? "Done" : "In progress"}
                        </span>
                    </div>
                    <div className="portfolio-item__container">
                        <div className="portfolio-item__sub-container">
                            <span className="portfolio-item__key">Purchases left:</span>
                            <div className="portfolio-item__details-container">
                                <span className="portfolio-item__value">{item.purchasesLeft.toString()}</span>
                            </div>
                        </div>
                        <div className="portfolio-item__sub-container">
                            <span className="portfolio-item__key">Amount to sale:</span>
                            <div className="portfolio-item__details-container">
                                <span className="portfolio-item__value">{castAmounts(item.amountToSell)} ICP</span>
                                <img className="portfolio-item__image" src={icpIcon} alt="Internet Identity" />
                            </div>
                        </div>
                        <div className="portfolio-item__sub-container">
                            <span className="portfolio-item__key">Total tokens bought:</span>
                            <div className="portfolio-item__details-container">
                                <span className="portfolio-item__value">1000 BTC</span>
                                <img className="portfolio-item__image" src={ckBTCIcon} alt="Internet Identity" />
                            </div>
                        </div>
                    </div>
                    <button className="portfolio-item__button" onClick={() => handleButtonClick(index)}>
                        ⋮
                        {showPopup && selectedItem === index && (
                            <div className="portfolio-item__popup">
                                <div onClick={handleClosePosition}>Close position</div>
                            </div>
                        )}
                    </button>
                </li>
            ))}
        </ul>
    );
};

// item.amountToSell.toString()

export default Portfolio;
