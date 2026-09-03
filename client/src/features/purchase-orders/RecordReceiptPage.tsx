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

import {
    getPurchaseOrderLine,
    recordReceipt
} from "./services/purchaseOrderApi";


function RecordReceiptPage() {
    const navigate = useNavigate();

    const {
        purchaseOrderId,
        lineId
    } = useParams<{
        purchaseOrderId: string;
        lineId: string;
    }>();

    const orderId = Number(purchaseOrderId);
    const purchaseOrderLineId = Number(lineId);

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

    // Store a line-loading error
    const [
        lineErrorMessage,
        setLineErrorMessage
    ] = useState<string | null>(null);

    // Store a receipt-submission error
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

    // Load the selected line
    useEffect(() => {
        if (!hasValidParameters) {
            setIsLineLoading(false);
            return;
        }

        let requestWasCancelled = false;

        async function loadLineDetails(): Promise<void> {
            try {
                setIsLineLoading(true);
                setLineErrorMessage(null);

                const data =
                    await getPurchaseOrderLine(
                        purchaseOrderLineId
                    );

                if (requestWasCancelled) {
                    return;
                }

                // Verify that the line belongs to the URL's order
                if (data.purchaseOrderId !== orderId) {
                    setLineErrorMessage(
                        "This line does not belong to " +
                        "the selected purchase order."
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

        return () => {
            requestWasCancelled = true;
        };
    }, [
        hasValidParameters,
        orderId,
        purchaseOrderLineId
    ]);

    async function handleReceiptSubmit(
        submittedLineId: number,
        receiptBody: ReceiptRequestBody
    ): Promise<void> {
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
                "Error recording receipt: ",
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
                to={`/purchase-orders/${orderId}`}
            >
                Back to Purchase Order
            </Link>

            <h1>Record Receipt</h1>

            {isLineLoading && (
                <p>Loading SKU information...</p>
            )}

            {lineErrorMessage && (
                <p className="error-message">
                    {lineErrorMessage}
                </p>
            )}

            {lineDetails && (
                <>
                    <p>
                        SKU Number:{" "}
                        <span className="sku-number">
                            {lineDetails.skuNumber}
                        </span>
                    </p>

                    {receiptErrorMessage && (
                        <p className="error-message">
                            {receiptErrorMessage}
                        </p>
                    )}

                    {isRecordingReceipt && (
                        <p>Recording receipt...</p>
                    )}

                    <ReceiptForm
                        lineId={purchaseOrderLineId}
                        onSubmit={
                            handleReceiptSubmit
                        }
                    />
                </>
            )}
        </main>
    );
}

export default RecordReceiptPage;