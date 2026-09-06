import { useNavigate } from "react-router-dom";

import type {
    PurchaseOrderDetails
} from "../../../../../src/types/types";

import { formatDate } from
    "../../../utilities/formatDate";

// Props
type PurchaseOrderTableProps = {
    purchaseOrders: PurchaseOrderDetails[];
};

function PurchaseOrderTable({
    purchaseOrders
}: PurchaseOrderTableProps) {
    const navigate = useNavigate();

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
                            {formatDate(purchaseOrder.expectedDate)}
                        </td>

                        <td>
                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        `/purchase-orders/${purchaseOrder.id}`
                                    )}
                            >
                                View Details
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default PurchaseOrderTable;