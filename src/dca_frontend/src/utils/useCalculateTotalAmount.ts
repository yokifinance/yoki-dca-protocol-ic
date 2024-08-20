import { useMemo } from "react";
import { differenceInDays, parseISO } from "date-fns";

const convertFrequencyToDays = (frequency: string): number => {
    if (frequency !== "") {
        const frequencyMapping: { [key: string]: number } = {
            Dayli: 1,
            Weekly: 7,
            Monthly: 28,
        };
        return frequencyMapping[frequency];
    } else {
        return 1;
    }
};

const calculateAmountsAndPayments = (amount: number, frequency: string, endDate: string): Object => {
    const today = new Date();
    const end = parseISO(endDate);
    const daysDifference = differenceInDays(end, today) + 1;
    const frequencyInDays = convertFrequencyToDays(frequency);
    const numberOfPayments = Math.ceil(daysDifference / frequencyInDays);
    const totalAmount = amount * numberOfPayments;
    return { totalAmount, numberOfPayments };
};

export const useCalculateAmountsAndPayments = (amount: number, frequency: string, endDate: string) => {
    return useMemo(() => calculateAmountsAndPayments(amount, frequency, endDate), [amount, frequency, endDate]);
};
