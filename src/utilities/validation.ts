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