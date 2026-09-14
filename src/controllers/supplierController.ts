// Import Express's Router function and request / response types
import {
    Router,
    type Request,
    type Response,
    type NextFunction
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
    _request: Request,
    response: Response,
    next: NextFunction
): Promise<void> {
    try {
        // Get all suppliers from repository
        const result = await getSuppliers();

        response.status(200).json(result);
    } catch (error: unknown) {
        console.error("Error retrieving all suppliers: ", error);

        next(error);
    }
}

// Export
export default supplierRouter;