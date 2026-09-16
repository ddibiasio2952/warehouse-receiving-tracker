import { getPool } from "../config/database";

async function testDatabaseConnection(): Promise<void> {
    try {
        const pool = await getPool();

        const result = await pool.request().query(`
            SELECT DB_NAME() AS databaseName
            `);

        console.log("Database connection successful.");
        console.table(result.recordset);
    } catch (error) {
        console.error("Database connection failed: ", error);
        process.exitCode = 1;
    }
}

testDatabaseConnection();