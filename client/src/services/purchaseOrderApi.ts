import type {
    PurchaseOrderDetails,
    LineResult,
    ReceiptRequestBody
} from "../../../src/types/types";

// Retrieve every purchase order
export async function getPurchaseOrders():
    Promise<PurchaseOrderDetails[]> {
    const response = await fetch("/api/purchase-orders");

    // Throw an error if request is unsuccessful
    if (!response.ok) {
        throw new Error("Failed to retrieve purchase orders.");
    }

    // Convert response into purchase order objects
    const data: PurchaseOrderDetails[] = await response.json();

    return data;
}

// Retrieve line reports belonging to one purchase order
export async function getLineReports(
    purchaseOrderId: number
): Promise<LineResult[]> {
    const response = await fetch(
        `/api/purchase-orders/${purchaseOrderId}/lines`
    );

    // Throw an error if request is unsuccessful
    if (!response.ok) {
        throw new Error("Failed to retrieve line reports.");
    }

    // Convert response into line report objects
    const data: LineResult[] = await response.json();

    return data;
}

// Received received adn damaged quantities for one purchase order line
export async function recordReceipt(
    lineId: number,
    receipt: ReceiptRequestBody
): Promise<LineResult> {
    const response = await fetch(
        `/api/purchase-orders/lines/${lineId}/receipt`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(receipt)
        }
    );

    // Throw an error if request is unsucessful
    if (!response.ok) {
        throw new Error("Failed to record receipt.");
    }

    // Convert the response into an updated line result
    const data: LineResult = await response.json();

    return data;
}