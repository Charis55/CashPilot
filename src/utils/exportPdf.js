/* ------------------------------------------------------
   CashPilot Modern PDF Exporter (Clean + Big Logo)
------------------------------------------------------ */

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Format currency properly
const formatCurrency = (amount) =>
  "₦" + Number(amount).toLocaleString("en-NG", { minimumFractionDigits: 2 });

export async function generateCashPilotPDF({
  transactions,
  totals,
  monthlyIncome,
  budget,
  charts,
}) {
  const doc = new jsPDF("p", "pt", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 40;

  /* ---------------------------------------------
     HEADER + BIG LOGO
  --------------------------------------------- */
  const logoPath = "/assets/cashpilot-logo.png";

  try {
    const img = await loadImage(logoPath);
    doc.addImage(img, "PNG", pageWidth / 2 - 60, y, 120, 120); // BIGGER LOGO
  } catch (e) {
    console.warn("Logo failed to load:", e);
  }

  y += 150;

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(22);
  doc.text("CashPilot Financial Report", pageWidth / 2, y, { align: "center" });

  y += 20;

  const today = new Date().toLocaleString();
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`Generated on: ${today}`, pageWidth / 2, y, { align: "center" });

  y += 40;

  /* ---------------------------------------------
     SUMMARY SECTION
  --------------------------------------------- */

  doc.setFontSize(16);
  doc.text("📊 Summary Overview", 40, y);
  y += 20;

  doc.setFontSize(12);
  doc.text(`Total Income:  ${formatCurrency(totals.income)}`, 40, y);
  y += 18;
  doc.text(`Total Expenses: ${formatCurrency(totals.expense)}`, 40, y);
  y += 18;
  doc.text(`Balance:       ${formatCurrency(totals.balance)}`, 40, y);
  y += 18;
  doc.text(`Monthly Income: ${formatCurrency(monthlyIncome)}`, 40, y);
  y += 18;
  doc.text(`Budget:        ${formatCurrency(budget)}`, 40, y);

  y += 30;

  /* ---------------------------------------------
     CHARTS SECTION
  --------------------------------------------- */

  if (charts?.pieChartRef?.current) {
    doc.setFontSize(14);
    doc.text("Expense Breakdown", 40, y);
    const pieImg = await convertToImage(charts.pieChartRef.current);
    y += 10;
    doc.addImage(pieImg, "PNG", 40, y, 220, 200);
  }

  if (charts?.barChartRef?.current) {
    doc.setFontSize(14);
    doc.text("Income vs Expense", 300, y - 10);
    const barImg = await convertToImage(charts.barChartRef.current);
    doc.addImage(barImg, "PNG", 300, y, 220, 200);
  }

  y += 240;

  /* ---------------------------------------------
     TRANSACTIONS TABLE
  --------------------------------------------- */

  doc.setFontSize(16);
  doc.text("📄 Transactions", 40, y);
  y += 15;

  doc.setLineWidth(1);
  doc.line(40, y, pageWidth - 40, y);
  y += 15;

  // Table headers
  doc.setFontSize(12);
  const headers = ["Date", "Type", "Category", "Amount", "Note"];
  const colX = [40, 140, 240, 340, 440];

  headers.forEach((h, i) => doc.text(h, colX[i], y));
  y += 15;

  // Rows
  transactions.forEach((t) => {
    if (y > 770) {
      doc.addPage();
      y = 40;
    }

    doc.text(String(t.date).slice(0, 10), colX[0], y);
    doc.text(t.type, colX[1], y);
    doc.text(t.category, colX[2], y);
    doc.text(formatCurrency(t.amount), colX[3], y);
    doc.text(t.note || "-", colX[4], y);

    y += 18;
  });

  doc.save(`CashPilot-${today}.pdf`);
}

/* ---------------------------------------------
   HELPERS
--------------------------------------------- */

function loadImage(path) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = path;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
}

async function convertToImage(chartEl) {
  const canvas = await html2canvas(chartEl, { scale: 2 });
  return canvas.toDataURL("image/png");
}

/* ---------------------------------------------
   CSV EXPORT
--------------------------------------------- */

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
