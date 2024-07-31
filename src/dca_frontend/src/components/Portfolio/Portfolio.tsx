import React, { useState } from "react";
import "./Portfolio.css";

interface PortfolioItem {
    id: number;
    payment: string;
    purchased: string;
    endDate: string;
}

interface PortfolioProps {
    onDetailsClick: () => void;
}

const portfolioData: PortfolioItem[] = [
    {
        id: 1,
        payment: "1 USDC / 1 day",
        purchased: "0.00014719 WBTC",
        endDate: "06/06/2023",
    },
    {
        id: 2,
        payment: "1 USDT / 1 day",
        purchased: "1.46382974535768151 WMATIC",
        endDate: "07/07/2023",
    },
];

const Portfolio: React.FC<PortfolioProps> = ({ onDetailsClick }) => {
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<number | null>(null);

    const handleButtonClick = (id: number) => {
        setSelectedItem(id);
        setShowPopup(!showPopup);
    };

    const handleDetailsClick = () => {
        setShowPopup(false);
        onDetailsClick();
    };

    return (
        <div className="portfolio">
            {portfolioData.map((item) => (
                <div className="portfolio-item" key={item.id}>
                    <div className="portfolio-item__details">
                        <span className="portfolio-item__payment">{item.payment}</span>
                        <span className="portfolio-item__purchased">{item.purchased}</span>
                        <span className="portfolio-item__end-date">{item.endDate}</span>
                    </div>
                    <div className="portfolio-item__actions">
                        <button className="portfolio-item__button" onClick={() => handleButtonClick(item.id)}>
                            ⋮
                        </button>
                        {showPopup && selectedItem === item.id && (
                            <div className="portfolio-item__popup">
                                <div onClick={handleDetailsClick}>Subscription Details</div>
                                <div>View Contract</div>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Portfolio;
