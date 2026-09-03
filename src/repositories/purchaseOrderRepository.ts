// Import SQL driver
import sql = require("mssql/msnodesqlv8");

// Import Pool
import { getPool } from "../config/database";

// Import interface types
import {
    PurchaseOrder,
    PurchaseOrderBody,
    PurchaseOrderDetails,
    PurchaseOrderLine,
    PurchaseOrderLineDetails,
    PurchaseOrderLineBody,
    PurchaseOrderStatus,
    ReceiptRequestBody
} from "../types/types";

// Retrieve all purchase orders
export async function getPurchaseOrders():
    Promise<PurchaseOrder[]> {
    const pool = await getPool();

    const result = await pool
        .request()
        .query<PurchaseOrderDetails>(`
            SELECT
                PurchaseOrders.Id AS id,
                PurchaseOrders.Status AS status,
                CONVERT(
                    VARCHAR(10),
                    PurchaseOrders.ExpectedDate,
                    23
                ) AS expectedDate,
                PurchaseOrders.SupplierId AS supplierId,
                Suppliers.Name AS supplierName
            FROM PurchaseOrders
            INNER JOIN Suppliers
                On PurchaseOrders.SupplierId = Suppliers.Id
            ORDER BY Id;
        `);

    return result.recordset.map(order => ({
        id: Number(order.id),
        status: order.status,
        expectedDate: order.expectedDate,
        supplierId: order.supplierId,
        supplierName: order.supplierName
    }));
}


// Retrieve every line belonging to one purchase order
export async function getPurchaseOrderLinesByOrderId(
    purchaseOrderId: number
): Promise<PurchaseOrderLineDetails[]> {
    const pool = await getPool();

    const result = await pool
        .request()
        .input(
            "purchaseOrderId",
            sql.Int,    
            purchaseOrderId
        )
        .query<PurchaseOrderLineDetails>(`
            SELECT
                PurchaseOrderLines.Id AS id,
                PurchaseOrderLines.PurchaseOrderId AS purchaseOrderId,
                PurchaseOrderLines.SkuId AS skuId,
                Suppliers.Id AS supplierId,
                Suppliers.Name AS supplierName,
                Skus.SkuNumber AS skuNumber,
                Skus.Description AS skuDescription,
                PurchaseOrderLines.ExpectedQuantity AS expectedQuantity,
                PurchaseOrderLines.ReceivedQuantity AS receivedQuantity,
                PurchaseOrderLines.DamagedQuantity AS damagedQuantity,
                PurchaseOrderLines.ReceiptRecorded AS receiptRecorded
            FROM PurchaseOrderLines
            INNER JOIN Skus
                ON PurchaseOrderLines.SkuId = Skus.Id
            INNER JOIN Suppliers
                ON Suppliers.Id = Skus.SupplierId
            WHERE PurchaseOrderLines.PurchaseOrderId = @purchaseOrderId
            ORDER BY PurchaseOrderLines.Id ASC;
        `);

    // Return with all numerical values set as number types
    return result.recordset.map(line => ({
        id: Number(line.id),
        purchaseOrderId: Number(line.purchaseOrderId),
        supplierId: Number(line.supplierId),
        supplierName: line.supplierName,
        skuId: Number(line.skuId),
        skuNumber: line.skuNumber,
        skuDescription: line.skuDescription,
        expectedQuantity: Number(line.expectedQuantity),
        receivedQuantity: Number(line.receivedQuantity),
        damagedQuantity: Number(line.damagedQuantity),
        receiptRecorded: Boolean(line.receiptRecorded)
    }));
}

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

// Retrieve a purchase order line by Id
export async function getPurchaseOrderLine(lineId: number): 
    Promise<PurchaseOrderLineDetails | undefined> {

    const pool = await getPool();
    
    const result = await pool
        .request()
        .input("lineId", sql.Int, lineId)
        .query<PurchaseOrderLineDetails>(`
            SELECT
                PurchaseOrderLines.Id AS id,
                PurchaseOrderLines.PurchaseOrderId AS purchaseOrderId,
                PurchaseOrderLines.SkuId AS skuId,
                Suppliers.Id AS supplierId,
                Suppliers.Name AS supplierName,
                Skus.SkuNumber AS skuNumber,
                Skus.Description AS skuDescription,
                PurchaseOrderLines.ExpectedQuantity AS expectedQuantity,
                PurchaseOrderLines.ReceivedQuantity AS receivedQuantity,
                PurchaseOrderLines.DamagedQuantity AS damagedQuantity,
                PurchaseOrderLines.ReceiptRecorded AS receiptRecorded
            FROM PurchaseOrderLines
            INNER JOIN Skus
                ON PurchaseOrderLines.SkuId = Skus.Id
            INNER JOIN Suppliers
                ON Suppliers.Id = Skus.SupplierId
            WHERE PurchaseOrderLines.Id = @lineId;
        `);
    
    const line = result.recordset[0];

    if (line === undefined) {
        return undefined;
    }

    return { 
        id: Number(line.id),
        purchaseOrderId: Number(line.purchaseOrderId),
        supplierId: Number(line.supplierId),
        supplierName: line.supplierName,
        skuId: Number(line.skuId),
        skuNumber: line.skuNumber,
        skuDescription: line.skuDescription,
        expectedQuantity: Number(line.expectedQuantity),
        receivedQuantity: Number(line.receivedQuantity),
        damagedQuantity: Number(line.damagedQuantity),
        receiptRecorded: Boolean(line.receiptRecorded)
    };
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

// Add a purchase order
export async function addPurchaseOrder(
    data: PurchaseOrderBody
): Promise<PurchaseOrder | undefined> {
    const pool = await getPool();

    // Destructure data
    const { supplierId, status, expectedDate } = data;

    // Convert date to Date Value
    const expectedDateValue =
        new Date(`${expectedDate}T00:00:00.000Z`);

    const result = await pool
        .request()
        .input("status", sql.NVarChar(20), status)
        .input("expectedDate", sql.Date, expectedDateValue)
        .input("supplierId", sql.Int, supplierId)
        .query<{
            id: number;
            status: PurchaseOrderStatus;
            expectedDate: Date;
            supplierId: number;
        }>(`
            INSERT INTO PurchaseOrders
                (status, expectedDate, supplierId)
            OUTPUT
                INSERTED.Id AS id,
                INSERTED.Status AS status,
                INSERTED.ExpectedDate AS expectedDate,
                INSERTED.SupplierId AS supplierId
            VALUES (
                @status,
                @expectedDate,
                @supplierId
            );
        `);

    const newOrder = result.recordset[0];

    if (newOrder === undefined) {
        return undefined;
    }

    return {
        id: Number(newOrder.id),
        status: newOrder.status,
        expectedDate:
            newOrder.expectedDate
                .toISOString()
                .slice(0, 10),
        supplierId: newOrder.supplierId
    };
}

// Add a purchase order line
export async function addPurchaseOrderLine(
    data: PurchaseOrderLineBody
): Promise<PurchaseOrderLine | undefined> {
    const pool = await getPool();

    const result = await pool
        .request()
        .input("purchaseOrderId", sql.Int, data.purchaseOrderId)
        .input("skuId", sql.Int, data.skuId)
        .input("expectedQuantity", sql.Int, data.expectedQuantity)
        .query<PurchaseOrderLine>(`
            INSERT INTO PurchaseOrderLines
                (purchaseOrderId, skuId, expectedQuantity)
            OUTPUT
                INSERTED.Id AS id,
                INSERTED.PurchaseOrderId AS purchaseOrderId,
                INSERTED.SkuId AS skuId,
                INSERTED.ExpectedQuantity AS expectedQuantity,
                INSERTED.ReceivedQuantity AS receivedQuantity,
                INSERTED.DamagedQuantity AS damagedQuantity,
                INSERTED.ReceiptRecorded AS receiptRecorded
            VALUES (
                @purchaseOrderId,
                @skuId,
                @expectedQuantity
            );
        `);

    const newOrderLine = result.recordset[0];

    if (newOrderLine === undefined) {
        return undefined;
    }

    return { 
        id: Number(newOrderLine.id),
        purchaseOrderId: Number(newOrderLine.purchaseOrderId),
        skuId: Number(newOrderLine.skuId),
        expectedQuantity: Number(newOrderLine.expectedQuantity),
        receivedQuantity: Number(newOrderLine.receivedQuantity),
        damagedQuantity: Number(newOrderLine.damagedQuantity),
        receiptRecorded: Boolean(newOrderLine.receiptRecorded)
    };
}

// Update receipt quantities
export async function updateReceiptQuantities(
    lineId: number,
    data: ReceiptRequestBody
): Promise<PurchaseOrderLineDetails | undefined> {
    const pool = await getPool();

    const result = await pool
        .request()
        .input("lineId", sql.Int, lineId)
        .input("received", sql.Int, data.received)
        .input("damaged", sql.Int, data.damaged)
        .query<PurchaseOrderLineDetails>(`
            UPDATE PurchaseOrderLines
            SET
                ReceivedQuantity = @received,
                DamagedQuantity = @damaged,
                ReceiptRecorded = 1
            WHERE Id = @lineId;

            SELECT
                PurchaseOrderLines.Id AS id,
                PurchaseOrderLines.PurchaseOrderId AS purchaseOrderId,
                PurchaseOrderLines.SkuId AS skuId,
                Suppliers.Id AS supplierId,
                Suppliers.Name AS supplierName,
                Skus.SkuNumber AS skuNumber,
                Skus.Description AS skuDescription,
                PurchaseOrderLines.ExpectedQuantity AS expectedQuantity,
                PurchaseOrderLines.ReceivedQuantity AS receivedQuantity,
                PurchaseOrderLines.DamagedQuantity AS damagedQuantity,
                PurchaseOrderLines.ReceiptRecorded AS receiptRecorded
            FROM PurchaseOrderLines
            INNER JOIN Skus
                ON PurchaseOrderLines.SkuId = Skus.Id
            INNER JOIN Suppliers
                ON Suppliers.Id = Skus.SupplierId
            WHERE PurchaseOrderLines.Id = @lineId;
        `);

    return result.recordset[0];
}

// Open a purchase order
export async function openPurchaseOrder(
    orderId: number
): Promise<PurchaseOrderDetails | undefined> {
    const pool = await getPool();

    const result = await pool
        .request()
        .input("orderId", sql.Int, orderId)
        .query<PurchaseOrderDetails>(`
            UPDATE PurchaseOrders
            SET
                status = 'open'
            WHERE Id = @orderId;

            SELECT
                PurchaseOrders.Id AS id,
                PurchaseOrders.Status AS status,
                PurchaseOrders.ExpectedDate AS expectedDate,
                PurchaseOrders.SupplierId AS supplierId,
                Suppliers.Name AS supplierName
            FROM PurchaseOrders
            INNER JOIN Suppliers
                ON PurchaseOrders.SupplierId = Suppliers.Id
            WHERE PurchaseOrders.Id = @orderId
        `)

    return result.recordset[0];
}

// Close a purchase order
export async function closePurchaseOrder(
    orderId: number
): Promise<PurchaseOrderDetails | undefined> {
    const pool = await getPool();

    const result = await pool
        .request()
        .input("orderId", sql.Int, orderId)
        .query<PurchaseOrderDetails>(`
            UPDATE PurchaseOrders
            SET
                status = 'closed'
            WHERE Id = @orderId;

            SELECT
                PurchaseOrders.Id AS id,
                PurchaseOrders.Status AS status,
                PurchaseOrders.ExpectedDate AS expectedDate,
                PurchaseOrders.SupplierId AS supplierId,
                Suppliers.Name AS supplierName
            FROM PurchaseOrders
            INNER JOIN Suppliers
                ON PurchaseOrders.SupplierId = Suppliers.Id
            WHERE PurchaseOrders.Id = @orderId
        `)

    return result.recordset[0];
}