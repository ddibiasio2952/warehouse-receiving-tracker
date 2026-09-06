import type {
    ApiErrorResponse,
    Supplier
} from "../../../../../src/types/types";

// Retrieve every supplier
export async function getSuppliers():
    Promise<Supplier[]> {
    const response = await fetch("/api/suppliers");

    // Throw an error if request is unsuccessful
    if (!response.ok) {
        const errorData =
            await response.json() as ApiErrorResponse;

        throw new Error(errorData.message ??
            "Failed to retrieve suppliers.");
    }

    // Convert response into supplier objects
    const data: Supplier[] = await response.json();

    return data;
}

