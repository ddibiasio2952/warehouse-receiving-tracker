import { useState } from "react";

import {
    Link,
    useNavigate,
    useParams
} from "react-router";

import CloseOrderForm from
    "./components/CloseOrderForm";

import { closePurchaseOrder } from
    "./services/purchaseOrderApi";


function ClosePurchaseOrderPage() {
    const navigate = useNavigate();

    const { purchaseOrderId } = useParams<{
        purchaseOrderId: string;
    }>();

    const orderId = Number(purchaseOrderId);

    const [
        closeErrorMessage,
        setCloseErrorMessage
    ] = useState<string | null>(null);

    const [
        isClosing,
        setIsClosing
    ] = useState<boolean>(false);

    const isValidOrderId =
        Number.isInteger(orderId) && orderId > 0;

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
            navigate("/purchase-orders");
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
            <main className="app-container">
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
        <main className="app-container">
            <Link
                to={`/purchase-orders/${orderId}`}
            >
                ← Back to Purchase Order
            </Link>

            <h1>Close Purchase Order</h1>

            {closeErrorMessage && (
                <p className="error-message">
                    {closeErrorMessage}
                </p>
            )}

            {isClosing && (
                <p>Closing purchase order...</p>
            )}

            <CloseOrderForm
                orderId={orderId}
                onSubmit={handleCloseOrder}
                onCancel={() =>
                    navigate(
                        `/purchase-orders/${orderId}`
                    )
                }
            />
        </main>
    );
}

export default ClosePurchaseOrderPage;