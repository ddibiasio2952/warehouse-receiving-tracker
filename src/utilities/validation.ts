import { Supplier } from "../types/types";

// Positive Integer Check for Id Validation
export function isPositiveInteger(value: number): boolean {
    return Number.isInteger(value) && value > 0;
}

// Validate received and damaged quantities, valid inputs return "true"
export function validateQuantities(received: number, damaged: number): boolean {
    return (
        Number.isInteger(received) &&
        Number.isInteger(damaged) &&
        received >= 0 &&
        damaged >= 0 &&
        received >= damaged);
}

// Validate supplier
export function validateSupplier(supplier: string): supplier is Supplier {
    return ["Victoria Bay", "Novolex", "Dart"].includes(supplier);
}

// Validate a date is in the future
export function validateDate(date: string): boolean {
    // Pattern: Year-Month-Day
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;

    // Verify date fits pattern
    if (!datePattern.test(date)) {
        return false;
    }
    // Create new date object from passed string
    const dateValue = new Date(`${date}T00:00:00.000Z`);

    // Verify the date string represents a valid date (month / day constraints)
    if (Number.isNaN(dateValue.getTime())) {
        return false;
    }

    return dateValue > new Date();
}