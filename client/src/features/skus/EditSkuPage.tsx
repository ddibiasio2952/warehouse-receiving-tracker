import {
    useEffect,
    useState
} from "react";

import {
    Link,
    useNavigate,
    useParams
} from "react-router-dom";

import type {
    Sku,
    SkuRequestBody
} from "../../../../src/types/types";

import EditSkuForm from
    "./components/EditSkuForm";

import { useSuppliers } from
    "../suppliers/hooks/useSuppliers";

import {
    getSkuById,
    editSku
} from "./services/skuApi";

function EditSkuPage() {
    const navigate = useNavigate();

    // Get the SKU ID from the URL
    const {
        skuIdParam
    } = useParams<{
        skuIdParam: string;
    }>();

    const skuId = Number(skuIdParam);

    // Load suppliers
    const {
        suppliers,
        errorMessage: suppliersError,
        isLoading: areSuppliersLoading
    } = useSuppliers();

    // Store the retrieved SKU before editing
    const [
        skuBeforeEdit,
        setSkuBeforeEdit
    ] = useState<Sku | null>(null);

    // Track whether the SKU is loading
    const [
        isSkuLoading,
        setIsSkuLoading
    ] = useState<boolean>(false);

    // Store an error from loading the SKU
    const [
        loadSkuErrorMessage,
        setLoadSkuErrorMessage
    ] = useState<string | null>(null);

    // Store an error from editing the SKU
    const [
        editSkuErrorMessage,
        setEditSkuErrorMessage
    ] = useState<string | null>(null);

    // Track whether the SKU is being edited
    const [
        isEditingSku,
        setIsEditingSku
    ] = useState<boolean>(false);

    const hasValidParameters =
        Number.isInteger(skuId) &&
        skuId > 0;

    // Retrieve the selected SKU
    useEffect(() => {
        if (!hasValidParameters) {
            return;
        }

        const validSkuId = skuId;
        let requestWasCancelled = false;

        async function loadSkuDetails(): Promise<void> {
            try {
                setIsSkuLoading(true);
                setLoadSkuErrorMessage(null);

                const data =
                    await getSkuById(validSkuId);

                if (requestWasCancelled) {
                    return;
                }

                setSkuBeforeEdit(data);
            } catch (error) {
                if (requestWasCancelled) {
                    return;
                }

                console.error(
                    "Error retrieving SKU: ", error
                );

                setSkuBeforeEdit(null);

                setLoadSkuErrorMessage(
                    error instanceof Error
                        ? error.message
                        : "Unable to retrieve the SKU."
                );
            } finally {
                if (!requestWasCancelled) {
                    setIsSkuLoading(false);
                }
            }
        }

        void loadSkuDetails();

        // Ignore results if the page unmounts
        return () => {
            requestWasCancelled = true;
        };
    }, [
        hasValidParameters,
        skuId,
    ]);

    // Edit the SKU
    async function handleEditSku(
        skuId: number,
        skuBody: SkuRequestBody
    ): Promise<void> {
        try {
            setIsEditingSku(true);
            setEditSkuErrorMessage(null);

            await editSku(
                skuId,
                skuBody
            );

            // Return to view all SKUs
            navigate(
                `/skus/all`
            );
        } catch (error) {
            console.error(
                "Error editing SKU: ", error
            );

            setEditSkuErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Unable to edit the SKU."
            );
        } finally {
            setIsEditingSku(false);
        }
    }

    // Reject invalid URL parameter
    if (!hasValidParameters) {
        return (
            <main className="page-container">
                <h1>Invalid SKU Request</h1>

                <p className="error-message">
                    The SKU ID is invalid.
                </p>

                <Link to="/skus/all">
                    Return to View All SKUs
                </Link>
            </main>
        );
    }

    return (
        <main className="page-container">
            <Link
                className="back-link"
                to={`/skus/all`}
            >
                Back to View All Skus
            </Link>

            <h1>Edit SKU</h1>

            {/* Supplier loading condition */}
            {areSuppliersLoading && (
                <p>Loading suppliers...</p>
            )}

            {/* Suppliers error condition */}
            {suppliersError && (
                <p className="error-message">
                    {suppliersError}
                </p>
            )}

            {/* Suppliers not found condition */}
            {!areSuppliersLoading &&
                !suppliersError &&
                suppliers.length === 0 && (
                    <p className="error-message">
                        Suppliers not found.
                    </p>

                )}

            {/* SKU Loading condition */}
            {isSkuLoading && (
                <p>Loading SKU to edit...</p>
            )}

            {/* SKU loading error */}
            {loadSkuErrorMessage && (
                <p className="error-message">
                    {loadSkuErrorMessage}
                </p>
            )}

            {/* SKU not found condition */}
            {!isSkuLoading &&
                !loadSkuErrorMessage &&
                !skuBeforeEdit && (
                    <p className="error-message">
                        SKU to edit not found.
                    </p>
                )}

            {/* Edit submission error */}
            {editSkuErrorMessage && (
                <p className="error-message">
                    {editSkuErrorMessage}
                </p>
            )}

            {/* Edit SKU loading condition */}
            {isEditingSku && (
                <p>Editing SKU...</p>
            )}

            {/* Edit SKU form */}
            {!areSuppliersLoading &&
                !suppliersError &&
                suppliers &&
                !isSkuLoading &&
                !loadSkuErrorMessage &&
                skuBeforeEdit && (
                    <EditSkuForm
                        suppliers={suppliers}
                        sku={skuBeforeEdit}
                        onSubmit={(skuBody) =>
                            handleEditSku(skuId, skuBody)
                        }
                    />
                )}
        </main>
    );
}

export default EditSkuPage;