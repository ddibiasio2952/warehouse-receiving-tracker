/* TYPES */
export type PurchaseOrderStatus = "open" | "closed";
export type LineStatus = "shortage" | "overage" | "match";

/* INTERFACES */

/* SUPPLIERS */
export interface Supplier {
    id: number;
    name: string;
}

/* SKUS */
export interface Sku {
    id: number;
    skuNumber: string;
    description: string;
    supplierId: number;
}

export interface SkuRequestBody {
    skuNumber: string;
    description: string;
    supplierId: number;
}

export interface SkuRetrieveBody {
    id: number;
    skuNumber: string;
    description: string;
    supplierId: number;
    supplierName: string;
}

/* PURCHASE ORDERS */
export interface PurchaseOrder {
    id: number;
    status: PurchaseOrderStatus;
    expectedDate: string;
    supplierId: number;
}

export interface PurchaseOrderDetails {
    id: number;
    status: PurchaseOrderStatus;
    expectedDate: string;
    supplierId: number;
    supplierName: string;
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
    status: PurchaseOrderStatus;
    expectedDate: string;
    supplierId: number;
}


/* PURCHASE ORDER LINES */
export interface PurchaseOrderLine {
    id: number;
    purchaseOrderId: number;
    skuId: number;
    expectedQuantity: number;
    receivedQuantity: number;
    damagedQuantity: number;
    receiptRecorded: boolean;
}

export interface PurchaseOrderLineDetails {
    id: number;
    purchaseOrderId: number;
    supplierId: number;
    supplierName: string;
    skuId: number;
    skuNumber: string;
    skuDescription: string;
    expectedQuantity: number;
    receivedQuantity: number;
    damagedQuantity: number;
    receiptRecorded: boolean;
}

export interface LineResult {
    purchaseOrderLineId: number;
    supplierId: number;
    supplierName: string;
    skuNumber: string;
    skuDescription: string;
    expectedQuantity: number;
    receivedQuantity: number;
    damagedQuantity: number;
    usableReceived: number;
    difference: number | null;
    status: LineStatus;
}

export interface PurchaseOrderLineBody {
    purchaseOrderId: number;
    skuId: number;
    expectedQuantity: number;
}

export interface PurchaseOrderLineRequestBody {
    skuId: number;
    expectedQuantity: number;
}


/* PURCHASE ORDER LINE RECEIPTS */
export interface ReceiptRequestBody {
    received: number;
    damaged: number;
}