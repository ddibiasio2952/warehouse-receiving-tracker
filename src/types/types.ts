/* TYPES */
export type PurchaseOrderStatus = "open" | "received" | "resolved" | "closed";
export type LineStatus = "shortage" | "overage" | "match";
export type Supplier = "Victoria Bay" | "Novolex" | "Dart";

/* INTERFACES */
export interface Sku {
    id: number;
    skuNumber: string;
    description: string;
}

export interface PurchaseOrder {
    id: number;
    supplier: string;
    status: PurchaseOrderStatus;
    expectedDate: string;
}

export interface PurchaseOrderLine {
    id: number;
    purchaseOrderId: number;
    skuId: number;
    expectedQuantity: number;
    receivedQuantity: number;
    damagedQuantity: number;
    receiptRecorded: boolean;
}

export interface LineResult {
    purchaseOrderLineId: number;
    expectedQuantity: number;
    receivedQuantity: number;
    damagedQuantity: number;
    usableReceived: number;
    difference: number | null;
    status: LineStatus;
}

export interface PurchaseOrderSummary {
    purchaseOrderId: number;
    totalLines: number;
    discrepancyLines: number;
    totalExpected: number;
    totalReceived: number;
    totalDamaged: number;
    totalUsableReceived: number;
    netDifference: number;
}

export interface PurchaseOrderBody {
    supplier: string;
    status: PurchaseOrderStatus;
    expectedDate: string;
}

export interface ReceiptRequestBody {
    received: number;
    damaged: number;
}

