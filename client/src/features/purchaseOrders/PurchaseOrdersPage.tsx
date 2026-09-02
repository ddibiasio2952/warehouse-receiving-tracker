import PurchaseOrderTable from
    "./components/PurchaseOrderTable";

import CloseOrderForm from
    "./components/CloseOrderForm";

import LineReportTable from
    "./components/LineReportTable";

import ReceiptForm from
    "./components/ReceiptForm";

import { usePurchaseOrders } from
    "./hooks/usePurchaseOrders";

import { useLineReports } from
    "./hooks/useLineReports";


function PurchaseOrdersPage() {
    const {
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
    } = usePurchaseOrders();

    const {
        lineReports,
        areLinesLoading,
        lineErrorMessage,
        selectedLineId,
        setSelectedLineId,
        handleReceiptSubmit
    } = useLineReports(selectedPurchaseOrderId);

    return (
        <main className="app-container">
            <h1>Receiving Discrepancy Tracker</h1>

            {/* Purchase orders */}

            {isLoading && (
                <p>Loading purchase orders...</p>
            )}

            {errorMessage && (
                <p className="error-message">
                    {errorMessage}
                </p>
            )}

            {!isLoading && !errorMessage && (
                <PurchaseOrderTable
                    purchaseOrders={purchaseOrders}
                    onSelectOrder={handleSelectOrder}
                    onRequestCloseOrder={
                        setSelectedCloseOrderId
                    }
                />
            )}

            {/* Selected purchase order */}

            {selectedPurchaseOrderId !== null && (
                <section>
                    <p>
                        Selected Purchase Order ID:{" "}
                        {selectedPurchaseOrderId}
                    </p>

                    <p>
                        Supplier:{" "}
                        <span className="selected-supplier-name">
                            {selectedSupplierName}
                        </span>
                    </p>
                </section>
            )}

            {/* Close-order confirmation */}

            {closeErrorMessage && (
                <p className="error-message">
                    {closeErrorMessage}
                </p>
            )}

            {selectedCloseOrderId !== null && (
                <CloseOrderForm
                    orderId={selectedCloseOrderId}
                    onSubmit={handleCloseOrder}
                />
            )}

            {/* Line reports */}

            {areLinesLoading && (
                <p>Loading purchase order lines...</p>
            )}

            {lineErrorMessage && (
                <p className="error-message">
                    {lineErrorMessage}
                </p>
            )}

            {selectedPurchaseOrderId !== null &&
                !areLinesLoading &&
                !lineErrorMessage && (
                    <LineReportTable
                        lineReports={lineReports}
                        onSelectLine={setSelectedLineId}
                    />
                )}

            {/* Receipt form */}

            {selectedLineId !== null && (
                <ReceiptForm
                    lineId={selectedLineId}
                    onSubmit={handleReceiptSubmit}
                />
            )}
        </main>
    );
}

export default PurchaseOrdersPage;