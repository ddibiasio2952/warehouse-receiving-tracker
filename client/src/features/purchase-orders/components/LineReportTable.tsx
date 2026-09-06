import type {
    LineResult
} from "../../../../../src/types/types";

// Props
type LineReportTableProps = {
    lineReports: LineResult[];
    onSelectLine: (lineId: number) => void;
    canRecordReceipt: boolean;
};

function LineReportTable({
    lineReports,
    onSelectLine,
    canRecordReceipt
}: LineReportTableProps) {
    // Display a message when the order has no lines
    if (lineReports.length === 0) {
        return (
            <p className="error-message">
                This purchase order has no line reports.
            </p>
        );
    }

    return (
        <table className="line-reports-table">
            <thead>
                <tr>
                    <th>Line Number</th>
                    <th>SKU</th>
                    <th>Expected</th>
                    <th>Received</th>
                    <th>Usable</th>
                    <th>Damaged</th>
                    <th>Difference</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>

            <tbody>
                {lineReports.map(
                    (lineReport, index) => (
                        <tr
                            key={lineReport.purchaseOrderLineId}
                        >
                            <td>{index + 1}</td>
                            <td>
                                {lineReport.skuNumber}
                            </td>
                            <td>
                                {lineReport.expectedQuantity}
                            </td>

                            <td>
                                {lineReport.receivedQuantity}
                            </td>

                            <td>
                                {lineReport.usableReceived}
                            </td>

                            <td>
                                {lineReport.damagedQuantity}
                            </td>

                            <td>
                                {lineReport.difference}
                            </td>

                            <td>
                                {lineReport.status}
                            </td>

                            <td>
                                {canRecordReceipt ? (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onSelectLine(
                                                lineReport.purchaseOrderLineId
                                            )
                                        }
                                    >
                                        Record Receipt
                                    </button>
                                ) : (
                                    <span>Order Closed</span>
                                )}
                            </td>
                        </tr>
                    )
                )}
            </tbody>
        </table>
    );
}

export default LineReportTable;