import { useState } from "react";

import {
    Link,
    useNavigate,
    useParams
} from "react-router";

import type {
    PurchaseOrderLineRequestBody
} from "../../../../src/types/types";

import OrderLineForm from
    "./components/OrderLineForm";

import { addPurchaseOrderLine } from
    "./services/purchaseOrderApi";


function AddPurchaseOrderLinePage() {
    const navigate = useNavigate();

    const { purchaseOrderId } = useParams<{
        purchaseOrderId: string;
    }>();

    const orderId = Number(purchaseOrderId);

    const [
        addLineErrorMessage,
        setAddLineErrorMessage
    ] = useState<string | null>(null);

    const [
        isAddingLine,
        setIsAddingLine
    ] = useState<boolean>(false);

    const isValidOrderId =
        Number.isInteger(orderId) && orderId > 0;

    async function handleAddLine(
        submittedOrderId: number,
        lineBody: PurchaseOrderLineRequestBody
    ): Promise<void> {
        try {
            setIsAddingLine(true);
            setAddLineErrorMessage(null);

            await addPurchaseOrderLine(
                submittedOrderId,
                lineBody
            );

            // Return to the purchase order details
            navigate(
                `/purchase-orders/${submittedOrderId}`
            );
        } catch (error) {
            console.error(
                "Error adding purchase order line:",
                error
            );

            setAddLineErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Unable to add the purchase order line."
            );
        } finally {
            setIsAddingLine(false);
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

            <h1>Add Purchase Order Line</h1>

            {addLineErrorMessage && (
                <p className="error-message">
                    {addLineErrorMessage}
                </p>
            )}

            {isAddingLine && (
                <p>Adding purchase order line...</p>
            )}

            <OrderLineForm
                orderId={orderId}
                onSubmit={handleAddLine}
            />
        </main>
    );
}

export default AddPurchaseOrderLinePage;