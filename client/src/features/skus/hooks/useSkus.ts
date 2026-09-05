import {
    useEffect,
    useState
} from "react";

import type {
    SkuRetrieveBody
} from "../../../../../src/types/types";

import { getSkus } from "../services/skuApi";

export function useSkus() {
    // Store SKUs returned by the API
    const [
        skus,
        setSkus
    ] = useState<SkuRetrieveBody[]>([]);

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

    // Retrieve SKUs when the hook first runs
    useEffect(() => {
        let requestWasCancelled = false;

        async function loadSkus(): Promise<void> {
            try {
                setIsLoading(true);
                setErrorMessage(null);

                const data = 
                    await getSkus();

                    if (!requestWasCancelled) {
                        setSkus(data);
                    }
            } catch (error) {
                if(requestWasCancelled) {
                    return;
                }

                console.error(
                    "Error retrieving SKUs: ", error
                );

                // Use empty array
                setSkus([]);

                setErrorMessage(
                    "Unable to load SKUs."
                );
            } finally {
                if (!requestWasCancelled) {
                    setIsLoading(false);
                }
            }
        }

        void loadSkus();

        // Ignore results if the component unmounts
        return () => {
            requestWasCancelled = true;
        };
    }, []);

    return {
    skus,
    errorMessage,
    isLoading
}
}