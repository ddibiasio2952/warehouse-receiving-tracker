/* TYPES */
type PurchaseOrderStatus = "open" | "received" | "resolved";
type Discrepancy = "shortage" | "overage" | "match";

/* INTERFACES */
interface Sku {
    id: number;
    skuNumber: string;
    description: string;
}

interface PurchaseOrder {
    id: number;
    poNumber: string;
    supplier: string;
    status: PurchaseOrderStatus;
    expectedDate: string;
}

interface PurchaseOrderLine {
    id: number;
    purchaseOrderId: number;
    skuId: number;
    expectedQuantity: number;
    receivedQuantity: number;
    damagedQuantity: number;
}

interface DiscrepancyResult {
    purchaseOrderLineId: number;
    expectedQuantity: number;
    receivedQuantity: number;
    damagedQuantity: number;
    usableReceived: number;
    difference: number;
    status: Discrepancy;
}

/* INTERFACE OBJECTS */
const firstSku: Sku = {
    id: 1,
    skuNumber: "SKU01",
    description: "Plastic Spoons - 500ct Case"
};

const secondSku: Sku = {
    id: 2,
    skuNumber: "SKU02",
    description: "Plastic Forks - 500ct Case"
};

const firstPurchaseOrder: PurchaseOrder = {
    id: 1,
    poNumber: "PO01",
    supplier: "Victoria Bay Plastics",
    status: "open",
    expectedDate: "2026-09-03"
};

const firstPurchaseOrderLine: PurchaseOrderLine = {
    id: 1,
    purchaseOrderId: firstPurchaseOrder.id,
    skuId: firstSku.id,
    expectedQuantity: 20,
    receivedQuantity: 0,
    damagedQuantity: 0
};

const secondPurchaseOrderLine: PurchaseOrderLine = {
    id: 2,
    purchaseOrderId: firstPurchaseOrder.id,
    skuId: secondSku.id,
    expectedQuantity: 30,
    receivedQuantity: 0,
    damagedQuantity: 0
};

const skus: Sku[] = [];
const purchaseOrderLines: PurchaseOrderLine[] = [];

/* METHODS */

// POST a Sku
const addSku = (sku: Sku): void => {
    skus.push(sku);
    console.log(`Added ${sku.description} to the skus array.`);
};

// Get all Skus
const getSkus = (): Sku[] => {
    return skus;
};

// Add a PurchaseOrderLine
const addPurchaseOrderLine = (purchaseOrderLine: PurchaseOrderLine): void => {
    purchaseOrderLines.push(purchaseOrderLine);
    console.log(`Added a purchaseOrderLine to the purchaseOrderLines array.`);
};

// Get all PurchaseOrderLines
const getPurchaseOrderLines = (): PurchaseOrderLine[] => {
    return purchaseOrderLines;
};

// Record a received quantity
const recordReceivedQuantities = (
    line: PurchaseOrderLine,
    received: number,
    damaged: number
): PurchaseOrderLine => {
    line.receivedQuantity = received;
    line.damagedQuantity = damaged;

    return line;
};

// Calculate the Discrepancy
const calculateDiscrepancy = (
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
const getDiscrepancyStatus = (difference: number): Discrepancy => {

    return difference < 0 ? "shortage" :
        difference > 0 ? "overage" :
            "match";
};

// Calculate the difference
const calculateDifference = (line: PurchaseOrderLine): number => {
    return (line.receivedQuantity - line.damagedQuantity) - line.expectedQuantity;
};

// Run all purchase order lines
function getPurchaseOrderDiscrepancies(purchaseOrderId: number): DiscrepancyResult[] {
    // Process each entry in purchaseOrderLines array

    return purchaseOrderLines
    .filter(line => line.purchaseOrderId === purchaseOrderId)
    .map(line => calculateDiscrepancy(line));
}


// TEST
addSku(firstSku);
addSku(secondSku);
addPurchaseOrderLine(firstPurchaseOrderLine);
addPurchaseOrderLine(secondPurchaseOrderLine);
recordReceivedQuantities(firstPurchaseOrderLine, 18, 2);
recordReceivedQuantities(secondPurchaseOrderLine, 32, 1);
//console.log("Calculate Discrepancy:", 
//    calculateDiscrepancy(firstPurchaseOrderLine));

console.log("All discrepancies for PO Id #1:",
    getPurchaseOrderDiscrepancies(firstPurchaseOrder.id));