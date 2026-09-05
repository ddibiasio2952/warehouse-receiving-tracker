import { NavLink } from "react-router-dom";

function HeaderNavigation() {
    return (
        <nav className="header-navigation">
            <ul><li className="nav-item">
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
                </li>
                <li className="nav-item">


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
                    <ul className="sub-menu">
                        <li>
                            <NavLink
                                to="/purchase-orders/all"
                                className={({ isActive }) =>
                                    isActive
                                        ? "navigation-link active"
                                        : "navigation-link"
                                }
                            >
                                All Purchase Orders
                            </NavLink>
                        </li>

                        <li>
                            <NavLink
                                to="/purchase-orders/add"
                                className={({ isActive }) =>
                                    isActive
                                        ? "navigation-link active"
                                        : "navigation-link"
                                }
                            >
                                Add Purchase Order
                            </NavLink>
                        </li>
                    </ul>
                </li>

                <li className="nav-item">
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
                    <ul className="sub-menu">
                        <li><NavLink
                            to="/skus/all"
                            className={({ isActive }) =>
                                isActive
                                    ? "navigation-link active"
                                    : "navigation-link"
                            }
                        >
                            All SKUs
                        </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/skus/add"
                                className={({ isActive }) =>
                                    isActive
                                        ? "navigation-link active"
                                        : "navigation-link"
                                }
                            >
                                Add SKU
                            </NavLink>
                        </li>
                    </ul>
                </li>
            </ul>
        </nav>
    );
}

export default HeaderNavigation;