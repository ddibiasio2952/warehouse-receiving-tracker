// Import types
import type { SubmitEvent } from "react";

// Props
type CloseOrderFormProps = {
    orderId: number;
    onSubmit: (
        orderId: number
    ) => Promise<void>;
    onCancel: () => void;
};

function CloseOrderForm({
    orderId,
    onSubmit,
    onCancel
}: CloseOrderFormProps) {
    
    async function handleClose(
        event: SubmitEvent <HTMLFormElement>
    ): Promise<void> {
        event.preventDefault();

        await onSubmit(orderId);
    }

    return (
        <form className="close-order-form"
            onSubmit={handleClose}>
            <h3>Close Purchase Order {orderId}?</h3>

            <button type="submit">
                Close Order
            </button>
            <button 
                type="button"
                onClick={onCancel}
            >
                Cancel
            </button>
        </form>
    );
}

export default CloseOrderForm;