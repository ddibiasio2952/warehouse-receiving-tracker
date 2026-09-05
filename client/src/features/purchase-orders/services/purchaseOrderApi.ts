import type {
    PurchaseOrder,
    PurchaseOrderDetails,
    PurchaseOrderBody,
    LineResult,
    PurchaseOrderLine,
    PurchaseOrderLineDetails,
    PurchaseOrderLineRequestBody,
    ReceiptRequestBody
} from "../../../../../src/types/types";

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

// Retrieve a purchase order line by ID
export async function getPurchaseOrderLine(
    lineId: number
): Promise<PurchaseOrderLineDetails> {
    const response = await fetch(
        `/api/purchase-orders/lines/${lineId}`
    );

    if (!response.ok) {
        throw new Error(
            "Failed to retrieve the purchase order line."
        );
    }

    const data: PurchaseOrderLineDetails = await response.json();

    return data;
}

// Add a purchase order
export async function addPurchaseOrder(
    purchaseOrderBody: PurchaseOrderBody
): Promise<PurchaseOrder> {
    const response = await fetch(
        "/api/purchase-orders/add",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(purchaseOrderBody)
        }
    );

    // Throw an error if the request is unsuccessful
    if (!response.ok) {
        throw new Error("Failed to add new purchase order.");
    }

    // Convert the response into a purchase order details object
    const data: PurchaseOrder = await response.json();

    return data;
}

// Add a purchase order line to a purchase order
export async function addPurchaseOrderLine(
    orderId: number,
    lineBody: PurchaseOrderLineRequestBody
): Promise<PurchaseOrderLine> {
    const response = await fetch(
        `/api/purchase-orders/lines/${orderId}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(lineBody)
        }
    );

    // Throw an error if the request is unsuccessful
    if (!response.ok) {
        throw new Error("Failed to add new purchase order line.");
    }

    // Convert the response into a purchase order line result object
    const data: PurchaseOrderLine = await response.json();

    return data;
}

// Record receipt for one purchase order line
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

// Close a purchase order
export async function closePurchaseOrder(
    orderId: number
): Promise<PurchaseOrderDetails> {
    const response = await fetch(
        `/api/purchase-orders/${orderId}/close`,
        {
            method: "PATCH"
        }
    );

    // Throw an error if request is unsuccessful
    if (!response.ok) {
        throw new Error("Failed to record receipt.");
    }

    // Convert the response into an updated purchase order detail
    const data: PurchaseOrderDetails = await response.json();

    return data;
}