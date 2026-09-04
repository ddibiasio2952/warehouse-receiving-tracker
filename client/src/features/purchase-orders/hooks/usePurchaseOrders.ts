import {
    useEffect,
    useState
} from "react";

import type {
    PurchaseOrderDetails
} from "../../../../../src/types/types";

import { getPurchaseOrders } from
    "../services/purchaseOrderApi";


export function usePurchaseOrders() {
    // Store purchase orders returned by the API
    const [
        purchaseOrders,
        setPurchaseOrders
    ] = useState<PurchaseOrderDetails[]>([]);

    // Store an error from retrieving purchase orders
    const [
        errorMessage,
        setErrorMessage
    ] = useState<string | null>(null);

    // Track whether purchase orders are loading
    const [
        isLoading,
        setIsLoading
    ] = useState<boolean>(true);

    // Retrieve purchase orders when the hook first runs
    useEffect(() => {
        let requestWasCancelled = false;

        async function loadPurchaseOrders(): Promise<void> {
            try {
                setIsLoading(true);
                setErrorMessage(null);

                const data =
                    await getPurchaseOrders();

                if (!requestWasCancelled) {
                    setPurchaseOrders(data);
                }
            } catch (error) {
                if (requestWasCancelled) {
                    return;
                }

                console.error(
                    "Error retrieving purchase orders: ",
                    error
                );

                setPurchaseOrders([]);

                setErrorMessage(
                    "Unable to load purchase orders."
                );
            } finally {
                if (!requestWasCancelled) {
                    setIsLoading(false);
                }
            }
        }

        void loadPurchaseOrders();

        // Ignore results if the component unmounts
        return () => {
            requestWasCancelled = true;
        };
    }, []);

    return {
        purchaseOrders,
        errorMessage,
        isLoading
    };
}