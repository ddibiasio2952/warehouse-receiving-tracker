import { useState } from "react";

// Import types
import type { SubmitEvent } from "react";
import type {
    PurchaseOrderBody,
    Supplier
} from "../../../../../src/types/types";

// Props
type AddPurchaseOrderFormProps = {
    suppliers: Supplier[],
    onSubmit: (
        purchaseOrderBody: PurchaseOrderBody
    ) => Promise<void>;
};

function AddPurchaseOrderForm({
    suppliers,
    onSubmit
}: AddPurchaseOrderFormProps) {
    // Store the supplier ID entered by the user
    const [supplierId, setSupplierId] = useState<number>(0);

    // Store the expected date
    const [expectedDate, setExpectedDate] = useState<string>("");

    // Store the status
    const status = "open";

    async function handleOrderSubmit(
        event: SubmitEvent<HTMLFormElement>
    ): Promise<void> {
        event.preventDefault();

        await onSubmit({
            supplierId,
            expectedDate,
            status
        });
    }

    return (
        <form className="add-order-form"
            onSubmit={handleOrderSubmit}>
            <h3>Submit New Purchase Order</h3>

            <label htmlFor="supplier-id">
                Supplier
            </label>
            <select
                id="supplierId"
                value={supplierId}
                onChange={(event) =>
                    setSupplierId(Number(event.target.value))
                }
            >
                <option value={0}>
                    Select a Supplier
                </option>

                {suppliers.map((supplier) => (
                    <option
                        key={supplier.id}
                        value={supplier.id}
                    >
                        {supplier.name}
                    </option>
                ))}
            </select>

            <label htmlFor="expectedDate">
                Expected Date
            </label>
            <input
                id="expectedDate"
                type="date"
                value={expectedDate}
                onChange={(event) =>
                    setExpectedDate(event.target.value)
                }
                required
            />

            <button
                type="submit"
                disabled={
                    supplierId === 0
                }>
                Add Purchase Order
            </button>
        </form>
    )
}

export default AddPurchaseOrderForm;