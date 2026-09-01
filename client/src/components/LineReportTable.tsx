import type { LineResult } from "../../../src/types/types";

// Props
type LineReportTableProps = {
    lineReports: LineResult[];
    onSelectLine: (lineId: number) => void;
};

function LineReportTable({
    lineReports,
    onSelectLine
}: LineReportTableProps) {
    // Display message when order has no line reports
    if (lineReports.length === 0) {
        return <p>This purchase order has no line reports.</p>;
    }

    return (
        <table className="line-reports-table">
            <thead>
                <tr>
                    <th>Line ID</th>
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
                {lineReports.map((lineReport) => (
                    <tr key={lineReport.purchaseOrderLineId}>
                        <td>{lineReport.purchaseOrderLineId}</td>
                        <td>{lineReport.expectedQuantity}</td>
                        <td>{lineReport.receivedQuantity}</td>
                        <td>{lineReport.usableReceived}</td>
                        <td>{lineReport.damagedQuantity}</td>
                        <td>{lineReport.difference}</td>
                        <td>{lineReport.status}</td>
                        <td>
                            <button
                                type="button"
                                // Send row Id back
                                onClick={() =>
                                    onSelectLine(lineReport.purchaseOrderLineId)}
                            >
                                Record Receipt
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default LineReportTable;