import type {
    Supplier
} from "../../../../../src/types/types";

// Retrieve every supplier
export async function getSuppliers():
    Promise<Supplier[]> {
        const response = await fetch("/api/suppliers");

        // Throw an error if request is unsuccessful
        if (!response.ok) {
            throw new Error("Failed to retrieve suppliers.");
        }

        // Convert response into supplier objects
        const data: Supplier[] = await response.json();

        return data;
    }

