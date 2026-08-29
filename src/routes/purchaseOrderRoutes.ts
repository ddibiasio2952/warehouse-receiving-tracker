// Import Express's Router function and request / response types
import { Router } from "express";

// Import Controllers
import {
    getAllPurchaseOrders,
    getPurchaseOrderSummary,
    getLineReportsByPurchaseOrderId,
    getPurchaseOrdersForReview,
    postOrder,
    postReceipt
} from "../controllers/purchaseOrderController";

// Create a router for PO endpoints
const purchaseOrderRouter: Router = Router();

// GET /api/purchase-orders
purchaseOrderRouter.get(
    "/",
    getAllPurchaseOrders
)

// GET /api/purchase-orders/:id/summary
purchaseOrderRouter.get(
    "/:id/summary",
    getPurchaseOrderSummary
);

// GET /api/purchase-orders/review
purchaseOrderRouter.get(
    "/review",
    getPurchaseOrdersForReview
);

// GET /api/purchase-orders/:id/line-reports-by-po
purchaseOrderRouter.get(
    "/:id/line-reports-by-po",
    getLineReportsByPurchaseOrderId
);

// POST /api/purchase-orders/new-order
purchaseOrderRouter.post(
    "/new-order",
    postOrder
)

// POST /api/purchase-orders/:id/receipt
purchaseOrderRouter.post(
    "/:id/receipt",
    postReceipt
);

// Export
export default purchaseOrderRouter;