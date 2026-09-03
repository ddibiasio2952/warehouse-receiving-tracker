import { 
    LineStatus,
    LineResult,
    PurchaseOrderLine,
    PurchaseOrderLineDetails,
    PurchaseOrderSummary,
    ReceiptRequestBody
 } from "../types/types";

import {
    getPurchaseOrderLinesByOrderId,
    updateReceiptQuantities
} from "../repositories/purchaseOrderRepository";

/* FUNCTIONS */

// Calculate and return purchase order line's discrepancy
export function calculateDiscrepancy(
    line: PurchaseOrderLineDetails
): LineResult {
    // Calculate the good received products
    const difference =
        (line.receivedQuantity - line.damagedQuantity) 
        - line.expectedQuantity;

    // Get the status
    const lineStatus: LineStatus = getDiscrepancyStatus(difference);
    // Return DiscrepancyResult
    return {
        purchaseOrderLineId: line.id,
        supplierId: line.supplierId,
        supplierName: line.supplierName,
        skuNumber: line.skuNumber,
        skuDescription: line.skuDescription,
        expectedQuantity: line.expectedQuantity,
        receivedQuantity: line.receivedQuantity,
        damagedQuantity: line.damagedQuantity,
        usableReceived:
            line.receivedQuantity - line.damagedQuantity,
        difference: difference,
        status: lineStatus
    };
};

// Get purchase order discrepancy status
export function getDiscrepancyStatus(difference: number): LineStatus {

    return difference < 0 ? "shortage" :
        difference > 0 ? "overage" :
            "match";
};

// Get purchase order line discrepancy reports by purchase order ID
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
            if (currentItem.status === "shortage" ||
                currentItem.status === "overage") {
                accumulator.discrepancyLines += 1;
            }
            accumulator.totalExpected += currentItem.expectedQuantity;
            accumulator.totalReceived += currentItem.receivedQuantity;
            accumulator.totalDamaged += currentItem.damagedQuantity;
            accumulator.totalUsableReceived += currentItem.usableReceived;
            accumulator.netDifference += currentItem.difference ?? 0;

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
    return lineReports.some(report => 
        report.status === "shortage" ||
        report.status === "overage"
);    
}

// Process receipt function
export async function processReceipt(
    lineId: number,
    data: ReceiptRequestBody
): Promise<LineResult | undefined> {

    // Send to repository
    const updatedLine = await updateReceiptQuantities(
        lineId,
        data
    );

    // Validate purchase order line ID
    if (updatedLine === undefined) {
        return undefined;
    }

    // Calculate discrepancy of PO line and return result
    return calculateDiscrepancy(updatedLine);
}
