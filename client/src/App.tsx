import {
    Route,
    Routes
} from "react-router-dom";

import "./App.css";

import HeaderNavigation from
    "./components/layout/HeaderNavigation";

import HomePage from "./pages/HomePage";

// Purchase Order Imports

import PurchaseOrderManagementPage from 
    "./features/purchase-orders/PurchaseOrderManagementPage";

import AllPurchaseOrdersPage from
    "./features/purchase-orders/AllPurchaseOrdersPage";

import AddPurchaseOrderPage from 
    "./features/purchase-orders/AddPurchaseOrderPage";

import AddPurchaseOrderLinePage from
    "./features/purchase-orders/AddPurchaseOrderLinePage";

import ClosePurchaseOrderPage from
    "./features/purchase-orders/ClosePurchaseOrderPage";

import PurchaseOrderDetailsPage from
    "./features/purchase-orders/PurchaseOrderDetailsPage";

import RecordReceiptPage from
    "./features/purchase-orders/RecordReceiptPage";

// SKU Imports

import SkuManagementPage from 
    "./features/skus/SkuManagementPage";

import AllSkusPage from
    "./features/skus/AllSkusPage";

import AddSkuPage from
    "./features/skus/AddSkuPage";

import EditSkuPage from
    "./features/skus/EditSkuPage";

function App() {
    return (
        <>
            {/*Overhead nav bar */}
            <HeaderNavigation />

            <Routes>
                {/* Index page */}
                <Route
                    path="/"
                    element={<HomePage />}
                />

                {/* Purchase order management page */}
                <Route 
                    path="/purchase-orders"
                    element={<PurchaseOrderManagementPage />}
                />


                {/* All purchase orders page */}
                <Route
                    path="/purchase-orders/all"
                    element={<AllPurchaseOrdersPage />}
                />

                {/* Add purchase orders page */}
                <Route
                    path="/purchase-orders/add"
                    element={<AddPurchaseOrderPage />}
                />

                {/* Purchase order details */}
                <Route
                    path="/purchase-orders/:purchaseOrderId"
                    element={<PurchaseOrderDetailsPage />}
                />

                {/* Close a purchase order */}
                <Route
                    path="/purchase-orders/:purchaseOrderId/close"
                    element={<ClosePurchaseOrderPage />}
                />

                {/* Add a purchase order line */}
                <Route
                    path="/purchase-orders/:purchaseOrderId/lines/new"
                    element={<AddPurchaseOrderLinePage />}
                />

                {/* Record a purchase order line receipt */}
                <Route
                    path="/purchase-orders/:purchaseOrderId/lines/:lineId/receipt"
                    element={<RecordReceiptPage />}
                />

                {/* SKU management page */}
                <Route 
                    path="/skus"
                    element={<SkuManagementPage />}
                />

                {/* All SKUs page */}
                <Route
                    path="/skus/all"
                    element={<AllSkusPage />}
                />

                {/* Add a SKU page */}
                <Route
                    path="/skus/add"
                    element={<AddSkuPage />}
                />

                {/* Edit a SKU */}
                <Route
                    path="/skus/:skuId/edit"
                    element={<EditSkuPage />}
                />
            </Routes>
        </>
    );
}

export default App;