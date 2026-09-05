import { useState } from "react";

// Import types
import type { SubmitEvent } from "react";
import type {
    Sku,
    PurchaseOrderLineRequestBody
} from "../../../../../src/types/types";

// Props
type OrderLineFormProps = {
    orderId: number,
    skusBySupplier: Sku[];
    onSubmit: (
        orderId: number,
        lineBody: PurchaseOrderLineRequestBody
    ) => Promise<void>;

};

function OrderLineForm({
    orderId,
    skusBySupplier,
    onSubmit
}: OrderLineFormProps) {
    // Store the SKU ID entered by the user
    const [skuId, setSkuId] = useState<number>(0);

    // Store the expected SKU quantity entered by the user
    const [expectedQuantity, setExpectedQuantity] = useState<number>(0);

    async function handleLineSubmit(
        event: SubmitEvent<HTMLFormElement>
    ): Promise<void> {
        event.preventDefault();

        await onSubmit(orderId, {
            skuId,
            expectedQuantity
        });
    }

    return (
        <form className="order-line-form"
            onSubmit={handleLineSubmit}>
            <h3>Submit New Line for Order {orderId}</h3>

            <label htmlFor="sku-name">
                SKU Name
            </label>
            <select
                id="skuId"
                value={skuId}
                onChange={(event) =>
                    setSkuId(Number(event.target.value))
                }
            >
                <option value={0}>
                    Select a SKU
                </option>

                {skusBySupplier.map((sku) => (
                    <option
                        key={sku.id}
                        value={sku.id}
                    >
                        {sku.skuNumber} - {sku.description}
                    </option>
                ))}
            </select>

            <label htmlFor="expected-quantity">
                Expected Quantity
            </label>

            <input
                id="expected-quantity"
                type="number"
                min="0"
                value={expectedQuantity}
                onChange={(event) =>
                    setExpectedQuantity(Number(event.target.value))
                }
            />

            <button type="submit">
                Add Order Line
            </button>
        </form>

    )
}

export default OrderLineForm;