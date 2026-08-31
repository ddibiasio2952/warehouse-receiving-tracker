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
    putLineReceipt
} from "../controllers/purchaseOrderController";

// Create a router for PO endpoints
const purchaseOrderRouter: Router = Router();

// GET /api/purchase-orders
// Get all POs 
purchaseOrderRouter.get(
    "/",
    getAllPurchaseOrders
);

// GET /api/purchase-orders/:id/summary
// Get PO Summary by Id 
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

// GET /api/purchase-orders/:id/line-reports-by-po
// Get line reports by PO Id 
purchaseOrderRouter.get(
    "/:id/line-reports-by-po",
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

// POST /api/purchase-orders/:id
// Post a new PO line
purchaseOrderRouter.post(
    "/lines/:id",
    postOrderLine
)

// PUT /api/purchase-orders/lines/:id/receipt
// Put a new receipt for a PO line
purchaseOrderRouter.put(
    "/lines/:id/receipt",
    putLineReceipt
);

// Export
export default purchaseOrderRouter;