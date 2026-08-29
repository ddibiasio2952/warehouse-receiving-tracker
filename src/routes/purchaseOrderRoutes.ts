// Import Express's Router function and request / response types
import {
    Router,
    type Request,
    type Response
} from "express";

// Import Controllers
import {
    getPurchaseOrderSummary,
    postReceipt,
    getPurchaseOrdersForReview
} from "../controllers/purchaseOrderController";

// Create a router for PO endpoints
const purchaseOrderRouter: Router = Router();

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

// POST /api/purchase-orders/:id/receipt
purchaseOrderRouter.post(
    "/:id/receipt",
    postReceipt
);

// Export
export default purchaseOrderRouter;