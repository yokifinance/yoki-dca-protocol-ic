import { useMemo } from "react";
import { differenceInDays, parseISO } from "date-fns";

const convertFrequencyToDays = (frequency: string): number => {
    const frequencyMapping: { [key: string]: number } = {
        "1 hour": 1 / 24,
        "4 hours": 4 / 24,
        "8 hours": 8 / 24,
        "12 hours": 12 / 24,
        "1 day": 1,
        "1 week": 7,
        "2 weeks": 14,
        "4 weeks": 28,
    };
    return frequencyMapping[frequency] || 1;
};

const calculateTotalAmount = (amount: number, frequency: string, endDate: string): number => {
    const today = new Date();
    const end = parseISO(endDate);
    const daysDifference = differenceInDays(end, today) + 1;
    const frequencyInDays = convertFrequencyToDays(frequency);
    const numberOfPayments = Math.ceil(daysDifference / frequencyInDays);
    const totalAmount = amount * numberOfPayments;
    return totalAmount;
};

export const useCalculateTotalAmount = (amount: number, frequency: string, endDate: string) => {
    return useMemo(() => calculateTotalAmount(amount, frequency, endDate), [amount, frequency, endDate]);
};
