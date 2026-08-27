import { 
    PurchaseOrderStatus,
    Discrepancy,
    Sku,
    PurchaseOrder,
    PurchaseOrderLine,
    DiscrepancyResult,
    PurchaseOrderSummary
 } from "../types";

import {
    firstSku,
    secondSku,
    firstPurchaseOrder,
    secondPurchaseOrder,
    firstPurchaseOrderLine,
    secondPurchaseOrderLine,
    thirdPurchaseOrderLine,
    skus,
    purchaseOrderLines
} from "../data"

/* FUNCTIONS */

// POST a Sku
export const addSku = (sku: Sku): void => {
    skus.push(sku);
    console.log(`Added ${sku.description} to the skus array.`);
};

// Get all Skus
export const getSkus = (): Sku[] => {
    return skus;
};

// Add a PurchaseOrderLine
export const addPurchaseOrderLine = (purchaseOrderLine: PurchaseOrderLine): void => {
    purchaseOrderLines.push(purchaseOrderLine);
    console.log(`Added a purchaseOrderLine to the purchaseOrderLines array.`);
};

// Get all PurchaseOrderLines
export const getPurchaseOrders = (): PurchaseOrderLine[] => {
    return purchaseOrderLines;
};

// Record a received quantity
export const recordReceivedQuantities = (
    line: PurchaseOrderLine,
    received: number,
    damaged: number
): PurchaseOrderLine => {
    if (received < 0 || damaged < 0) {
        throw new Error("Quantities cannot be negative.");
    }

    if (damaged > received) {
        throw new Error("Damaged quantity cannot exceed received quantity.");
    }

    line.receivedQuantity = received;
    line.damagedQuantity = damaged;

    return line;
};

// Calculate the Discrepancy
export const calculateDiscrepancy = (
    line: PurchaseOrderLine
): DiscrepancyResult => {
    // Get the difference
    const difference: number = calculateDifference(line);
    // Get the status
    const discrepancyStatus: Discrepancy = getDiscrepancyStatus(difference);

    // Return DiscrepancyResult
    return {
        purchaseOrderLineId: line.id,
        expectedQuantity: line.expectedQuantity,
        receivedQuantity: line.receivedQuantity,
        damagedQuantity: line.damagedQuantity,
        usableReceived:
            line.receivedQuantity - line.damagedQuantity,
        difference: difference,
        status: discrepancyStatus
    };
};

// Get Discrepancy status
export function getDiscrepancyStatus(difference: number): Discrepancy {

    return difference < 0 ? "shortage" :
        difference > 0 ? "overage" :
            "match";
};

// Calculate the difference
export function calculateDifference(line: PurchaseOrderLine): number {
    return (line.receivedQuantity - line.damagedQuantity) - line.expectedQuantity;
};

// Run all purchase order lines
export function getPurchaseOrderDiscrepancies(purchaseOrderId: number): DiscrepancyResult[] {
    // Process each entry in purchaseOrderLines array

    return purchaseOrderLines
    .filter(line => line.purchaseOrderId === purchaseOrderId)
    .map(line => calculateDiscrepancy(line));
}

// Summarize a Purchase Order
export function summarizePurchaseOrder(purchaseOrderId: number): PurchaseOrderSummary {
    const discrepancies = getPurchaseOrderDiscrepancies(purchaseOrderId);
    
    return discrepancies.reduce<PurchaseOrderSummary>(
        (accumulator, currentItem) => {
            accumulator.totalLines += 1;
            if (currentItem.status !== "match") {
                accumulator.discrepancyLines += 1;
            }
            accumulator.totalExpected += currentItem.expectedQuantity;
            accumulator.totalReceived += currentItem.receivedQuantity;
            accumulator.totalDamaged += currentItem.damagedQuantity;
            accumulator.totalUsableReceived += currentItem.usableReceived;
            accumulator.netDifference += currentItem.difference;

            return accumulator;
        }, 
        {
            purchaseOrderId: purchaseOrderId,
            totalLines: 0,
            discrepancyLines: 0,
            totalExpected: 0,
            totalReceived: 0,
            totalDamaged: 0,
            totalUsableReceived: 0,
            netDifference: 0
        }
    );
}

// Check if purchase order requires review
export function purchaseOrderRequiresReview(orderId: number): boolean {
    const discrepancies = getPurchaseOrderDiscrepancies(orderId);

    return discrepancies.some(result => result.status !== "match");    
}

// Review queue
export function getPurchaseOrdersToReview(orders: PurchaseOrderLine[]): PurchaseOrderSummary[] {
    return orders
        .filter(order => purchaseOrderRequiresReview(order.id))
        .map(order => summarizePurchaseOrder(order.id));
}

// Process Receipt function
export function processReceipt(
    lineId: number,
    received: number,
    damaged: number
): DiscrepancyResult | undefined {
    // Validate lineId
    if (lineId <= 0) {
        throw new Error("Id must be greater than 0.");
    }

    // Search for PO line
    const line = purchaseOrderLines.find(purchaseOrder =>
            purchaseOrder.id === lineId);
    
    // Validate PO line
    if (line === undefined) {
        return undefined;
    }

    // Record received quantities
    const modifiedLine = recordReceivedQuantities(line, received, damaged);

    // Calculate discrepancy and return result
    return calculateDiscrepancy(modifiedLine);
}