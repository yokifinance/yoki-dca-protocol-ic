import React from "react";
import "./DatePicker.css";

interface DatePickerProps {
    endDate: string;
    hasError: boolean;
    setEndDate: (value: string) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ endDate, setEndDate, hasError }) => {
    const today = new Date().toISOString().split("T")[0]; // Получаем сегодняшнюю дату в формате YYYY-MM-DD

    return (
        <div className={`date-picker ${hasError ? "error" : ""}`}>
            <label htmlFor="endDate" className="date-picker__label">
                End date:
            </label>
            <input
                className={`date-picker__input`}
                type="date"
                id="endDate"
                value={endDate}
                min={today}
                onChange={(e) => setEndDate(e.target.value)}
            />
        </div>
    );
};

export default DatePicker;
