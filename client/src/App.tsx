import { useEffect, useState } from "react";
import type {
  PurchaseOrderDetails,
  LineResult,
  ReceiptRequestBody
} from "../../src/types/types";

import {
  getPurchaseOrders,
  getLineReports,
  recordReceipt
} from "./services/purchaseOrderApi";

// Import tables
import PurchaseOrderTable from "./components/PurchaseOrderTable";
import LineReportTable from "./components/LineReportTable";
import ReceiptForm from "./components/ReceiptForm";

// Import CSS
import "./App.css";


function App() {
  // Store the purchase orders returned by the API
  const [purchaseOrders, setPurchaseOrders] =
    useState<PurchaseOrderDetails[]>([]);

  // Store an error message or null when no error exists
  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  // Track whether the API request is still running
  const [isLoading, setIsLoading] =
    useState<boolean>(true);

  // Store Id of selected purchase order
  const [selectedPurchaseOrderId, setSelectedPurchaseOrderId] =
    useState<number | null>(null);

  // Store selected purchase order's line reports
  const [lineReports, setLineReports] =
    useState<LineResult[]>([]);

  // Track if line report request is running
  const [areLinesLoading, setAreLinesLoading] =
    useState<boolean>(false);

  // Store error if line report request fails
  const [lineErrorMessage, setLineErrorMessage] =
    useState<string | null>(null);

  // Store Id of selected purchase order line
  const [selectedLineId, setSelectedLineId] =
    useState<number | null>(null);

  // Retrieve all purchase orders when the component first loads
  useEffect(() => {
    async function loadPurchaseOrders(): Promise<void> {
      try {
        // Request purchase orders through API
        const data = await getPurchaseOrders();

        setPurchaseOrders(data);
        setErrorMessage(null);
      } catch (error) {
        console.error("Error retrieving purhase orders: ", error);

        setErrorMessage("Unable to load purchase orders.");
      } finally {
        setIsLoading(false);
      }
    }
    loadPurchaseOrders();
  });

  // Retrieve line reports when a purchase order is selected
  useEffect(() => {
    // Do not send request when no order is selected
    if (selectedPurchaseOrderId === null) {
      return;
    }

    // Preserve selected number after null check
    const purchaseOrderId = selectedPurchaseOrderId;

    async function loadLineReports(): Promise<void> {
      try {
        // Reset previous line report request
        setAreLinesLoading(true);
        setLineReports([]);
        setLineErrorMessage(null);
        setSelectedLineId(null);

        // Request the reports for the selected order
        const data = await getLineReports(purchaseOrderId);

        setLineReports(data);
      } catch (error) {
        console.error("Error retrieving line reports: ", error);

        setLineErrorMessage("Unable to load the purchase order lines.");

        setLineReports([]);
      } finally {
        setAreLinesLoading(false);
      }
    }

    loadLineReports();
  }, [selectedPurchaseOrderId]);

  // Record a receipt and replace the matching line report
  async function handleReceiptSubmit(
    lineId: number,
    receipt: ReceiptRequestBody
  ): Promise<void> {
    try {
      setLineErrorMessage(null);

      const updatedLine = await recordReceipt(lineId, receipt);

      // Update with newest report
      setLineReports((currentReports) =>
        currentReports.map((lineReport) =>
          lineReport.purchaseOrderLineId === lineId
            ? updatedLine
            : lineReport
        )
      );

      // Clear the selection and remove the receipt form.
      setSelectedLineId(null);
    } catch (error) {
      console.error("Error recording receipt: ", error);

      setLineErrorMessage("Unable to record the receipt.");
    }
  }

  return (
    <main className="app-container">
      <h1>Receiving Discrepancy Tracker</h1>

      {/*
        Purchase Orders Table
      */}

      {/* Display while purchase orders are loading */}
      {isLoading && <p>Loading purchase orders...</p>}

      {/* Display if the purchase order request fails */}
      {errorMessage && (
        <p className="error-message">{errorMessage}</p>
      )}

      {/* Display the table after a successful request */}
      {!isLoading && !errorMessage && (
        <PurchaseOrderTable
          purchaseOrders={purchaseOrders}
          onSelectOrder={setSelectedPurchaseOrderId}
        />
      )}

      {/* Identify selected purchase order */}
      {selectedPurchaseOrderId !== null && (
        <p>
          Selected Purchase Order ID: {selectedPurchaseOrderId}
        </p>
      )}

      {/*
        Line Reports Table
      */}

      {/* Display while line reports are loading */}
      {areLinesLoading && (
        <p>Loading purchase order lines... </p>
      )}

      {/* Display if line report request fails */}
      {lineErrorMessage && (
        <p className="error-message">{lineErrorMessage}</p>
      )}

      {/* Display reports after a successful request */}
      {selectedPurchaseOrderId !== null &&
        !areLinesLoading &&
        !lineErrorMessage && (
          <LineReportTable
            lineReports={lineReports}
            onSelectLine={setSelectedLineId}
          />
        )}

      {/*
        Receipt Data Entry
      */}

      {/* Display the receipt form for the selected line */}
      {selectedLineId !== null && (
        <ReceiptForm lineId={selectedLineId}
          onSubmit={handleReceiptSubmit} />
      )}
    </main>
  );
}

export default App;