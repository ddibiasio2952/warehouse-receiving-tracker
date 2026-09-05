import { useNavigate } from "react-router-dom";

import type {
    SkuRetrieveBody
} from "../../../../../src/types/types";

// Props
type SkuTableProps = {
    skus: SkuRetrieveBody[];
};

function SkuTable({
    skus
}: SkuTableProps) {
    const navigate = useNavigate();

    return (
        <table className="skus-table">
            <thead>
                <tr>
                    <th>SKU Number</th>
                    <th>Supplier</th>
                    <th>Description</th>
                    <th>Actions</th>
                </tr>
            </thead>

            <tbody>
                {skus.map((sku) => (
                    <tr key={sku.id}>
                        <td>{sku.skuNumber}</td>

                        <td>{sku.supplierName}</td>

                        <td>{sku.description}</td>

                        <td>
                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        `/skus/${sku.id}/edit`
                                    )}
                            >
                                Modify
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default SkuTable;