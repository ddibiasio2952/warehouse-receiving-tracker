// Import SQL driver
import sql = require("mssql/msnodesqlv8");

// Import Pool
import { getPool } from "../config/database";

// Import interface types
import {
    Sku,
    SkuRequestBody,
    SkuRetrieveBody
} from "../types/types"

// Retrieve every SKU
export async function getSkus():
    Promise<SkuRetrieveBody[]> {
    const pool = await getPool();

    const result = await pool
        .request()
        .query<SkuRetrieveBody>(`
            SELECT
                Skus.Id AS id,
                Skus.SkuNumber AS skuNumber,
                Skus.Description AS description,
                Skus.SupplierId as supplierId,           
                Suppliers.Name AS supplierName
            FROM Skus
            INNER JOIN Suppliers
                On Skus.SupplierId = Suppliers.Id
            ORDER BY SkuNumber ASC; 
        `);

    return result.recordset.map(sku => ({
        id: Number(sku.id),
        skuNumber: sku.skuNumber,
        description: sku.description,
        supplierId: sku.supplierId,
        supplierName: sku.supplierName
    }));
}

// Retrieve a SKU by ID
export async function getSku(skuId: number):
    Promise<Sku | undefined> {
    const pool = await getPool();

    const result = await pool
        .request()
        .input("skuId", sql.Int, skuId)
        .query<Sku>(`
            SELECT
                Id AS id,
                SkuNumber AS skuNumber,
                Description AS description,
                SupplierId AS supplierId
            FROM Skus
            WHERE Id = @skuId
        `);

    const sku = result.recordset[0];

    if (sku === undefined) {
        return undefined;
    }

    return {
        id: Number(sku.id),
        skuNumber: sku.skuNumber,
        description: sku.description,
        supplierId: sku.supplierId
    };
}

// Retrieve a SKU by Supplier
export async function getSkusBySupplierId(supplierId: number):
    Promise<Sku[]> {
    const pool = await getPool();

    const result = await pool
        .request()
        .input("supplierId", sql.Int, supplierId)
        .query<Sku>(`
            SELECT
                Id AS id,
                SkuNumber AS skuNumber,
                Description AS description,
                SupplierId AS supplierId
            FROM Skus
            WHERE SupplierId = @supplierId
            ORDER BY SkuNumber;   
        `);

    const skus = result.recordset;

    return skus.map(sku => ({
        id: Number(sku.id),
        skuNumber: sku.skuNumber,
        description: sku.description,
        supplierId: sku.supplierId
    }));
}

// Add a SKU
export async function addSku(
    data: SkuRequestBody
): Promise<Sku | undefined> {
    const pool = await getPool();

    const result = await pool
        .request()
        .input("skuNumber", sql.NVarChar(7), data.skuNumber)
        .input("description", sql.NVarChar(255), data.description)
        .input("supplierId", sql.Int, data.supplierId)
        .query<Sku>(`
            INSERT INTO Skus
                (SkuNumber, Description, SupplierId)
            OUTPUT
                INSERTED.Id AS id,
                INSERTED.SkuNumber AS skuNumber,
                INSERTED.Description AS description,
                INSERTED.SupplierId AS supplierId
            VALUES (
                @skuNumber,
                @description,
                @supplierId
            );
        `);

    const newSku = result.recordset[0];

    if (newSku === undefined) {
        return undefined;
    }

    return {
        id: Number(newSku.id),
        skuNumber: newSku.skuNumber,
        description: newSku.description,
        supplierId: Number(newSku.supplierId)
    };
}

// Update SKU
export async function updateSku(
    data: Sku
): Promise<Sku | undefined> {
    const pool = await getPool();

    const result = await pool
        .request()
        .input("skuId", sql.Int, data.id)
        .input("skuNumber", sql.NVarChar(7), data.skuNumber)
        .input("description", sql.NVarChar(255), data.description)
        .input("supplierId", sql.Int, data.supplierId)
        .query<Sku>(`
            UPDATE Skus
            SET
                SkuNumber = @skuNumber,
                Description = @description,
                SupplierId = @supplierId
            OUTPUT
                INSERTED.Id AS id,
                INSERTED.SkuNumber AS skuNumber,
                INSERTED.Description AS description,
                INSERTED.SupplierId AS supplierId
            WHERE Id = @skuId;
        `);

    return result.recordset[0];
}