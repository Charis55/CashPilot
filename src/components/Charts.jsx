// src/components/Charts.jsx
import React, { useRef } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function Charts({ transactions }) {
  const pieChartRef = useRef(null);
  const barChartRef = useRef(null);

  // compute totals by category for pie
  const categories = {};
  transactions.forEach((t) => {
    if (t.type === "expense") {
      categories[t.category] = (categories[t.category] || 0) + Number(t.amount);
    }
  });

  const pieData = {
    labels: Object.keys(categories),
    datasets: [
      {
        label: "Expenses",
        data: Object.values(categories),
        backgroundColor: ["#4A90E2", "#50E3C2", "#F5A623", "#D0021B", "#9013FE"],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  // income vs expense totals for bar chart
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const barData = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        label: "Amount",
        data: [income, expense],
        backgroundColor: ["#50E3C2", "#D0021B"],
      },
    ],
  };

  return (
    <div className="charts-wrapper">

      {/* Bar Chart */}
      <div className="chart-container">
        <Bar ref={barChartRef} data={barData} />
      </div>

      {/* Pie Chart (ONLY ONE!!) */}
      <div className="chart-container">
        <Pie ref={pieChartRef} data={pieData} />
      </div>
    </div>
  );
}
