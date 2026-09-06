import { useState } from "react";
import type { SubmitEvent } from "react";


// Import types
import type {
    Supplier,
    Sku,
    SkuRequestBody
} from "../../../../../src/types/types";

// Props
type EditSkuFormProps = {
    suppliers: Supplier[],
    sku: Sku;
    onSubmit: (
        skuBody: SkuRequestBody
    ) => Promise<void>;
};

function EditSkuForm({
    suppliers,
    sku,
    onSubmit
}: EditSkuFormProps) {
    // Begin with SKU's existing values
    const [
        supplierId,
        setSupplierId
    ] = useState<number>(sku.supplierId);

    const [
        skuNumber,
        setSkuNumber
    ] = useState<string>(sku.skuNumber);

    const [
        skuDescription,
        setSkuDescription
    ] = useState<string>(sku.description);

    async function handleEditSku(
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
        <form className="edit-sku-form"
            onSubmit={handleEditSku}>

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
                Edit SKU
            </button>
        </form>
    )
}

export default EditSkuForm;