// Import Express's Router function and request / response types
import {
    Router,
    type Request,
    type Response
} from "express";

// Import validation functions
import {
    isPositiveInteger,
    validateSkuNumber,
    validateSkuDescription
} from "../utilities/validation";

// Import types
import {
    Sku,
    SkuRequestBody
} from "../types/types";

// Import repository operations
import {
    getSkus,
    getSku,
    addSku,
    updateSku
} from "../repositories/skuRepository";

// Create a router for SKU endpoints
const skuRouter: Router = Router();

// Get all SKUs
export async function getAllSkus(
    request: Request,
    response: Response
): Promise<void> {
    try {
        // Get all SKUs from repository
        const result = await getSkus();

        response.status(200).json(result);
    } catch (error) {
        console.error("Error retrieving all SKUs: ", error);

        response.status(500).json({
            message: "An internal server error occurred."
        });
    }
}

// Get a SKU by Id
export async function getSkuById(
    request: Request<{ id: string }>,
    response: Response
): Promise<void> {
    // Convert route param from string to number
    const skuId: number = Number(request.params.id);

    // Validate Id
    if (!isPositiveInteger(skuId)) {
        response.status(400).json({
            message: "Sku Id must be a positive integer."
        });

        return;
    }

    try {
        const result = await getSku(skuId);

        // Return error if result is undefined
        if (result === undefined) {
            response.status(404).json({
                message: "Sku not found."
            });

            return;
        }

        response.status(200).json(result);
    } catch (error) {
        console.error("Error retrieving sku: ", error);

        response.status(500).json({
            message: "An internal server error occurred."
        });
    }
}

// Post a new SKU
export async function postSku(
    request: Request<
        Record<string, never>,
        unknown,
        SkuRequestBody
    >,
    response: Response
): Promise<void> {
    // Retrieve body values
    const { skuNumber, description } = request.body ?? {};

    // Verify data are strings and not empty
    if (
        typeof skuNumber !== "string" ||
        skuNumber.trim() === "" ||
        typeof description !== "string" ||
        description.trim() === ""
    ) {
        response.status(400).json({
            message: "Data must be a string and not empty."
        });

        return;
    }

    const cleanedNumber = skuNumber.trim();
    const cleanedDescription = description.trim();

    // Validate SKU number
    if (!validateSkuNumber(cleanedNumber)) {
        response.status(400).json({
            message: "SKU Number must start with four uppercase letters " +
                "and end with three numbers."
        });

        return;
    }

    // Validate description
    if (!validateSkuDescription(cleanedDescription)) {
        response.status(400).json({
            message: "SKU description may only contain letters, numbers, spaces, " +
            "and hyphens."
        });

        return;
    }

    const cleanedData: SkuRequestBody = {
        skuNumber: cleanedNumber,
        description: cleanedDescription
    }

    try {
        const result = await addSku(cleanedData);

        // Return error if result is undefined
        if (result === undefined) {
            response.status(500).json({
                message: "The SKU could not be added."
            });

            return;
        }

        response.status(201).json(result);
    } catch (error) {
        console.error("Error posting SKU: ", error);

        response.status(500).json({
            message: "An internal server error occurred."
        });
    }
}

// Update SKU
export async function putSku(
    request: Request<
    { id: string },
    unknown,
    SkuRequestBody
    >,
    response: Response
): Promise<void> {
    // Convert route param from string to number
    const skuId = Number(request.params.id);

    // Retrieve body values
    const { skuNumber, description } = request.body ?? {};

    // Validate Id
    if (!isPositiveInteger(skuId)) {
        response.status(400).json({
            message: "SKU Id must be a positive integer."
        });

        return;
    }

    // Verify data are strings and not empty
    if (
        typeof skuNumber !== "string" ||
        skuNumber.trim() === "" ||
        typeof description !== "string" ||
        description.trim() === ""
    ) {
        response.status(400).json({
            message: "Data must be a string and not empty."
        });

        return;
    }

    const cleanedNumber = skuNumber.trim();
    const cleanedDescription = description.trim();

    // Validate SKU number
    if (!validateSkuNumber(cleanedNumber)) {
        response.status(400).json({
            message: "SKU Number must start with four uppercase letters " +
                "and end with three numbers."
        });
        
        return;
    }

    // Validate description
    if (!validateSkuDescription(cleanedDescription)) {
        response.status(400).json({
            message: "SKU description may only contain letters, numbers, spaces, " +
            "and hyphens."
        });

        return;
    }

    const cleanedData: Sku = {
        id: Number(skuId),
        skuNumber: cleanedNumber,
        description: cleanedDescription
    }

    try {
        const result = await updateSku(cleanedData);

    } catch (error) {

    }
}

// Export
export default skuRouter;