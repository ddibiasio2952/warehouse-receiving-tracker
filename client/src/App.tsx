import {
    Navigate,
    Route,
    Routes
} from "react-router";

import AppNavigation from
    "./components/layout/AppNavigation";

import AddPurchaseOrderLinePage from
    "./features/purchase-orders/AddPurchaseOrderLinePage";

import ClosePurchaseOrderPage from
    "./features/purchase-orders/ClosePurchaseOrderPage";

import PurchaseOrderDetailsPage from
    "./features/purchase-orders/PurchaseOrderDetailsPage";

import PurchaseOrdersPage from
    "./features/purchase-orders/PurchaseOrdersPage";

import RecordReceiptPage from
    "./features/purchase-orders/RecordReceiptPage";

import "./App.css";


function App() {
    return (
        <>
            <AppNavigation />

            <Routes>
                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/purchase-orders"
                            replace
                        />
                    }
                />

                <Route
                    path="/purchase-orders"
                    element={<PurchaseOrdersPage />}
                />

                <Route
                    path={
                        "/purchase-orders/" +
                        ":purchaseOrderId"
                    }
                    element={
                        <PurchaseOrderDetailsPage />
                    }
                />

                <Route
                    path={
                        "/purchase-orders/" +
                        ":purchaseOrderId/close"
                    }
                    element={
                        <ClosePurchaseOrderPage />
                    }
                />

                <Route
                    path={
                        "/purchase-orders/" +
                        ":purchaseOrderId/lines/new"
                    }
                    element={
                        <AddPurchaseOrderLinePage />
                    }
                />

                <Route
                    path={
                        "/purchase-orders/" +
                        ":purchaseOrderId/lines/" +
                        ":lineId/receipt"
                    }
                    element={<RecordReceiptPage />}
                />
            </Routes>
        </>
    );
}

export default App;