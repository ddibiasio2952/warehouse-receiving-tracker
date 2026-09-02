import type { PurchaseOrderDetails } from "../../../src/types/types";

// Props
type PurchaseOrderTableProps = {
    purchaseOrders: PurchaseOrderDetails[];
    onSelectOrder: (
        purchaseOrderId: number,
        supplierName: string
    ) => void;
    onRequestCloseOrder: (
        purchaseOrderId: number
    ) => void;
};

function PurchaseOrderTable({
    purchaseOrders,
    onSelectOrder,
    onRequestCloseOrder
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
                    <th>Close Order</th>
                </tr>
            </thead>

            <tbody>
                {purchaseOrders.map((purchaseOrder) => (
                    <tr key={purchaseOrder.id}>
                        <td>{purchaseOrder.id}</td>
                        <td>{purchaseOrder.supplierName}</td>
                        <td>{purchaseOrder.status}</td>
                        <td>
                            {new Date(
                                purchaseOrder.expectedDate
                            ).toLocaleDateString()}
                        </td>
                        <td>
                            <button
                                type="button"
                                // Send order Id back
                                onClick={() => onSelectOrder(
                                    purchaseOrder.id,
                                    purchaseOrder.supplierName)}
                            >
                                View Lines
                            </button>
                        </td>
                        <td>
                            <button
                                type="button"
                                // Send order Id back
                                onClick={() => onRequestCloseOrder(
                                    purchaseOrder.id)}
                            >
                                Close Order
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default PurchaseOrderTable;