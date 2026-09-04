// Import Express's Router function and request / response types
import { Router } from "express";

// Import Controllers
import {
    getAllSkus,
    getSkuById,
    getSkusBySupplier,
    postSku,
    putSku
} from "../controllers/skuController";

// Create a router for SKU endpoints
const skuRouter: Router = Router();

// GET /api/skus
// Get all SKUs
skuRouter.get(
    "/",
    getAllSkus
);

// GET /api/skus/:id
// Get a SKU by ID
skuRouter.get(
    "/:id",
    getSkuById
);

// GET /api/skus/supplier/:id
// Get a SKU by supplier ID
skuRouter.get(
    "/supplier/:id",
    getSkusBySupplier
);

// POST /api/skus/new
// Post a new SKU
skuRouter.post(
    "/new",
    postSku
);

// PUT /api/skus/:id
// Update a SKU
skuRouter.put(
    "/:id",
    putSku
)

// Export
export default skuRouter;