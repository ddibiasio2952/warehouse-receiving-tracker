// Import Routers
import purchaseOrderRouter from "./routes/purchaseOrderRoutes";
import skuRouter from "./routes/skuRoutes";
import supplierRouter from "./routes/supplierRoutes";

/* SERVER BOILERPLATE */
// Import Express framework
import express, {
    type Express,
    type Request,
    type Response
} from "express";

// Create the Express application
const app: Express = express();

// Set network port for server to listen from
const port: number = 3000;

// Allow server to read requests
app.use(express.json());

// Send requests to applicable routers
app.use(
    "/api/purchase-orders",
    purchaseOrderRouter
);

app.use(
    "/api/skus",
    skuRouter
);

app.use(
    "/api/suppliers",
    supplierRouter
);

// Define a GET endpoint for root URL
app.get("/", (request: Request, response: Response): void => {
    // Send a JSON response to confirm API is online
    response.json({
        message: "Receiving Discrepancy Tracker API"
    });
});

// Start HTTP server and listen for requests
app.listen(port, (): void => {
    // Callback runs after successful boot
    console.log(
        `Server running at http://localhost:${port}`
    );
});