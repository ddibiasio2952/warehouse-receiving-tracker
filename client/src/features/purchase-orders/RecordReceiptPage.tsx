import {
    useEffect,
    useState
} from "react";

import {
    Link,
    useNavigate,
    useParams
} from "react-router";

import type {
    PurchaseOrderLineDetails,
    ReceiptRequestBody
} from "../../../../src/types/types";

import ReceiptForm from
    "./components/ReceiptForm";

import { usePurchaseOrders } from
    "./hooks/usePurchaseOrders";

import {
    getPurchaseOrderLine,
    recordReceipt
} from "./services/purchaseOrderApi";


function RecordReceiptPage() {
    const navigate = useNavigate();

    // Get the purchase order ID and line ID from the URL
    const {
        purchaseOrderId,
        lineId
    } = useParams<{
        purchaseOrderId: string;
        lineId: string;
    }>();

    const orderId = Number(purchaseOrderId);
    const purchaseOrderLineId = Number(lineId);

    const {
        purchaseOrders,
        errorMessage: purchaseOrderErrorMessage,
        isLoading: arePurchaseOrdersLoading
    } = usePurchaseOrders();

    // Find the purchase order data from the URL ID
    const purchaseOrder = purchaseOrders.find(
        (order) => order.id === orderId
    );

    // Determine whether receipt entry is prohibited
    const isOrderClosed =
        purchaseOrder?.status === "closed";

    // Store the selected purchase order line
    const [
        lineDetails,
        setLineDetails
    ] = useState<PurchaseOrderLineDetails | null>(
        null
    );

    // Track whether the line is loading
    const [
        isLineLoading,
        setIsLineLoading
    ] = useState<boolean>(true);

    // Store an error from loading the line
    const [
        lineErrorMessage,
        setLineErrorMessage
    ] = useState<string | null>(null);

    // Store an error from recording the receipt
    const [
        receiptErrorMessage,
        setReceiptErrorMessage
    ] = useState<string | null>(null);

    // Track whether the receipt is being recorded
    const [
        isRecordingReceipt,
        setIsRecordingReceipt
    ] = useState<boolean>(false);

    const hasValidParameters =
        Number.isInteger(orderId) &&
        orderId > 0 &&
        Number.isInteger(purchaseOrderLineId) &&
        purchaseOrderLineId > 0;

    // Retrieve the selected purchase order line
    useEffect(() => {
    if (!hasValidParameters) {
        return;
    }

        const validLineId = purchaseOrderLineId;
        let requestWasCancelled = false;

        async function loadLineDetails(): Promise<void> {
            try {
                setIsLineLoading(true);
                setLineErrorMessage(null);

                const data =
                    await getPurchaseOrderLine(
                        validLineId
                    );

                if (requestWasCancelled) {
                    return;
                }

                // Verify that the line belongs to this order
                if (data.purchaseOrderId !== orderId) {
                    setLineDetails(null);

                    setLineErrorMessage(
                        "This line does not belong to the selected purchase order."
                    );

                    return;
                }

                setLineDetails(data);
            } catch (error) {
                if (requestWasCancelled) {
                    return;
                }

                console.error(
                    "Error retrieving purchase order line: ",
                    error
                );

                setLineDetails(null);

                setLineErrorMessage(
                    error instanceof Error
                        ? error.message
                        : "Unable to retrieve the line."
                );
            } finally {
                if (!requestWasCancelled) {
                    setIsLineLoading(false);
                }
            }
        }

        void loadLineDetails();

        // Ignore results if the page unmounts
        return () => {
            requestWasCancelled = true;
        };
    }, [
        hasValidParameters,
        orderId,
        purchaseOrderLineId
    ]);

    // Record the receipt
    async function handleReceiptSubmit(
        submittedLineId: number,
        receiptBody: ReceiptRequestBody
    ): Promise<void> {
        // Guard against submission for a closed order
        if (isOrderClosed) {
            setReceiptErrorMessage(
                "Receipts cannot be recorded for a closed purchase order."
            );

            return;
        }

        try {
            setIsRecordingReceipt(true);
            setReceiptErrorMessage(null);

            await recordReceipt(
                submittedLineId,
                receiptBody
            );

            // Return to the purchase order details
            navigate(
                `/purchase-orders/${orderId}`
            );
        } catch (error) {
            console.error(
                "Error recording receipt:",
                error
            );

            setReceiptErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Unable to record the receipt."
            );
        } finally {
            setIsRecordingReceipt(false);
        }
    }

    // Reject invalid URL parameters
    if (!hasValidParameters) {
        return (
            <main className="app-container">
                <h1>Invalid Receipt Request</h1>

                <p className="error-message">
                    The purchase order or line ID is invalid.
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
                className="back-link"
                to={`/purchase-orders/${orderId}`}
            >
                Back to Purchase Order
            </Link>

            <h1>Record Receipt</h1>

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
                        Receipts cannot be recorded because
                        this purchase order is closed.
                    </p>
                )}

            {/* Line loading condition */}
            {isLineLoading && (
                <p>Loading purchase order line...</p>
            )}

            {/* Line error condition */}
            {lineErrorMessage && (
                <p className="error-message">
                    {lineErrorMessage}
                </p>
            )}

            {/* Selected SKU */}
            {lineDetails && (
                <p>
                    SKU Number: {lineDetails.skuNumber}
                </p>
            )}

            {/* Receipt submission error */}
            {receiptErrorMessage && (
                <p className="error-message">
                    {receiptErrorMessage}
                </p>
            )}

            {/* Receipt submission loading condition */}
            {isRecordingReceipt && (
                <p>Recording receipt...</p>
            )}

            {/* Receipt form */}
            {!arePurchaseOrdersLoading &&
                !purchaseOrderErrorMessage &&
                purchaseOrder &&
                !isOrderClosed &&
                !isLineLoading &&
                !lineErrorMessage &&
                lineDetails && (
                    <ReceiptForm
                        lineId={purchaseOrderLineId}
                        onSubmit={handleReceiptSubmit}
                    />
                )}
        </main>
    );
}

export default RecordReceiptPage;