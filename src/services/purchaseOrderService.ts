import { 
    Discrepancy,
    PurchaseOrderLine,
    LineResult,
    PurchaseOrderSummary
 } from "../types/types";

import {
    getPurchaseOrderLinesByOrderId,
    updateReceiptQuantities
} from "../repositories/purchaseOrderRepository";

/* FUNCTIONS */

// Calculate and return purchase order line's discrepancy
export function calculateDiscrepancy(
    line: PurchaseOrderLine
): LineResult {
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

// Get purchase order discrepancy status
export function getDiscrepancyStatus(difference: number): Discrepancy {

    return difference < 0 ? "shortage" :
        difference > 0 ? "overage" :
            "match";
};

// Calculate the difference of a purchase order line
export function calculateDifference(line: PurchaseOrderLine): number {
    return (line.receivedQuantity - line.damagedQuantity) 
        - line.expectedQuantity;
};

// Get purchase order line discrepancy reports by purchase order Id
export async function getLineReports(
    purchaseOrderId: number
): Promise<LineResult[]> {
    // Retrieve lines from from repository 
    const lines = await getPurchaseOrderLinesByOrderId(purchaseOrderId);
    
    // Calculate any discrepancies and return
    return lines.map(line => calculateDiscrepancy(line));
}

// Summarize a purchase order
export async function summarizePurchaseOrder(
    purchaseOrderId: number
): Promise<PurchaseOrderSummary> {
    // Get reports for each PO line
    const lineDiscrepancyReport = await getLineReports(purchaseOrderId);
    
    // Return a summary of the purchase order
    return lineDiscrepancyReport.reduce<PurchaseOrderSummary>(
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

// Get summaries of purchase orders requiring review
export async function getPurchaseOrdersToReview(
    orders: PurchaseOrderLine[]
): Promise<PurchaseOrderSummary[]> {
    // Initiate summaries array
    const summaries: PurchaseOrderSummary[] = [];

    for (const order of orders) {
        // Get all purchase orders requiring review
        const requiresReview = 
            await purchaseOrderRequiresReview(order.id);
        
        // Summarize purchase orders requiring review
        if (requiresReview) {
            const summary = 
                await summarizePurchaseOrder(order.id);

                // Add to summaries array
                summaries.push(summary);
        }
    }

    return summaries;
}

// Check if purchase order requires review
export async function purchaseOrderRequiresReview(
    orderId: number
): Promise<boolean> {
    // Check if purchase order has discrepancies and return matching lines
    const lineReports = await getLineReports(orderId);

    // Return results which have discrepancies
    return lineReports.some(result => result.status !== "match");    
}

// Process receipt function
export async function processReceipt(
    lineId: number,
    received: number,
    damaged: number
): Promise<LineResult | undefined> {

    // Send to repository
    const updatedLine = await updateReceiptQuantities(
        lineId,
        received,
        damaged
    );

    // Validate lineId
    if (updatedLine === undefined) {
        return undefined;
    }

    // Calculate discrepancy of PO line and return result
    return calculateDiscrepancy(updatedLine);
}
