import { Link } from "react-router-dom";

function PurchaseOrderManagementPage() {
    return (
        <main>
            <h1>Purchase Order Management</h1>

            <nav className="navigation">
                <Link to="/purchase-orders/all">
                    View All Purchase Orders
                </Link>
                
                <Link to="/purchase-orders/add">
                    Add Purchase Order
                </Link>
            </nav>
        </main>
    )
}

export default PurchaseOrderManagementPage;