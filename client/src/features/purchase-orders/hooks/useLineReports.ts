import {
    useEffect,
    useState
} from "react";

import type {
    LineResult
} from "../../../../../src/types/types";

import { 
    getLineReports 
} from "../services/purchaseOrderApi";


export function useLineReports(
    purchaseOrderId: number | null
) {
    // Store line reports returned by the API
    const [
        lineReports,
        setLineReports
    ] = useState<LineResult[]>([]);

    // Track whether line reports are loading
    const [
        areLinesLoading,
        setAreLinesLoading
    ] = useState<boolean>(false);

    // Store an error from retrieving line reports
    const [
        lineErrorMessage,
        setLineErrorMessage
    ] = useState<string | null>(null);

    // Retrieve lines when the purchase order changes
    useEffect(() => {
        if (purchaseOrderId === null) {
            return;
        }

        // Retain purchase order ID
        const validPurchaseOrderId = purchaseOrderId;

        let requestWasCancelled = false;

        async function loadLineReports(): Promise<void> {
            try {
                setAreLinesLoading(true);
                setLineErrorMessage(null);

                const data =
                    await getLineReports(validPurchaseOrderId);

                if (!requestWasCancelled) {
                    setLineReports(data);
                }
            } catch (error) {
                if (requestWasCancelled) {
                    return;
                }

                console.error(
                    "Error retrieving line reports: ",
                    error
                );
                
                // Use empty array
                setLineReports([]);

                setLineErrorMessage(
                    "Unable to load the purchase order lines."
                );
            } finally {
                if (!requestWasCancelled) {
                    setAreLinesLoading(false);
                }
            }
        }

        void loadLineReports();

        // Ignore results if the page changes before completion
        return () => {
            requestWasCancelled = true;
        };
    }, [purchaseOrderId]);

    return {
        // Return empty values if no valid order selected
        lineReports:
            purchaseOrderId === null
                ? []
                : lineReports,

        areLinesLoading:
            purchaseOrderId === null
                ? false
                : areLinesLoading,

        lineErrorMessage:
            purchaseOrderId === null
                ? null
                : lineErrorMessage
    };
}