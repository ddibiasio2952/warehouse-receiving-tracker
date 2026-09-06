import { useState } from "react";

// Import types
import type { SubmitEvent } from "react";
import type {
    ReceiptRequestBody
} from "../../../../../src/types/types";

// Props
type ReceiptFormProps = {
    lineId: number;
    onSubmit: (
        lineId: number,
        receipt: ReceiptRequestBody
    ) => Promise<void>;
};

function ReceiptForm({
    lineId,
    onSubmit
}: ReceiptFormProps) {
    // Store the received quantity entered by the user
    const [received, setReceived] = useState<string>("");

    // Store the damaged quantity entered by the user
    const [damaged, setDamaged] = useState<string>("");

    async function handleReceiptSubmit(
        event: SubmitEvent<HTMLFormElement>
    ): Promise<void> {
        event.preventDefault();

        const receivedQuantity = Number(received);
        const damagedQuantity = Number(damaged);

        await onSubmit(lineId, {
            received: receivedQuantity,
            damaged: damagedQuantity
        });
    }

    return (
        <form className="receipt-form"
            onSubmit={handleReceiptSubmit}>

            <label htmlFor="received">
                Overall Received Quantity
            </label>

            <input
                id="received"
                type="number"
                min="0"
                step="1"
                value={received}
                onChange={(event) =>
                    setReceived(event.target.value)
                }
                required
            />

            <label htmlFor="damaged">
                Damaged Quantity from Overall Received
            </label>

            <input
                id="damaged"
                type="number"
                min="0"
                step="1"
                value={damaged}
                onChange={(event) =>
                    setDamaged(event.target.value)
                }
                required
            />

            <button type="submit">
                Save Receipt
            </button>
        </form>
    );
}

export default ReceiptForm;