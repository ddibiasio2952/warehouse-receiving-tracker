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
    const [received, setReceived] = useState<number>(0);

    // Store the damaged quantity entered by the user
    const [damaged, setDamaged] = useState<number>(0);

    async function handleReceiptSubmit(
        event: SubmitEvent <HTMLFormElement>
    ): Promise<void> {
        event.preventDefault();

        await onSubmit(lineId, {
            received,
            damaged
        });
    }

    return (
        <form className="receipt-form"
            onSubmit={handleReceiptSubmit}>

            <label htmlFor="received">
                Received Quantity
            </label>

            <input
                id="received"
                type="number"
                min="0"
                value={received}
                onChange={(event) =>
                    setReceived(Number(event.target.value))
                }
            />

            <label htmlFor="damaged">
                Damaged Quantity
            </label>

            <input
                id="damaged"
                type="number"
                min="0"
                value={damaged}
                onChange={(event) =>
                    setDamaged(Number(event.target.value))
                }
            />

            <button type="submit">
                Save Receipt
            </button>
        </form>
    );
}

export default ReceiptForm;