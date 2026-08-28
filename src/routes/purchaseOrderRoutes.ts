// Import Express's Router function and request / response types
import {
    Router,
    type Request,
    type Response
} from "express";

// Import sample PO data
import { purchaseOrderLines} from "../data";

// Import business logic
import { summarizePurchaseOrder } from "../services/purchaseOrderService";

// Create a router for PO endpoints
const purchaseOrderRouter: Router = Router();

// GET /api/purchase-orders/:id/summary

purchaseOrderRouter.get(
    "/:id/summary",
    (request: Request, response: Response): void => {
        // Convert route param from string to number
        const purchaseOrderId: number = Number(request.params.id);

        // Validate Id
        if (
            !Number.isInteger(purchaseOrderId) ||
            purchaseOrderId <= 0
        ) {
            response.status(400).json({
                message: "Purchase order Id must be a positive integer."
            });

            return;
        }

        // Validate if PO exists
        const orderFound: boolean = purchaseOrderLines.some(
            order => order.id === purchaseOrderId,
        );

        console.log(orderFound);

        // Return 404 if no PO has that Id
        if (!orderFound) {
            response.status(404).json({
                message: "Purchase order not found."
            });

            return
        }

        // Generate and return PO summary
        const summary = summarizePurchaseOrder(purchaseOrderId);

        response.status(200).json(summary);
    }
);

// Export
export default purchaseOrderRouter;