// Import Express's Router function and request / response types
import {
    Router,
    type Request,
    type Response
} from "express";

// Import validation functions
import {
    isPositiveInteger,
    validateQuantities,
    validateDate
} from "../utilities/validation";

// Import types
import {
    PurchaseOrderBody,
    PurchaseOrderLineBody,
    PurchaseOrderLineRequestBody,
    ReceiptRequestBody
} from "../types/types";

// Import business logic
import {
    summarizePurchaseOrder,
    processReceipt,
    getPurchaseOrdersToReview,
    getLineReports
} from "../services/purchaseOrderService";

// Import repository operations
import {
    getPurchaseOrders,
    purchaseOrderExists,
    getAllPurchaseOrderLines,
    getPurchaseOrderLine,
    addPurchaseOrder,
    addPurchaseOrderLine,
    closePurchaseOrder
} from "../repositories/purchaseOrderRepository";

import {
    supplierExists
} from "../repositories/supplierRepository";

// Create a router for purchase order endpoints
const purchaseOrderRouter: Router = Router();

// Get all purchase orders
export async function getAllPurchaseOrders(
    request: Request,
    response: Response
): Promise<void> {
    try {
        // Get all purchase orders from repository
        const result = await getPurchaseOrders();

        response.status(200).json(result);

    } catch (error) {
        console.error("Error retrieving all purchase orders: ", error);

        response.status(500).json({
            message: "An internal server error occurred."
        });
    }
}

// Get a purchase order summary
export async function getPurchaseOrderSummary(
    request: Request<{ id: string }>,
    response: Response
): Promise<void> {
    // Convert route param from string to number
    const purchaseOrderId: number = Number(request.params.id);

    // Verify purchase order exists
    const exists = await purchaseOrderExists(purchaseOrderId);
    if (!exists) {
        response.status(404).json({
            message: "Purchase order not found."
        });
        return;
    }

    try {
        // Generate and return purchase order summary
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

// Get all purchase orders for review
export async function getPurchaseOrdersForReview(
    request: Request,
    response: Response
): Promise<void> {
    try {
        // Get all purchase order lines from repository
        const lines = await getAllPurchaseOrderLines();

        // Run business logic on lines
        const result = await getPurchaseOrdersToReview(lines);

        // Return error if result is undefined
        if (result === undefined) {
            response.status(404).json({
                message: "Purchase order lines not found."
            });
            return;
        }

        response.status(200).json(result);

    } catch (error) {
        console.error("Error retrieving purchase orders for review: ", error);

        response.status(500).json({
            message: "An internal server error occurred."
        });
    }
}

// Get all line reports for a purchase order
export async function getLineReportsByPurchaseOrderId(
    request: Request<{ id: string }>,
    response: Response
): Promise<void> {
    // Convert route param from string to number
    const orderId: number = Number(request.params.id);

    // Validate ID
    if (!isPositiveInteger(orderId)) {
        response.status(400).json({
            message: "Purchase order ID must be a positive integer."
        });
        return;
    }

    try {
        // Verify purchase order exists
        const exists = await purchaseOrderExists(orderId);

        if (!exists) {
            response.status(404).json({
                message: "Purchase order not found."
            });
            return
        }

        const result = await getLineReports(orderId);

        response.status(200).json(result);
    } catch (error) {
        console.error("Error retrieving purchase order line report: ", error);

        response.status(500).json({
            message: "An internal server error occurred."
        });
    }
}

// Get purchase order line by line ID
export async function getLineByLineId(
    request: Request<{ id: string }>,
    response: Response
): Promise<void> {
    // Convert route param from string to number
    const lineId: number = Number(request.params.id);

    // Validate ID
    if (!isPositiveInteger(lineId)) {
        response.status(400).json({
            message: "Line ID must be a positive integer."
        });

        return;
    }

    try {
        const result = await getPurchaseOrderLine(lineId);

        // Return error if result is undefined
        if (result === undefined) {
            response.status(404).json({
                message: "Purchase order line not found."
            });

            return;
        }

        response.status(200).json(result);
    } catch (error) {
        console.error("Error retrieving purchase order line: ", error);

        response.status(500).json({
            message: "An internal server error occurred."
        });
    }
}

// Post a new purchase order
export async function postOrder(
    request: Request<
        Record<string, never>,
        unknown,
        PurchaseOrderBody
    >,
    response: Response
): Promise<void> {
    // Retrieve body values
    const { supplierId, expectedDate } = request.body ?? {};

    // Validate Supplier ID
        if (!isPositiveInteger(supplierId)) {
            response.status(400).json({
                message: "Supplier ID must be a positive integer."
            });
    
            return;
        }
    
        // Verify supplier exists
        const exists = await supplierExists(supplierId);
        if (!exists) {
            response.status(404).json({
                message: "Supplier not found."
            });

            return;
        }

    // Verify expected date is a string and not empty
    if (
        typeof expectedDate !== "string" ||
        expectedDate.trim() === ""
    ) {
        response.status(400).json({
            message: "Data must be a string and not empty."
        });

        return;
    }

    const cleanedDate = expectedDate.trim();

    // Validate expectedDate is in the future
    if (!validateDate(cleanedDate)) {
        response.status(400).json({
            message: "The expected date must be in the future."
        });

        return;
    }

    const cleanedData: PurchaseOrderBody = {
        supplierId: supplierId,
        status: "open",
        expectedDate: cleanedDate
    }

    try {
        const result = await addPurchaseOrder(cleanedData);

        if (result === undefined) {
            response.status(500).json({
                message: "The purchase order could not be created."
            });

            return;
        }

        response.status(201).json(result);
    } catch (error) {
        console.error("Error posting purchase order: ", error);

        response.status(500).json({
            message: "An internal server error occurred."
        });
    }
}

// Post a purchase order line to a purchase order
export async function postOrderLine(
    request: Request<
        { id: string },
        unknown,
        PurchaseOrderLineRequestBody
    >,
    response: Response
): Promise<void> {
    // Convert route param from string to number
    const orderId = Number(request.params.id);

    // Retrieve body values
    const { skuId, expectedQuantity } = request.body ?? {};

    // Validate all numerical values are positive
    if (
        !isPositiveInteger(orderId) ||
        !isPositiveInteger(skuId) ||
        !isPositiveInteger(expectedQuantity)
    ) {
        response.status(400).json({
            message: "Numerical values must be positive integers."
        });

        return;
    }

    const cleanedData: PurchaseOrderLineBody = {
        purchaseOrderId: orderId,
        skuId: skuId,
        expectedQuantity: expectedQuantity
    };

    try {
        const result = await addPurchaseOrderLine(cleanedData);

        // Return error if result is undefined
        if (result === undefined) {
            response.status(404).json({
                message: "Purchase order or SKU not found."
            });

            return;
        }

        response.status(201).json(result);

    } catch (error) {
        console.error("Error posting purchase order line: ", error);

        response.status(500).json({
            message: "An internal server error occurred."
        });
    }
}

// Put a purchase order line receipt
export async function putLineReceipt(
    request: Request<
        { id: string },
        unknown,
        ReceiptRequestBody
    >,
    response: Response
): Promise<void> {
    // Convert route param from string to number
    const lineId = Number(request.params.id);

    // Retrieve body values
    const { received, damaged } = request.body ?? {};

    // Validate IDs
    if (!isPositiveInteger(lineId)) {
        response.status(400).json({
            message: "Purchase order line ID must be a positive integer."
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

    const cleanedData: ReceiptRequestBody = {
        received: received,
        damaged: damaged
    }
    try {
        // Run business logic
        const result = await processReceipt(
            lineId,
            cleanedData
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
        console.error("Error updating receipt: ", error);

        response.status(500).json({
            message: "An internal server error occurred."
        });
    }
}

// Patch a purchase order status as "closed"
export async function closePurchaseOrderStatus(
    request: Request <{ id: string }>,
    response: Response
): Promise<void> {
    // Convert route param from string to number
    const orderId = Number(request.params.id);

    // Validate ID
    if (!isPositiveInteger(orderId)) {
        response.status(400).json({
            message: "Order ID must be a positive integer."
        });

        return
    }

    try {
        const result = await closePurchaseOrder(orderId);

        // Return error if result is undefiend
        if (result === undefined) {
            response.status(404).json({
                message: "Purchase order line not found."
            });

            return;
        }

        response.status(200).json(result);

    } catch (error) {
        console.error("Error updating purchase order status: ", error);

        response.status(500).json({
            message: "An internal server error occurred."
        });
    }
}

// Export
export default purchaseOrderRouter;