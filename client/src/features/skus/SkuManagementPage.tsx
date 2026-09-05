import { Link } from "react-router-dom";

function SkuManagementPage() {
    return (
        <main>
            <h1>SKU Management</h1>

            <nav className="navigation">
                <Link to="/skus/all">
                    View All SKUs
                </Link>

                <Link to="/skus/add">
                    Add SKU
                </Link>
            </nav>
        </main>
    )
}

export default SkuManagementPage;