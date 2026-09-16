import { useState } from "react";

// Import types
import type { SubmitEvent } from "react";
import type {
    Sku,
    PurchaseOrderLineRequestBody
} from "../../../../../server/src/types/types";

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
    const [skuId, setSkuId] = useState<string>("");

    // Store the expected SKU quantity entered by the user
    const [expectedQuantity, setExpectedQuantity] = useState<string>("");

    async function handleLineSubmit(
        event: SubmitEvent<HTMLFormElement>
    ): Promise<void> {
        event.preventDefault();

        const lineId = Number(skuId);
        const lineQuantity = Number(expectedQuantity);

        await onSubmit(orderId, {
            skuId: lineId,
            expectedQuantity: lineQuantity
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
                    setSkuId(event.target.value)
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
                step="1"
                value={expectedQuantity}
                onChange={(event) =>
                    setExpectedQuantity(event.target.value)
                }
            />

            <button type="submit">
                Add Order Line
            </button>
        </form>

    )
}

export default OrderLineForm;