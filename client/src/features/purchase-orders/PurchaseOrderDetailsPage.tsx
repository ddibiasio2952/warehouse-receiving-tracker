import {
    Link,
    useNavigate,
    useParams
} from "react-router-dom";

import LineReportTable from
    "./components/LineReportTable";

import { usePurchaseOrders } from
    "./hooks/usePurchaseOrders";

import { useLineReports } from
    "./hooks/useLineReports";


function PurchaseOrderDetailsPage() {
    const navigate = useNavigate();

    const { purchaseOrderId } = useParams<{
        purchaseOrderId: string;
    }>();

    const orderId = Number(purchaseOrderId);

    const {
        purchaseOrders,
        errorMessage,
        isLoading
    } = usePurchaseOrders();

    const validOrderId =
        Number.isInteger(orderId) && orderId > 0
            ? orderId
            : null;

    const {
        lineReports,
        areLinesLoading,
        lineErrorMessage
    } = useLineReports(validOrderId);

    // Find the selected purchase order
    const purchaseOrder = purchaseOrders.find(
        (order) => order.id === orderId
    );

    // Navigate to the add line page
    function handleAddLine(): void {
        navigate(
            `/purchase-orders/${orderId}/lines/new`
        );
    }

    // Navigate to the close order page
    function handleRequestCloseOrder(): void {
        navigate(
            `/purchase-orders/${orderId}/close`
        );
    }

    // Navigate to the receipt page
    function handleSelectLine(lineId: number): void {
        navigate(
            `/purchase-orders/${orderId}` +
            `/lines/${lineId}/receipt`
        );
    }

    // Invalid URL parameter
    if (validOrderId === null) {
        return (
            <main className="page-container">
                <h1>Invalid Purchase Order</h1>

                <p className="error-message">
                    The purchase order ID must be a
                    positive integer.
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
                to="/purchase-orders/all">
                Back to Purchase Orders
            </Link>

            <h1>Purchase Order Details</h1>

            {/* Purchase order loading condition */}
            {isLoading && (
                <p>Loading purchase order...</p>
            )}

            {/* Purchase order error condition */}
            {errorMessage && (
                <p className="error-message">
                    {errorMessage}
                </p>
            )}

            {/* Purchase order not found condition */}
            {!isLoading &&
                !errorMessage &&
                !purchaseOrder && (
                    <p className="error-message">
                        Purchase order not found.
                    </p>
                )}

            {/* Purchase order details */}
            {!isLoading &&
                !errorMessage &&
                purchaseOrder && (
                    <>
                        <section>
                            <p>
                                Purchase Order ID:{" "}
                                {purchaseOrder.id}
                            </p>

                            <p>
                                Supplier:{" "}
                                {purchaseOrder.supplierName}
                            </p>

                            <p>
                                Status:{" "}
                                {purchaseOrder.status}
                            </p>

                            <p>
                                Expected Date:{" "}
                                {new Date(
                                    purchaseOrder
                                        .expectedDate
                                ).toLocaleDateString()}
                            </p>
                        </section>

                        {/* Purchase order actions */}
                        {purchaseOrder.status !==
                            "closed" && (
                            <section className="object-actions">
                                <button
                                    type="button"
                                    onClick={handleAddLine}
                                >
                                    Add Line
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        handleRequestCloseOrder
                                    }
                                >
                                    Close Order
                                </button>
                            </section>
                        )}

                        {/* Line report loading condition */}
                        {areLinesLoading && (
                            <p>
                                Loading purchase order lines...
                            </p>
                        )}

                        {/* Line report error condition */}
                        {lineErrorMessage && (
                            <p className="error-message">
                                {lineErrorMessage}
                            </p>
                        )}

                        {/* Line report table */}
                        {!areLinesLoading &&
                            !lineErrorMessage && (
                                <LineReportTable
                                    lineReports={
                                        lineReports
                                    }
                                    onSelectLine={
                                        handleSelectLine
                                    }
                                    canRecordReceipt={
                                        purchaseOrder.status !== "closed"
                                    }
                                />
                            )}
                    </>
                )}
        </main>
    );
}

export default PurchaseOrderDetailsPage;