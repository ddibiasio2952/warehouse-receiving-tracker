// Import Express's Router function and request / response types
import {
    Router,
    type Request,
    type Response
} from "express";

// Import Validation Functions
import {
    isPositiveInteger,
    validateQuantities
} from "../utilities/validation";

// Import sample PO data
import { ReceiptRequestBody } from "../types/types";

// Import business logic
import {
    summarizePurchaseOrder,
    processReceipt,
    getPurchaseOrdersToReview
} from "../services/purchaseOrderService";

// Import repository operations
import {
    getAllPurchaseOrderLines,
    purchaseOrderExists
} from "../repositories/purchaseOrderRepository";



// Create a router for PO endpoints
const purchaseOrderRouter: Router = Router();

// Handle a request for a PO summary
export async function getPurchaseOrderSummary(
    request: Request<{ id: string }>,
    response: Response
): Promise<void> {
    // Convert route param from string to number
    const purchaseOrderId: number = Number(request.params.id);

    const exists = await purchaseOrderExists(purchaseOrderId);
    // Verify purchase order exists
    if (!exists) {
    response.status(404).json({
        message: "Purchase order not found."
    });
    return;
}

    try {
        // Generate and return PO summary
        const result = await summarizePurchaseOrder(purchaseOrderId);

        // Return error if result is undefined
        if (!result) {
            response.status(404).json({
                message: "No purchase order summary to retrieve."
            });
            return;
        }

        response.status(200).json(result);

    } catch (error) {
        console.error("Error retrieving purchase order summary: ", error);

        response.status(500).json({
            message: "An internal server error occurred."
        });
    }
}

// Handle a function to get purchase orders for review

export async function getPurchaseOrdersForReview(
    request: Request,
    response: Response
): Promise<void> {
    try {
        // Get all purchase order lines from repository
        const lines = await getAllPurchaseOrderLines();

        // Run business logic on lines
        const result = await getPurchaseOrdersToReview(lines);

        response.status(200).json(result);

    } catch (error) {
        console.error("Error retrieving purchase orders for review: ", error);

        response.status(500).json({
            message: "An internal server error occurred."
        });
    }
}

// Handle a request to post a receipt
export async function postReceipt(
    request: Request<
        { id: string },
        unknown,
        ReceiptRequestBody
    >,
    response: Response
): Promise<void> {
    try {
        // Convert route param from string to number
        const lineId = Number(request.params.id);

        // Retrieve body values
        const { received, damaged } = request.body;

        // Validate Id
        if (!isPositiveInteger(lineId)) {
            response.status(400).json({
                message: "Purchase order Id must be a positive integer."
            });
            return;
        }

        // Validate quantities
        if (!validateQuantities(received, damaged)) {
            response.status(400).json({
                message: "Received and damaged quantities " +
                    "must be non-negative integers, " +
                    "and damaged cannot exceed received."
            });
            return;
        }
        
        // Run business logic
        const result = await processReceipt(
            lineId, 
            received, 
            damaged
        );

        // Return error if result is undefined
        if (result === undefined) {
            response.status(404).json({
                message: "Purchase order line not found."
            });
            return;
        }

        response.status(200).json(result);

    } catch (error) {
        console.error("Error posting receipt: ", error);

        response.status(500).json({
            message: "An internal server error occurred."
        });
    }
}

// Export
export default purchaseOrderRouter;