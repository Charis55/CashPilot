import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function ExportButtons({
  transactions,
  totals,
  pieChartRef,
  barChartRef,
}) {
  /* --------------------------
      CSV EXPORT
  --------------------------- */
  function exportCSV() {
    if (!transactions.length) return;

    const today = new Date().toISOString().split("T")[0];

    const headers = ["Date", "Type", "Category", "Amount", "Note"];
    const rows = transactions.map((t) => [
      t.date,
      t.type,
      t.category,
      t.amount,
      t.note || "",
    ]);

    const csvContent = [headers, ...rows].map((r) => r.join(",")).join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `CashPilot-${today}.csv`;
    a.click();
  }

  /* --------------------------
      PDF EXPORT
  --------------------------- */
  async function exportPDF() {
    const today = new Date().toISOString().split("T")[0];
    const doc = new jsPDF("p", "pt", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 40;

    /* --------------------------
        HEADER + LOGO
    --------------------------- */
    try {
      const img = await loadLogo("/assets/cashpilot-logo.png");
      doc.addImage(img, "PNG", pageWidth / 2 - 25, y, 50, 50);
    } catch (e) {
      console.warn("Logo not found");
    }

    y += 70;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("CashPilot Financial Report", pageWidth / 2, y, {
      align: "center",
    });

    y += 20;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on: ${today}`, pageWidth / 2, y, { align: "center" });
    y += 30;

    /* --------------------------
        SUMMARY
    --------------------------- */
    doc.setFontSize(16);
    doc.text("Summary Overview", 40, y);
    y += 20;

    doc.setFontSize(12);
    doc.text(`Total Income: ₦${totals.income.toFixed(2)}`, 40, y);
    y += 18;
    doc.text(`Total Expenses: ₦${totals.expense.toFixed(2)}`, 40, y);
    y += 18;
    doc.text(`Balance: ₦${totals.balance.toFixed(2)}`, 40, y);
    y += 30;

    /* --------------------------
        CHARTS (Pie + Bar)
    --------------------------- */
    if (pieChartRef?.current) {
      const img = await captureElement(pieChartRef.current);
      doc.text("Expense Breakdown", 40, y);
      y += 10;
      doc.addImage(img, "PNG", 40, y, 230, 200);
    }

    if (barChartRef?.current) {
      const img = await captureElement(barChartRef.current);
      doc.text("Income vs Expenses", 300, y - 10);
      doc.addImage(img, "PNG", 300, y, 230, 200);
    }

    y += 230;

    /* --------------------------
        TRANSACTIONS TABLE
    --------------------------- */
    doc.setFontSize(16);
    doc.text("Transactions", 40, y);
    y += 15;

    doc.setLineWidth(1);
    doc.line(40, y, pageWidth - 40, y);
    y += 15;

    const headers = ["Date", "Type", "Category", "Amount", "Note"];
    doc.setFontSize(11);

    let rowY = y;

    headers.forEach((h, i) => {
      doc.text(h, 40 + i * 100, rowY);
    });

    rowY += 12;

    transactions.forEach((t) => {
      if (rowY > 760) {
        doc.addPage();
        rowY = 40;
      }

      doc.text(String(t.date).slice(0, 10), 40, rowY);
      doc.text(t.type, 140, rowY);
      doc.text(t.category, 240, rowY);
      doc.text(`₦${Number(t.amount).toFixed(2)}`, 340, rowY);
      doc.text(t.note || "-", 440, rowY);

      rowY += 16;
    });

    doc.save(`CashPilot-${today}.pdf`);
  }

  /* --------------------------
      HELPERS
  --------------------------- */
  function loadLogo(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = reject;
    });
  }

  async function captureElement(el) {
    const canvas = await html2canvas(el, { scale: 2 });
    return canvas.toDataURL("image/png");
  }

  return (
    <div className="card">
      <h3>Export Reports</h3>

      <div className="export-buttons">
        <button onClick={exportCSV} disabled={transactions.length === 0}>
          Export CSV
        </button>

        <button onClick={exportPDF} disabled={transactions.length === 0}>
          Export PDF
        </button>
      </div>
    </div>
  );
}
