import { closePool } from "../config/database";

import {
    getPurchaseOrderLinesByOrderId
} from "../repositories/purchaseOrderRepository";

async function testPurchaseOrderRepository(): Promise<void> {
    try {
        // Retrieve the lines belonging to purchase order 1
        const lines = await getPurchaseOrderLinesByOrderId(1);

        console.log("Purchase order lines retrieved successfully:");
        console.table(lines);
    } catch (error) {
        console.error(
            "Failed to retrieve purchase order lines:",
            error
        );

        process.exitCode = 1;
    } finally {
        // Close the pool so the test process can exit
        await closePool ();
    }
}

testPurchaseOrderRepository();