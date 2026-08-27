

/* TYPES */
export type PurchaseOrderStatus = "open" | "received" | "resolved";
export type Discrepancy = "shortage" | "overage" | "match";

/* INTERFACES */
export interface Sku {
    id: number;
    skuNumber: string;
    description: string;
}

export interface PurchaseOrder {
    id: number;
    poNumber: string;
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
}

export interface DiscrepancyResult {
    purchaseOrderLineId: number;
    expectedQuantity: number;
    receivedQuantity: number;
    damagedQuantity: number;
    usableReceived: number;
    difference: number;
    status: Discrepancy;
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

