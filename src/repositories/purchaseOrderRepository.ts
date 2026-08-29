// Import SQL driver
import sql = require("mssql/msnodesqlv8");

// Import Pool
import { getPool } from "../config/database";

// Import interface types
import { 
    PurchaseOrder,
    PurchaseOrderLine 
} from "../types/types";

import {
    getLineReports 
} from "../services/purchaseOrderService";

// Retrieve every purchase order
export async function getPurchaseOrders():
    Promise<PurchaseOrder[]> {
    const pool = await getPool();

    const result = await pool
        .request()
        .query<PurchaseOrder>(`
            SELECT
                Id AS id,
                Supplier AS supplier,
                Status AS status,
                CONVERT(
                    VARCHAR(10),
                    ExpectedDate,
                    23
                ) AS expectedDate
            FROM PurchaseOrders
            ORDER BY Id;
        `);

    return result.recordset.map(order => ({
        id: Number(order.id),
        supplier: order.supplier,
        status: order.status,
        expectedDate: order.expectedDate
    }));
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
                DamagedQuantity AS damagedQuantity,
                ReceiptRecorded AS receiptRecorded
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
        damagedQuantity: Number(line.damagedQuantity),
        receiptRecorded: Boolean(line.receiptRecorded)
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
                DamagedQuantity AS damagedQuantity,
                ReceiptRecorded AS receiptRecorded
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
        receiptRecorded: Boolean(line.receiptRecorded)
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
                DamagedQuantity AS damagedQuantity,
                ReceiptRecorded AS receiptRecorded
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
        damagedQuantity: Number(line.damagedQuantity),
        receiptRecorded: Boolean(line.receiptRecorded)
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
                DamagedQuantity = @damaged,
                ReceiptRecorded = 1
            OUTPUT
                INSERTED.Id AS id,
                INSERTED.PurchaseOrderId AS purchaseOrderId,
                INSERTED.SkuId AS skuId,
                INSERTED.ExpectedQuantity AS expectedQuantity,
                INSERTED.ReceivedQuantity AS receivedQuantity,
                INSERTED.DamagedQuantity AS damagedQuantity
                INSERTED.ReceiptRecorded AS receiptRecorded
            WHERE Id = @lineId;
        `);

        return result.recordset[0];
}