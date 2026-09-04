import { Link } from "react-router";

import type {
    PurchaseOrderDetails
} from "../../../../../src/types/types";

// Props
type PurchaseOrderTableProps = {
    purchaseOrders: PurchaseOrderDetails[];
};

function PurchaseOrderTable({
    purchaseOrders
}: PurchaseOrderTableProps) {
    return (
        <table className="purchase-orders-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Supplier</th>
                    <th>Status</th>
                    <th>Expected Date</th>
                    <th>Actions</th>
                </tr>
            </thead>

            <tbody>
                {purchaseOrders.map((purchaseOrder) => (
                    <tr key={purchaseOrder.id}>
                        <td>{purchaseOrder.id}</td>

                        <td>
                            {purchaseOrder.supplierName}
                        </td>

                        <td>{purchaseOrder.status}</td>

                        <td>
                            {new Date(
                                purchaseOrder.expectedDate
                            ).toLocaleDateString()}
                        </td>

                        <td>
                            <Link
                                to={
                                    `/purchase-orders/` +
                                    purchaseOrder.id
                                }
                            >
                                View Details
                            </Link>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default PurchaseOrderTable;