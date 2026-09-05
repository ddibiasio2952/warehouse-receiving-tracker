import { NavLink } from "react-router-dom";

function HeaderNavigation() {
    return (
        <nav className="header-navigation">
            <NavLink
                to="/"
                end
                className={({ isActive }) =>
                    isActive
                        ? "navigation-link active"
                        : "navigation-link"
                }
            >
                Main
            </NavLink>
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
            <NavLink
                to="/skus"
                className={({ isActive }) =>
                    isActive
                        ? "navigation-link active"
                        : "navigation-link"
                }
            >
                SKUs
            </NavLink>
        </nav>
    );
}

export default HeaderNavigation;