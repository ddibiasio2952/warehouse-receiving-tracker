import {
    useEffect,
    useState
} from "react";

import type {
    Sku
} from "../../../../../src/types/types";

import { 
    getSkusBySupplierId 
} from "../services/skuApi";

export function useSkusBySupplier(
    supplierId: number | null
) {
    // Store SKUs returned by the API
    const [
        skusBySupplier,
        setSkusBySupplier
    ] = useState<Sku[]>([]);

    // Store an error from retrieving SKUs
    const [
        errorMessage,
        setErrorMessage
    ] = useState<string | null>(null);

    // Track whether SKUs are loading
    const [
        isLoading,
        setIsLoading
    ] = useState<boolean>(true);

    // Retrieve SKUS when the hook first runs
    useEffect(() => {
        if (supplierId === null) {
            return;
        }

        // Retain supplier ID
        const validSupplierId = supplierId;

        let requestWasCancelled = false;

        async function loadSkusBySupplier(): Promise<void> {
            try {
                setIsLoading(true);
                setErrorMessage(null);

                const data =
                    await getSkusBySupplierId(validSupplierId);

                if (!requestWasCancelled) {
                    setSkusBySupplier(data);
                }
            } catch (error) {
                if (requestWasCancelled) {
                    return;
                }

                console.error(
                    "Error retrieving SKUs by supplier: ",
                    error
                );

                // Use empty array
                setSkusBySupplier([]);

                // Ignore results if the component unmounts
                setErrorMessage(
                    "Unable to load SKUs by supplier."
                );
            } finally {
                if (!requestWasCancelled) {
                    setIsLoading(false);
                }
            }
        }

        void loadSkusBySupplier();

        // Ignore results if the component unmounts
        return () => {
            requestWasCancelled = true;
        };
    }, [supplierId]);

    return {
        skusBySupplier,
        errorMessage,
        isLoading
    };
}