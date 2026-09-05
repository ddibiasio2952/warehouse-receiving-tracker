import { Link } from "react-router-dom";

function HomePage() {
    return (
        <main>
            <h1>Warehouse Management System</h1>
            <h2>Index</h2>

            <nav className="navigation">
                <Link to="/purchase-orders">
                    Purchase Order Management
                </Link>

                <Link to="/skus">
                    Sku Management
                </Link>
            </nav>
        </main>
    );
}

export default HomePage;