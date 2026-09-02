import { useEffect, useState } from "react";

import type {
    PurchaseOrderDetails
} from "../../../../../src/types/types";

import {
    closePurchaseOrder,
    getPurchaseOrders
} from "../services/purchaseOrderApi";


export function usePurchaseOrders() {
    // Store purchase orders returned by the API
    const [purchaseOrders, setPurchaseOrders] =
        useState<PurchaseOrderDetails[]>([]);

    // Store an error from the initial purchase-order request
    const [errorMessage, setErrorMessage] =
        useState<string | null>(null);

    // Track whether purchase orders are loading
    const [isLoading, setIsLoading] =
        useState<boolean>(true);

    // Store the selected purchase order
    const [
        selectedPurchaseOrderId,
        setSelectedPurchaseOrderId
    ] = useState<number | null>(null);

    // Store the selected purchase order's supplier
    const [
        selectedSupplierName,
        setSelectedSupplierName
    ] = useState<string | null>(null);

    // Store the purchase order awaiting closure confirmation
    const [
        selectedCloseOrderId,
        setSelectedCloseOrderId
    ] = useState<number | null>(null);

    // Store an error from closing a purchase order
    const [closeErrorMessage, setCloseErrorMessage] =
        useState<string | null>(null);

    // Retrieve purchase orders when the hook first runs
    useEffect(() => {
        async function loadPurchaseOrders(): Promise<void> {
            try {
                setIsLoading(true);
                setErrorMessage(null);

                const data = await getPurchaseOrders();

                setPurchaseOrders(data);
            } catch (error) {
                console.error(
                    "Error retrieving purchase orders:",
                    error
                );

                setErrorMessage(
                    "Unable to load purchase orders."
                );
            } finally {
                setIsLoading(false);
            }
        }

        void loadPurchaseOrders();
    }, []);

    // Store the selected order's Id and supplier
    function handleSelectOrder(
        purchaseOrderId: number,
        supplierName: string
    ): void {
        setSelectedPurchaseOrderId(purchaseOrderId);
        setSelectedSupplierName(supplierName);
    }

    // Close a purchase order after confirmation
    async function handleCloseOrder(
        purchaseOrderId: number
    ): Promise<void> {
        try {
            setCloseErrorMessage(null);

            const closedOrder =
                await closePurchaseOrder(purchaseOrderId);

            // Replace the matching order with the updated order
            setPurchaseOrders((currentPurchaseOrders) =>
                currentPurchaseOrders.map((purchaseOrder) =>
                    purchaseOrder.id === purchaseOrderId
                        ? closedOrder
                        : purchaseOrder
                )
            );

            // Clear the selection and hide the close-order form
            setSelectedCloseOrderId(null);
        } catch (error) {
            console.error(
                "Error closing purchase order:",
                error
            );

            setCloseErrorMessage(
                "Unable to close the purchase order."
            );
        }
    }

    return {
        purchaseOrders,
        errorMessage,
        isLoading,
        selectedPurchaseOrderId,
        selectedSupplierName,
        selectedCloseOrderId,
        closeErrorMessage,
        setSelectedCloseOrderId,
        handleSelectOrder,
        handleCloseOrder
    };
}