import {
    useEffect,
    useState
} from "react";

import type {
    Supplier
} from "../../../../../src/types/types";

import {
    getSuppliers
} from "../services/supplierApi";

export function useSuppliers() {
    // Store suppliers returned by the API
    const [
        suppliers,
        setSuppliers
    ] = useState<Supplier[]>([]);

    // Store an error from retrieving suppliers
    const [
        errorMessage,
        setErrorMessage
    ] = useState<string | null>(null);

    // Track whether suppliers are loading
    const [
        isLoading,
        setIsLoading
    ] = useState<boolean>(true);

    // Retrieve suppliers when the hook first runs
    useEffect(() => {
        let requestWasCancelled = false;

        async function loadSuppliers(): Promise<void> {
            try {
                setIsLoading(true);
                setErrorMessage(null);

                const data =
                    await getSuppliers();

                if (!requestWasCancelled) {
                    setSuppliers(data);
                }
            } catch (error) {
                if (requestWasCancelled) {
                    return;
                }

                console.error(
                    "Error retrieving suppliers: ",
                    error
                );

                // Use empty array
                setSuppliers([]);

                // Ignore results if the component unmounts
                setErrorMessage(
                    "Unable to load suppliers."
                );
            } finally {
                if (!requestWasCancelled) {
                    setIsLoading(false);
                }
            }
        }

        void loadSuppliers();

        return () => {
            requestWasCancelled = true;
        }
    }, []);

    return {
        suppliers,
        errorMessage,
        isLoading
    };
}