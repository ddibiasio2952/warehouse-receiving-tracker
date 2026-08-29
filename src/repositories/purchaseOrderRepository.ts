import sql = require("mssql/msnodesqlv8");

import { getPool } from "../config/database";
import { PurchaseOrderLine } from "../types/types";

import {
    PurchaseOrderSummary
} from "../types/types";

import {
    getLineReports 
} from "../services/purchaseOrderService";

// Update receipt quantities
export async function updateReceiptQuantities(
    lineId: number,
    received: number,
    damaged: number
): Promise<PurchaseOrderLine | undefined> {
    const pool = await getPool();

    const result = await pool
        .request()
        .input("lineId", sql.Int, lineId)
        .input("received", sql.Int, received)
        .input("damaged", sql.Int, damaged)
        .query<PurchaseOrderLine>(`
            UPDATE PurchaseOrderLines
            SET
                ReceivedQuantity = @received,
                DamagedQuantity = @damaged
            OUTPUT
                INSERTED.Id AS id,
                INSERTED.PurchaseOrderId AS purchaseOrderId,
                INSERTED.SkuId AS skuId,
                INSERTED.ExpectedQuantity AS expectedQuantity,
                INSERTED.ReceivedQuantity AS receivedQuantity,
                INSERTED.DamagedQuantity AS damagedQuantity
            WHERE Id = @lineId;
        `);

        return result.recordset[0];
}

// Retrieve every line belonging to one purchase order
export async function getPurchaseOrderLinesByOrderId(
    purchaseOrderId: number
): Promise<PurchaseOrderLine[]> {
    const pool = await getPool();

    const result = await pool
        .request()
        .input(
            "purchaseOrderId",
            sql.Int,
            purchaseOrderId
        )
        .query<PurchaseOrderLine>(`
            SELECT
                Id AS id,
                PurchaseOrderId AS purchaseOrderId,
                SkuId AS skuId,
                ExpectedQuantity AS expectedQuantity,
                ReceivedQuantity AS receivedQuantity,
                DamagedQuantity AS damagedQuantity
            FROM PurchaseOrderLines
            WHERE PurchaseOrderId = @purchaseOrderId
            ORDER BY Id;
        `);

    // Return with all numerical values set as number types
    return result.recordset.map(line => ({
        id: Number(line.id),
        purchaseOrderId: Number(line.purchaseOrderId),
        skuId: Number(line.skuId),
        expectedQuantity: Number(line.expectedQuantity),
        receivedQuantity: Number(line.receivedQuantity),
        damagedQuantity: Number(line.damagedQuantity)
    }));
}

// Retrieve a single purchase order line
/*export async function getOrderLinesByOrderId(
    purchaseOrderId: number
): Promise<PurchaseOrderLine | undefined> {
    const pool = await getPool();

    const result = await pool
        .request()
        .input(
            "purchaseOrderId",
            sql.Int,
            purchaseOrderId
        )
        .query<PurchaseOrderLine>(`
            SELECT
                Id AS id,
                PurchaseOrderId AS purchaseOrderId,
                SkuId AS skuId,
                ExpectedQuantity AS expectedQuantity,
                ReceivedQuantity AS receivedQuantity,
                DamagedQuantity AS damagedQuantity
            FROM PurchaseOrderLines
            WHERE PurchaseOrderId = @purchaseOrderId
            ORDER BY Id;
        `);

    // Return with all numerical values set as number types
    return result.recordset.map(line => ({
        id: Number(line.id),
        purchaseOrderId: Number(line.purchaseOrderId),
        skuId: Number(line.skuId),
        expectedQuantity: Number(line.expectedQuantity),
        receivedQuantity: Number(line.receivedQuantity),
        damagedQuantity: Number(line.damagedQuantity)
    }));
}*/

// Retrieve all purchase order lines
export async function getAllPurchaseOrderLines():
    Promise<PurchaseOrderLine[]> {
    const pool = await getPool();

    const result = await pool
        .request()
        .query<PurchaseOrderLine>(`
            SELECT
                Id AS id,
                PurchaseOrderId AS purchaseOrderId,
                SkuId AS skuId,
                ExpectedQuantity AS expectedQuantity,
                ReceivedQuantity AS receivedQuantity,
                DamagedQuantity AS damagedQuantity
            FROM PurchaseOrderLines
            ORDER BY Id;
        `);

    // Return with all numerical values set as number types
    return result.recordset.map(line => ({
        id: Number(line.id),
        purchaseOrderId: Number(line.purchaseOrderId),
        skuId: Number(line.skuId),
        expectedQuantity: Number(line.expectedQuantity),
        receivedQuantity: Number(line.receivedQuantity),
        damagedQuantity: Number(line.damagedQuantity)
    }));
}

// Verify that purchase order exists in the database
export async function purchaseOrderExists(
    purchaseOrderId: number
): Promise<boolean> {
    const pool = await getPool();

    const result = await pool
        .request()
        .input("purchaseOrderId", sql.Int, purchaseOrderId)
        .query<{ recordExists: number }>(`
            SELECT
                CASE
                    WHEN EXISTS (
                        SELECT 1
                        FROM PurchaseOrders
                        WHERE Id = @purchaseOrderId
                    )
                    THEN 1
                    ELSE 0
                END AS recordExists;
        `);

    return Number(result.recordset[0]?.recordExists) === 1;
}