import { 
    PurchaseOrderStatus,
    Discrepancy,
    Sku,
    PurchaseOrder,
    PurchaseOrderLine,
    DiscrepancyResult,
    PurchaseOrderSummary
 } from "./types";

import {
    firstSku,
    secondSku,
    firstPurchaseOrder,
    secondPurchaseOrder,
    firstPurchaseOrderLine,
    secondPurchaseOrderLine,
    thirdPurchaseOrderLine,
    skus,
    purchaseOrders
} from "./data"

import {
    addSku,
    getSkus,
    addPurchaseOrderLine,
    getPurchaseOrders,
    recordReceivedQuantities,
    calculateDiscrepancy,
    getDiscrepancyStatus,
    calculateDifference,
    getPurchaseOrderDiscrepancies,
    summarizePurchaseOrder,
    purchaseOrderRequiresReview,
    getPurchaseOrdersToReview,
} from "./services/purchaseOrderService"


// TEST
addSku(firstSku);
addSku(secondSku);
addPurchaseOrderLine(firstPurchaseOrderLine);
addPurchaseOrderLine(secondPurchaseOrderLine);
addPurchaseOrderLine(thirdPurchaseOrderLine);
recordReceivedQuantities(firstPurchaseOrderLine, 18, 2);
recordReceivedQuantities(secondPurchaseOrderLine, 32, 1);
recordReceivedQuantities(thirdPurchaseOrderLine, 10, 0);

console.log("Needs review? ", 
    purchaseOrderRequiresReview(firstPurchaseOrder.id));

console.log("Needs review? ", 
    purchaseOrderRequiresReview(secondPurchaseOrder.id));

console.log("Summarized Purchase Order 1: ", 
    summarizePurchaseOrder(firstPurchaseOrder.id));

console.log("Summarized Purchase Order 2: ", 
    summarizePurchaseOrder(secondPurchaseOrder.id));

console.log("Get purchase orders to review: ", getPurchaseOrdersToReview(purchaseOrders));