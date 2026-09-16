// Import Express's Router function and request / response types
import { Router } from "express";

// Import Controllers
import {
    getAllSuppliers
} from "../controllers/supplierController";

// Create a router for supplier endpoints
const supplierRouter: Router = Router();

// GET api/suppliers
// Get all suppliers
supplierRouter.get(
    "/",
    getAllSuppliers
);

// Export
export default supplierRouter;