import {
    useNavigate
} from "react-router-dom";

import SkuTable from
    "./components/SkuTable";

import { useSkus } from
    "./hooks/useSkus";

function AllSkusPage() {
    const navigate = useNavigate();

    const {
        skus,
        errorMessage,
        isLoading
    } = useSkus();

    return (
        <main className="page-container">
            <h1>SKUs</h1>

            {/* SKU actions */}
            {(
                <section className="object-actions">
                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/skus/add"
                            )
                        }
                    >
                        Add SKU
                    </button>
                </section>
            )}

            {/* Loading condition */}
            {isLoading && (
                <p>Loading purchase orders...</p>
            )}

            {/* Error condition */}
            {errorMessage && (
                <p className="error-message">
                    {errorMessage}
                </p>
            )}

            {/* SKU table */}
            {!isLoading && !errorMessage && (
                <SkuTable
                    skus={skus}
                />
            )}
        </main>
    );
}

export default AllSkusPage;