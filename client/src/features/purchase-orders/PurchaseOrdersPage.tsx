import PurchaseOrderTable from
    "./components/PurchaseOrderTable";

import { usePurchaseOrders } from
    "./hooks/usePurchaseOrders";

function PurchaseOrdersPage() {
    const {
        purchaseOrders,
        errorMessage,
        isLoading
    } = usePurchaseOrders();

    return (
        <main className="app-container">
            <h1>Purchase Orders</h1>

            {/* Loading condition */}
            {isLoading && (
                <p>Loading purchase orders...</p>
            )}

            {/* Error condition */}
            {errorMessage && (
                <p className="error-message">
                    {errorMessage}
                </p>
            )}

            {/* Purchase order table */}
            {!isLoading && !errorMessage && (
                <PurchaseOrderTable
                    purchaseOrders={purchaseOrders}
                />
            )}
        </main>
    );
}

export default PurchaseOrdersPage;