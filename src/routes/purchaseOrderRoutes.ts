// Import Express's Router function and request / response types
import { Router } from "express";

// Import Controllers
import {
    getAllPurchaseOrders,
    getPurchaseOrderSummary,
    getLineReportsByPurchaseOrderId,
    getLineByLineId,
    getPurchaseOrdersForReview,
    postOrder,
    postOrderLine,
    putLineReceipt,
    closePurchaseOrderStatus
} from "../controllers/purchaseOrderController";

// Create a router for purchase order endpoints
const purchaseOrderRouter: Router = Router();

// GET /api/purchase-orders
// Get all POs 
purchaseOrderRouter.get(
    "/",
    getAllPurchaseOrders
);

// GET /api/purchase-orders/:id/summary
// Get purchase order Summary by Id 
purchaseOrderRouter.get(
    "/:id/summary",
    getPurchaseOrderSummary
);

// GET /api/purchase-orders/review
// Get all POs for review 
purchaseOrderRouter.get(
    "/review",
    getPurchaseOrdersForReview
);

// GET /api/purchase-orders/:id/lines
// Get line reports by purchase order Id 
purchaseOrderRouter.get(
    "/:id/lines",
    getLineReportsByPurchaseOrderId
);

// GET /api/purchase-orders/lines/:id
// Get purchase order line by line Id 
purchaseOrderRouter.get(
    "/lines/:id",
    getLineByLineId
);

// POST /api/purchase-orders/new-order
// Post a new PO
purchaseOrderRouter.post(
    "/new-order",
    postOrder
)

// POST /api/purchase-orders/lines/:id
// Post a new purchase order line
purchaseOrderRouter.post(
    "/lines/:id",
    postOrderLine
)

// PUT /api/purchase-orders/lines/:id/receipt
// Put a new receipt for a purchase order line
purchaseOrderRouter.put(
    "/lines/:id/receipt",
    putLineReceipt
);

// PATCH /api/purchase-orders/:id/close
// Change the status of a purchase order to "closed"
purchaseOrderRouter.patch(
    "/:id/close",
    closePurchaseOrderStatus
)

// Export
export default purchaseOrderRouter;