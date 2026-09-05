import {
    useNavigate
} from "react-router-dom";

import PurchaseOrderTable from
    "./components/PurchaseOrderTable";

import { usePurchaseOrders } from
    "./hooks/usePurchaseOrders";

function AllPurchaseOrdersPage() {
    const navigate = useNavigate();

    const {
        purchaseOrders,
        errorMessage,
        isLoading
    } = usePurchaseOrders();

    return (
        <main className="page-container">
            <h1>Purchase Orders</h1>

            {/* Purchase order actions */}
            {(
                <section className="object-actions">
                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/purchase-orders/add"
                            )
                        }
                    >
                        Add Purchase Order
                    </button>
                </section>
            )}

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

export default AllPurchaseOrdersPage;