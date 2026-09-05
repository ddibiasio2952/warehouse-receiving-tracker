import { useState } from "react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import type {
    SkuRequestBody
} from "../../../../src/types/types";

import AddSkuForm from
    "./components/AddSkuForm";

import { useSuppliers } from
    "../suppliers/hooks/useSuppliers";

import { addSku } from
    "./services/skuApi";

function AddSkuPage() {
    const navigate = useNavigate();

    // Load suppliers
    const {
        suppliers,
        errorMessage: suppliersError,
        isLoading: suppliersLoading
    } = useSuppliers();

    // Store an error from adding the SKU
    const [
        addSkuErrorMessage,
        setAddSkuErrorMessage
    ] = useState<string | null>(null);

    // Track whether the SKU is being added
    const [
        isAddingSku,
        setIsAddingSku
    ] = useState<boolean>(false);

    async function handleAddSku(
        skuData: SkuRequestBody
    ): Promise<void> {
        try {
            setIsAddingSku(true);
            setAddSkuErrorMessage(null);

            await addSku(skuData);

            // Return to the SKUs page
            navigate("/skus/all");
        } catch (error) {
            console.error(
                "Error adding SKU: ",
                error
            );

            setAddSkuErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Unable to add SKU."
            );
        } finally {
            setIsAddingSku(false);
        }
    }

    return (

        <main className="page-container">
            <Link
                className="back-link"
                to="/skus"
            >
                Back to SKUs
            </Link>

            <h1>Add SKU</h1>
            {/* Supplier loading condition */}
            {suppliersLoading && (
                <p>Loading suppliers...</p>
            )}

            {/* Supplier error condition */}
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

            {/* Add SKU error condition */}
            {addSkuErrorMessage && (
                <p className="error-message">
                    {addSkuErrorMessage}
                </p>
            )}

            {/* Add SKU loading condition */}
            {isAddingSku && (
                <p>Adding SKU...</p>
            )}

            {/* Add SKU form */}
            {(
                <AddSkuForm
                    suppliers={suppliers}
                    onSubmit={handleAddSku}
                />
            )}
        </main>
    );
}

export default AddSkuPage;