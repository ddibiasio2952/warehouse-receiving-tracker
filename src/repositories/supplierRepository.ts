// Import SQL driver
import sql = require("mssql/msnodesqlv8");

// Import Pool
import { getPool } from "../config/database";

// Import interface types
import {
    Supplier
} from "../types/types"

// Retrieve every supplier
export async function getSuppliers():
    Promise<Supplier[]> {
        const pool = await getPool();

        const result = await pool
            .request()
            .query<Supplier>(`
                SELECT
                    Id AS id,
                    Name AS name
                FROM Suppliers
                ORDER BY name ASC;
            `);

            return result.recordset.map(supplier => ({
                id: Number(supplier.id),
                name: supplier.name
            }));
    }

// Verify that a supplier exists in the database
export async function supplierExists(
    supplierId: number
): Promise<boolean> {
    const pool = await getPool();

    const result = await pool
        .request()
        .input("supplierId", sql.Int, supplierId)
        .query<{ recordExists: number }> (`
            SELECT
                CASE
                    WHEN EXISTS (
                        SELECT 1
                        FROM Suppliers
                        WHERE Id = @supplierId
                    )
                    THEN 1
                    ELSE 0
                END AS recordExists;
        `);

    return Number(result.recordset[0]?.recordExists) === 1;
}