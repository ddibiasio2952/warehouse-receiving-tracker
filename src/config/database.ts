// Import variables from .env
import "dotenv/config";

// Import SQL driver
import sql = require("mssql/msnodesqlv8");

// Read connections
const server = process.env.DB_SERVER;
const database = process.env.DB_NAME;

// Validate configuration
if (!server || !database) {
    throw new Error(
        "DB_SERVER and DB_NAME must be defined in .env file."
    );
}

// Configure connection
const databaseConfig: sql.config = {
    server,
    database,
    driver: "ODBC Driver 18 for SQL Server",
    options: {
        trustedConnection: true,
        trustServerCertificate: true
    }
};

let connectionPool: sql.ConnectionPool | undefined;

// Create reusable connection pool
export async function getPool(): Promise<sql.ConnectionPool> {
    if (!connectionPool) {
        connectionPool = await new sql.ConnectionPool(databaseConfig).connect();
    }

    return connectionPool;
}

// Close the database pool
export async function closePool(): Promise<void> {
    if (connectionPool) {
        await connectionPool.close();
        connectionPool = undefined;
    }
}