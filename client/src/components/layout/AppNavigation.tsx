import { NavLink } from "react-router";

function AppNavigation() {
    return (
        <nav className="app-navigation">
            <NavLink
                to="/purchase-orders"
                className={({ isActive }) =>
                    isActive
                        ? "navigation-link active"
                        : "navigation-link"
                }
            >
                Purchase Orders
            </NavLink>
        </nav>
    );
}

export default AppNavigation;