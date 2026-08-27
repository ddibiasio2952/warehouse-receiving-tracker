import { 
    PurchaseOrderStatus,
    Discrepancy,
    Sku,
    PurchaseOrder,
    PurchaseOrderLine,
    DiscrepancyResult,
    PurchaseOrderSummary
 } from "./types.js";

/* INTERFACE OBJECTS */
export const firstSku: Sku = {
    id: 1,
    skuNumber: "SKU01",
    description: "Plastic Spoons - 500ct Case"
};

export const secondSku: Sku = {
    id: 2,
    skuNumber: "SKU02",
    description: "Plastic Forks - 500ct Case"
};

export const firstPurchaseOrder: PurchaseOrder = {
    id: 1,
    poNumber: "PO01",
    supplier: "Victoria Bay Plastics",
    status: "open",
    expectedDate: "2026-09-03"
};

export const secondPurchaseOrder: PurchaseOrder = {
    id: 2,
    poNumber: "PO02",
    supplier: "Victoria Bay Plastics",
    status: "open",
    expectedDate: "2026-09-04"
};

export const firstPurchaseOrderLine: PurchaseOrderLine = {
    id: 1,
    purchaseOrderId: firstPurchaseOrder.id,
    skuId: firstSku.id,
    expectedQuantity: 20,
    receivedQuantity: 0,
    damagedQuantity: 0
};

export const secondPurchaseOrderLine: PurchaseOrderLine = {
    id: 2,
    purchaseOrderId: firstPurchaseOrder.id,
    skuId: secondSku.id,
    expectedQuantity: 30,
    receivedQuantity: 0,
    damagedQuantity: 0
};

export const thirdPurchaseOrderLine: PurchaseOrderLine = {
    id: 3,
    purchaseOrderId: secondPurchaseOrder.id,
    skuId: firstSku.id,
    expectedQuantity: 10,
    receivedQuantity: 0,
    damagedQuantity: 0
};

export const skus: Sku[] = [];
export const purchaseOrders: PurchaseOrderLine[] = [];