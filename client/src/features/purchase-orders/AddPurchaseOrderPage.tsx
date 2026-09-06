import { useState } from "react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import type {
    PurchaseOrderBody
} from "../../../../src/types/types";

import AddPurchaseOrderForm from
    "./components/AddPurchaseOrderForm";

import { useSuppliers } from
    "../suppliers/hooks/useSuppliers";

import { addPurchaseOrder } from
    "./services/purchaseOrderApi";

function AddPurchaseOrderPage() {
    const navigate = useNavigate();

    // Load suppliers
    const {
        suppliers,
        errorMessage: suppliersError,
        isLoading: suppliersLoading
    } = useSuppliers();

    // Store an error from adding the purchase order
    const [
        addPurchaseOrderError,
        setPurchaseOrderError
    ] = useState<string | null>(null);

    // Track whether the purchase order is being added
    const [
        isAddingPurchaseOrder,
        setAddingPurchaseOrder
    ] = useState<boolean>(false);

    async function handleAddPurchaseOrder(
        orderData: PurchaseOrderBody
    ): Promise<void> {
        try {
            setAddingPurchaseOrder(true);
            setPurchaseOrderError(null);

            await addPurchaseOrder(orderData);

            // Return to the purchase orders page
            navigate("/purchase-orders/all")
        } catch (error) {
            console.error(
                "Error adding purchase order: ",
                error
            );

            setPurchaseOrderError(
                error instanceof Error
                    ? error.message
                    : "Unable to add purchase order."
            );
        } finally {
            setAddingPurchaseOrder(false);
        }
    }

    return (

        <main className="page-container">
            <Link
                className="back-link"
                to="/purchase-orders"
            >
                Back to Purchase Orders
            </Link>

            <h1>Add Purchase Order</h1>
            {/* Supplier loading condition */}
            {suppliersLoading && (
                <p>Loading suppliers...</p>
            )}

            {/* Suppliers error condition */}
            {suppliersError && (
                <p className="error-message">
                    {suppliersError}
                </p>
            )}

            {/* No available suppliers condition */}
            {!suppliersLoading &&
                !suppliersError &&
                suppliers.length === 0 && (
                    <p className="error-message">
                        No suppliers are available.
                    </p>
                )}

            {/* Add purchase order error condition */}
            {addPurchaseOrderError && (
                <p className="error-message">
                    {addPurchaseOrderError}
                </p>
            )}

            {/* Add purchase order loading condition */}
            {isAddingPurchaseOrder && (
                <p>Adding purchase order...</p>
            )}

            {/* Add purchase order form */}
            {(
                <AddPurchaseOrderForm
                    suppliers={suppliers}
                    onSubmit={handleAddPurchaseOrder}
                />
            )}
        </main>
    );
}

export default AddPurchaseOrderPage;