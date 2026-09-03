import type {
    Sku,
    SkuRequestBody
} from "../../../../../src/types/types";

// Retrieve every SKU
export async function getSkus():
    Promise<Sku[]> {
    const response = await fetch("/api/skus");

    // Throw an error if request is unsuccessful
    if (!response.ok) {
        throw new Error("Failed to retrieve SKUs.");
    }

    // Convert response into SKU objects
    const data: Sku[] = await response.json();

    return data;
}

// Add a SKU
export async function addSku(
    skuBody: SkuRequestBody
): Promise<Sku> {
    const response = await fetch(
        "/api/skus/new",
        {
            method: "POST",
            headers: {
                "COntent-Type": "application/json"
            },
            body: JSON.stringify(skuBody)
        }
    );

    // Throw an error if the request is unsuccessful
    if (!response.ok) {
        throw new Error("Failed to add new SKU.");
    }

    // Convert the response into a SKU object
    const data: Sku = await response.json();

    return data;
}