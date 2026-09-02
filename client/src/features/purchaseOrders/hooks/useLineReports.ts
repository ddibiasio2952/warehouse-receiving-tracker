import { useEffect, useState } from "react";

import type {
    LineResult,
    ReceiptRequestBody
} from "../../../../../src/types/types";

import {
    getLineReports,
    recordReceipt
} from "../services/purchaseOrderApi";


export function useLineReports(
    selectedPurchaseOrderId: number | null
) {
    // Store the selected purchase order's line reports
    const [lineReports, setLineReports] =
        useState<LineResult[]>([]);

    // Track whether line reports are loading
    const [areLinesLoading, setAreLinesLoading] =
        useState<boolean>(false);

    // Store errors from line or receipt requests
    const [lineErrorMessage, setLineErrorMessage] =
        useState<string | null>(null);

    // Store the selected purchase-order line Id
    const [selectedLineId, setSelectedLineId] =
        useState<number | null>(null);

    // Retrieve line reports when an order is selected
    useEffect(() => {
        if (selectedPurchaseOrderId === null) {
            setLineReports([]);
            setSelectedLineId(null);
            setLineErrorMessage(null);
            return;
        }

        const purchaseOrderId = selectedPurchaseOrderId;

        async function loadLineReports(): Promise<void> {
            try {
                setAreLinesLoading(true);
                setLineReports([]);
                setLineErrorMessage(null);
                setSelectedLineId(null);

                const data =
                    await getLineReports(purchaseOrderId);

                setLineReports(data);
            } catch (error) {
                console.error(
                    "Error retrieving line reports:",
                    error
                );

                setLineErrorMessage(
                    "Unable to load the purchase order lines."
                );

                setLineReports([]);
            } finally {
                setAreLinesLoading(false);
            }
        }

        void loadLineReports();
    }, [selectedPurchaseOrderId]);

    // Record a receipt and update the matching report
    async function handleReceiptSubmit(
        lineId: number,
        receipt: ReceiptRequestBody
    ): Promise<void> {
        try {
            setLineErrorMessage(null);

            const updatedLine =
                await recordReceipt(lineId, receipt);

            setLineReports((currentReports) =>
                currentReports.map((lineReport) =>
                    lineReport.purchaseOrderLineId === lineId
                        ? updatedLine
                        : lineReport
                )
            );

            // Hide the receipt form after success
            setSelectedLineId(null);
        } catch (error) {
            console.error(
                "Error recording receipt:",
                error
            );

            setLineErrorMessage(
                "Unable to record the receipt."
            );
        }
    }

    return {
        lineReports,
        areLinesLoading,
        lineErrorMessage,
        selectedLineId,
        setSelectedLineId,
        handleReceiptSubmit
    };
}