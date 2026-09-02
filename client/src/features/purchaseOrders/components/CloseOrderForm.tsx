// Import types
import type { SubmitEvent } from "react";

// Props
type CloseOrderFormProps = {
    orderId: number;
    onSubmit: (
        orderId: number
    ) => Promise<void>;
};

function CloseOrderForm({
    orderId,
    onSubmit
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
            {/*<label htmlFor="order-id">
                Order Id
            </label> */}
            <button type="submit">
                Close Order
            </button>
        </form>
    );
}

export default CloseOrderForm;