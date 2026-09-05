// Import Express's Router function and request / response types
import {
    Router,
    type Request,
    type Response
} from "express";

// Import types
import {
    Supplier,
} from "../types/types";

import {
    getSuppliers
} from "../repositories/supplierRepository";

// Create a router for supplier endpoints
const supplierRouter: Router = Router();

// Get all suppliers
export async function getAllSuppliers(
        request: Request,
        response: Response
): Promise<void> {
    try {
        // Get all suppliers from repository
        const result = await getSuppliers();

        response.status(200).json(result);
    } catch (error) {
        console.error("Error retrieving all suppliers: ", error);

        response.status(500).json({
            message: "An internal server error has occurred."
        });
    }
}

// Export
export default supplierRouter;