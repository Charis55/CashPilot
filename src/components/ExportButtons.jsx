import React from "react";
import { generateCashPilotPDF } from "../utils/exportPdf";

export default function ExportButtons({
  transactions,
  totals,
  monthlyIncome,
  budget,
  pieChartRef,
  barChartRef,
}) {
  /* ============================================================
       ENHANCED CSV EXPORTER (FULL TRANSACTION DETAILS)
  ============================================================ */
  function exportCSV() {
    if (!transactions.length) return;

    const today = new Date().toISOString().split("T")[0];

    const headers = [
      "Created At",
      "Label",
      "Type",
      "Category",
      "Amount (₦)",
      "Note",
      "User ID",
      "Raw Timestamp"
    ];

    const rows = transactions.map((t) => [
      t.createdAt
        ? new Date(t.createdAt.seconds * 1000).toLocaleString()
        : "N/A",
      t.label || "",
      t.type || "",
      t.category || "",
      Number(t.amount).toLocaleString("en-NG"),
      t.note || "",
      t.userId || "",
      t.createdAt ? t.createdAt.seconds : "N/A",
    ]);

    const csvContent =
      [headers, ...rows]
        .map((r) =>
          r
            .map((field) => `"${String(field).replace(/"/g, '""')}"`)
            .join(",")
        )
        .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `CashPilot-${today}.csv`;
    a.click();
  }

  /* ============================================================
       PDF EXPORT (NOW FULLY WORKING)
  ============================================================ */
  async function exportPDF() {
    if (!transactions.length) {
      alert("No transactions to export.");
      return;
    }

    try {
      console.log("📄 Generating PDF...");

      await generateCashPilotPDF({
        transactions,
        totals,            // 🟢 REQUIRED
        monthlyIncome,     // 🟢 REQUIRED
        budget,            // 🟢 REQUIRED
        charts: {
          pieChartRef,
          barChartRef,
        },
      });

      console.log("✅ PDF exported successfully!");
    } catch (error) {
      console.error("❌ PDF Export Error:", error);
      alert("PDF export failed. Check console for details.");
    }
  }

  return (
    <div className="card">
      <h3>Export Reports</h3>

      <div className="export-buttons">
        <button onClick={exportCSV} disabled={transactions.length === 0}>
          Export Detailed CSV
        </button>

        <button onClick={exportPDF} disabled={transactions.length === 0}>
          Export PDF
        </button>
      </div>
    </div>
  );
}
