import React, { useEffect, useState } from "react";
import "./Portfolio.css";
import { useAuth } from "../../context/AuthContext";
import { Position } from "../../../declarations/dca_backend/dca_backend.did.js";

interface PortfolioProps {
    onDetailsClick: () => void;
}

const Portfolio: React.FC<PortfolioProps> = ({ onDetailsClick }) => {
    const { isConnected, actorBackend } = useAuth();
    const [positions, setPosition] = useState<Position[]>([]);

    useEffect(() => {
        const getAllPosition = async () => {
            try {
                const pos = await actorBackend.getAllPositions();
                if (pos.ok) {
                    setPosition(pos.ok);
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

    return (
        <div className="portfolio">
            {positions.map((item, index) => (
                <div className="portfolio-item" key={index}>
                    <div>Frequency: {Object.keys(item.frequency)[0]}</div>
                    <div>Amount to Sell: {item.amountToSell.toString()}</div>
                    <div>Purchases Left: {item.purchasesLeft.toString()}</div>
                    <span>{typeof index}</span>
                    <button className="portfolio-item__button" onClick={() => handleButtonClick(index)}>
                        ⋮
                        {showPopup && selectedItem === index && (
                            <div className="portfolio-item__popup">
                                <div onClick={handleClosePosition}>Close position</div>
                            </div>
                        )}
                    </button>
                </div>
            ))}
        </div>
    );
};

export default Portfolio;
