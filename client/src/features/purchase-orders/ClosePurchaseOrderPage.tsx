import {
    useState
} from "react";

import {
    Link,
    useNavigate,
    useParams
} from "react-router-dom";

import CloseOrderForm from
    "./components/CloseOrderForm";

import { closePurchaseOrder } from
    "./services/purchaseOrderApi";

import { usePurchaseOrders } from "./hooks/usePurchaseOrders";

function ClosePurchaseOrderPage() {
    const navigate = useNavigate();

    // Get the purchase order ID from the URL
    const { purchaseOrderId } = useParams<{
        purchaseOrderId: string;
    }>();

    const orderId = Number(purchaseOrderId);

    // Validate order ID
    const isValidOrderId =
        Number.isInteger(orderId) && orderId > 0;

    const {
        purchaseOrders,
        errorMessage: purchaseOrderErrorMessage,
        isLoading: arePurchaseOrdersLoading
    } = usePurchaseOrders();

    // Find the purchase order data from the URL ID
    const purchaseOrder = purchaseOrders.find(
        (order) => order.id === orderId
    );

    // Determine whether closing is prohibited
    const isOrderClosed =
        purchaseOrder?.status === "closed";

    // Store an error from closing the purchase order
    const [
        closeErrorMessage,
        setCloseErrorMessage
    ] = useState<string | null>(null);

    // Track whether the order is closing
    const [
        isClosing,
        setIsClosing
    ] = useState<boolean>(false);

    async function handleCloseOrder(
        submittedOrderId: number
    ): Promise<void> {
        try {
            setIsClosing(true);
            setCloseErrorMessage(null);

            await closePurchaseOrder(
                submittedOrderId
            );

            // Return to the purchase order list
            navigate("/purchase-orders/all");
        } catch (error) {
            console.error(
                "Error closing purchase order:",
                error
            );

            setCloseErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Unable to close the purchase order."
            );
        } finally {
            setIsClosing(false);
        }
    }

    if (!isValidOrderId) {
        return (
            <main className="page-container">
                <h1>Invalid Purchase Order</h1>

                <p className="error-message">
                    The purchase order ID is invalid.
                </p>

                <Link to="/purchase-orders">
                    Return to Purchase Orders
                </Link>
            </main>
        );
    }

    return (
        <main className="page-container">
            <Link
                className="back-link"
                to={`/purchase-orders/${orderId}`}
            >
                Back to Purchase Order
            </Link>

            <h1>Close Purchase Order</h1>

            {/* Purchase order loading condition */}
            {arePurchaseOrdersLoading && (
                <p>Loading purchase order...</p>
            )}

            {/* Purchase order error condition */}
            {purchaseOrderErrorMessage && (
                <p className="error-message">
                    {purchaseOrderErrorMessage}
                </p>
            )}

            {/* Purchase order not found condition */}
            {!arePurchaseOrdersLoading &&
                !purchaseOrderErrorMessage &&
                !purchaseOrder && (
                    <p className="error-message">
                        Purchase order not found.
                    </p>
                )}

            {/* Closed order condition */}
            {!arePurchaseOrdersLoading &&
                purchaseOrder &&
                isOrderClosed && (
                    <p className="error-message">
                        This purchase order is closed.
                    </p>
                )}

            {/* Close order error */}
            {closeErrorMessage && (
                <p className="error-message">
                    {closeErrorMessage}
                </p>
            )}

            {/* Close loading condition */}
            {isClosing && (
                <p>Closing purchase order...</p>
            )}

            {/* Close order form */}
            {!arePurchaseOrdersLoading &&
                !purchaseOrderErrorMessage &&
                purchaseOrder &&
                !isOrderClosed && (
                    <CloseOrderForm
                        orderId={orderId}
                        onSubmit={handleCloseOrder}
                        onCancel={() =>
                            navigate(
                                `/purchase-orders/${orderId}`
                            )
                        }
                    />
                )}
        </main>
    );
}

export default ClosePurchaseOrderPage;