import React, { useState } from "react";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

export default function MonthlyIncomePanel({ income, userId }) {
  const [value, setValue] = useState("");

  async function saveIncome() {
    if (!value || !userId) return;

    const ref = collection(db, "monthlyIncome");

    await addDoc(ref, {
      amount: Number(value),
      userId,
      createdAt: new Date(),
    });

    setValue("");
  }

  return (
    <div className="card">
      <h3>Monthly Income</h3>

      <input
        type="number"
        placeholder="Enter income (₦)"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <button onClick={saveIncome}>Save</button>

      <p style={{ marginTop: "8px" }}>
        Current monthly income:
        <strong style={{ marginLeft: 6 }}>₦{income.toFixed(2)}</strong>
      </p>
    </div>
  );
}
