import { useState } from "react";

// Import types
import type { SubmitEvent } from "react";
import type {
    Supplier,
    SkuRequestBody
} from "../../../../../src/types/types";

// Props
type AddSkuFormProps = {
    suppliers: Supplier[],
    onSubmit: (
        skuBody: SkuRequestBody
    ) => Promise<void>;
};

function AddSkuForm({
    suppliers,
    onSubmit
}: AddSkuFormProps) {
    // Store the supplier ID entered by the user
    const [supplierId, setSupplierId] = useState<number>(0);

    // Store the SKU number entered by the user
    const [skuNumber, setSkuNumber] = useState<string>("");

    // Store the SKU description entered by the user
    const [skuDescription, setSkuDescription] = useState<string>("");

    async function handleSkuSubmit(
        event: SubmitEvent<HTMLFormElement>
    ): Promise<void> {
        event.preventDefault();

        await onSubmit({
            supplierId,
            skuNumber,
            description: skuDescription,
        });
    }

    return (
        <form className="add-sku-form"
            onSubmit={handleSkuSubmit}>
            <h3>Submit New SKU</h3>

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


            <label htmlFor="sku-number">
                SKU Number
            </label>
            <input
                id="sku-number"
                type="text"
                value={skuNumber}
                onChange={(event) =>
                    setSkuNumber(event.target.value)
                }
                required
            />

            <label htmlFor="description">
                Description
            </label>
            <input
                id="description"
                type="text"
                value={skuDescription}
                onChange={(event) =>
                    setSkuDescription(event.target.value)
                }
                required
            />

            <button
                type="submit"
                disabled={
                    supplierId === 0
                }>
                Add SKU
            </button>
        </form>
    )
}

export default AddSkuForm;