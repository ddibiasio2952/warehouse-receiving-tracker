import { Link } from "react-router-dom";

function HomePage() {
    return (
        <main>
            <h1>Receiving Management System</h1>
            <h2>Home Page</h2>

            <nav className="navigation">
                <Link to="/purchase-orders">
                    Purchase Order Management
                </Link>

                <Link to="/skus">
                    SKU Management
                </Link>
            </nav>
        </main>
    );
}

export default HomePage;