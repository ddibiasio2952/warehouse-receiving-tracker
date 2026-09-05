import { useState } from "react";

import {
    Link,
    useNavigate,
    useParams
} from "react-router-dom";

import type {
    PurchaseOrderLineRequestBody
} from "../../../../src/types/types";

import OrderLineForm from
    "./components/OrderLineForm";

import { usePurchaseOrders } from
    "./hooks/usePurchaseOrders";

import { useSkusBySupplier } from
    "../skus/hooks/useSkusBySupplier";

import { addPurchaseOrderLine } from
    "./services/purchaseOrderApi";


function AddPurchaseOrderLinePage() {
    const navigate = useNavigate();

    // Get the purchase order ID from the URL
    const { purchaseOrderId } = useParams<{
        purchaseOrderId: string;
    }>();

    const orderId = Number(purchaseOrderId);

    // Load purchase orders
    const {
        purchaseOrders,
        errorMessage: purchaseOrderErrorMessage,
        isLoading: arePurchaseOrdersLoading
    } = usePurchaseOrders();

    // Find the purchase order from the URL ID
    const purchaseOrder = purchaseOrders.find(
        (order) => order.id === orderId
    );

    // Load SKUs belonging to the order's supplier
    const {
        skusBySupplier,
        errorMessage: skusBySupplierError,
        isLoading: skusBySupplierLoading
    } = useSkusBySupplier(
        purchaseOrder?.supplierId ?? null
    );

    // Store an error from adding the line
    const [
        addLineErrorMessage,
        setAddLineErrorMessage
    ] = useState<string | null>(null);

    // Track whether the line is being added
    const [
        isAddingLine,
        setIsAddingLine
    ] = useState<boolean>(false);

    // Validate the URL parameter
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

    // Display an invalid ID error
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

            <h1>Add Purchase Order Line</h1>

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

            {/* SKU loading condition */}
            {purchaseOrder &&
                skusBySupplierLoading && (
                    <p>Loading SKUs...</p>
                )}

            {/* SKU error condition */}
            {skusBySupplierError && (
                <p className="error-message">
                    {skusBySupplierError}
                </p>
            )}

            {/* No available SKUs condition */}
            {purchaseOrder &&
                !skusBySupplierLoading &&
                !skusBySupplierError &&
                skusBySupplier.length === 0 && (
                    <p className="error-message">
                        No SKUs are available for this
                        supplier.
                    </p>
                )}

            {/* Add line error condition */}
            {addLineErrorMessage && (
                <p className="error-message">
                    {addLineErrorMessage}
                </p>
            )}

            {/* Add line loading condition */}
            {isAddingLine && (
                <p>Adding purchase order line...</p>
            )}

            {/* Add purchase order line form */}
            {!arePurchaseOrdersLoading &&
                !purchaseOrderErrorMessage &&
                purchaseOrder &&
                !skusBySupplierLoading &&
                !skusBySupplierError &&
                skusBySupplier.length > 0 && (
                    <OrderLineForm
                        orderId={orderId}
                        skusBySupplier={skusBySupplier}
                        onSubmit={handleAddLine}
                    />
                )}
        </main>
    );
}

export default AddPurchaseOrderLinePage;