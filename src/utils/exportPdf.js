/* ------------------------------------------------------
   CashPilot Modern PDF Exporter using jsPDF + html2canvas
   ------------------------------------------------------ */

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Utility: Format currency
const formatCurrency = (amount) =>
  "₦" + Number(amount).toLocaleString("en-NG", { minimumFractionDigits: 2 });

export async function generateCashPilotPDF({
  transactions,
  summary,
  charts,
}) {
  const doc = new jsPDF("p", "pt", "a4");

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 40;

  /* ------------------------------
     CASH PILOT HEADER + LOGO
  ------------------------------ */

  const logoImg = "/assets/cashpilot-logo.png"; // make sure this path works

  try {
    const img = await loadImage(logoImg);
    doc.addImage(img, "PNG", pageWidth / 2 - 25, y, 50, 50);
  } catch (e) {
    console.warn("Logo failed to load:", e);
  }

  y += 70;

  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("CashPilot Financial Report", pageWidth / 2, y, { align: "center" });

  y += 20;

  const today = new Date().toISOString().split("T")[0];
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated on: ${today}`, pageWidth / 2, y, { align: "center" });

  y += 30;

  /* ------------------------------
     SUMMARY SECTION
  ------------------------------ */

  doc.setFontSize(16);
  doc.text("📊 Summary Overview", 40, y);
  y += 20;

  doc.setFontSize(12);
  doc.text(`Total Income:  ${formatCurrency(summary.totalIncome)}`, 40, y);
  y += 18;
  doc.text(`Total Expenses: ${formatCurrency(summary.totalExpenses)}`, 40, y);
  y += 18;
  doc.text(`Balance:       ${formatCurrency(summary.balance)}`, 40, y);
  y += 30;

  /* ------------------------------
     CHART: PIE + BAR
  ------------------------------ */

  if (charts.pieChartRef?.current) {
    const pieImage = await convertChartToImage(charts.pieChartRef.current);
    doc.setFontSize(14);
    doc.text("Expense Distribution", 40, y);
    y += 10;
    doc.addImage(pieImage, "PNG", 40, y, 220, 200);
  }

  if (charts.barChartRef?.current) {
    const barImage = await convertChartToImage(charts.barChartRef.current);
    doc.setFontSize(14);
    doc.text("Income vs Expenses", 300, y - 10);
    doc.addImage(barImage, "PNG", 300, y, 220, 200);
  }

  y += 230;

  /* ------------------------------
     TRANSACTIONS TABLE
  ------------------------------ */

  doc.setFontSize(16);
  doc.text("📄 Transactions", 40, y);
  y += 15;

  doc.setLineWidth(1);
  doc.line(40, y, pageWidth - 40, y);
  y += 10;

  const headers = ["Date", "Type", "Category", "Amount", "Note"];

  doc.setFontSize(11);
  let rowY = y;

  // Table header
  headers.forEach((h, i) => {
    doc.text(h, 40 + i * 100, rowY);
  });

  rowY += 12;

  transactions.forEach((t) => {
    if (rowY > 760) {
      doc.addPage();
      rowY = 40;
    }

    doc.text(String(t.date).substring(0, 10), 40, rowY);
    doc.text(t.type, 140, rowY);
    doc.text(t.category, 240, rowY);
    doc.text(formatCurrency(t.amount), 340, rowY);
    doc.text(t.note || "-", 440, rowY);

    rowY += 16;
  });

  /* ------------------------------
     SAVE FILE
  ------------------------------ */

  doc.save(`CashPilot-${today}.pdf`);
}

/* ------------------------------
   HELPERS
------------------------------ */

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function convertChartToImage(chartElement) {
  const canvas = await html2canvas(chartElement, { scale: 2 });
  return canvas.toDataURL("image/png");
}
export function exportCSV(transactions) {
  const today = new Date().toISOString().split("T")[0];
  let csv = "Date,Type,Category,Amount,Note\n";

  transactions.forEach((t) => {
    csv += `${t.date},${t.type},${t.category},${t.amount},${t.note || ""}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `CashPilot-${today}.csv`;
  a.click();
}
