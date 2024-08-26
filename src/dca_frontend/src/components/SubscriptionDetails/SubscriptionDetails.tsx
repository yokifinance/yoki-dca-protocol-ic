import React from "react";
import "./SubscriptionDetails.css";

const subscriptionDetailsData = [
    { label: "Detail 1", value: "Value 1" },
    { label: "Detail 2", value: "Value 2" },
    { label: "Detail 3", value: "Value 3" },
    { label: "Detail 4", value: "Value 4" },
    { label: "Detail 5", value: "Value 5" },
    { label: "Detail 6", value: "Value 6" },
    { label: "Detail 7", value: "Value 7" },
    { label: "Detail 8", value: "Value 8" },
    { label: "Detail 9", value: "Value 9" },
    { label: "Detail 10", value: "Value 10" },
];

const SubscriptionDetails: React.FC = () => {
    return (
        <div className="subscription-details">
            <h1 className="subscription-details__title">Subscription Details</h1>
            {subscriptionDetailsData.map((detail, index) => (
                <div key={index} className="subscription-details__item">
                    <span className="subscription-details__label">{detail.label}</span>
                    <span className="subscription-details__value">{detail.value}</span>
                </div>
            ))}
        </div>
    );
};

export default SubscriptionDetails;
