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
    purchaseOrderLines
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
    processReceipt
} from "./services/purchaseOrderService"


// TEST
addSku(firstSku);
addSku(secondSku);
addPurchaseOrderLine(firstPurchaseOrderLine);
addPurchaseOrderLine(secondPurchaseOrderLine);
addPurchaseOrderLine(thirdPurchaseOrderLine);
console.log("One: ", processReceipt(1, 18, 2));
console.log("Two: ", processReceipt(2, 32, 1));
console.log("Three: ", processReceipt(3, 10, 0));