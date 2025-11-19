import React, { useEffect, useState } from 'react'
import { 
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../contexts/AuthContext'

const defaultState = {
  label: "",
  type: 'expense',
  amount: '',
  category: '',
  date: '',
  note: '',
}

export default function TransactionForm({ editTransaction, clearEdit }) {
  const [form, setForm] = useState(defaultState)
  const { currentUser } = useAuth()

  useEffect(() => {
    if (editTransaction) {
      const formattedDate =
        editTransaction.date?.toDate
          ? editTransaction.date.toDate().toISOString().split("T")[0]
          : editTransaction.date || ""

      setForm({
        label: editTransaction.label || "",
        type: editTransaction.type,
        amount: editTransaction.amount,
        category: editTransaction.category,
        date: formattedDate,
        note: editTransaction.note || '',
      })
    } else {
      setForm(defaultState)
    }
  }, [editTransaction])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!currentUser) return alert("User not logged in")

    if (!form.label || !form.amount || !form.category || !form.date) {
      return alert("Fill all required fields")
    }

    try {
      const dateValue = new Date(form.date)

      if (editTransaction) {
        const ref = doc(db, "transactions", editTransaction.id)

        await updateDoc(ref, {
          label: form.label,
          type: form.type,
          amount: Number(form.amount),
          category: form.category,
          date: dateValue,
          note: form.note,
          userId: currentUser.uid,
          updatedAt: serverTimestamp(),
        })

        clearEdit()

      } else {
        await addDoc(collection(db, "transactions"), {
          label: form.label,
          type: form.type,
          amount: Number(form.amount),
          category: form.category,
          date: dateValue,
          note: form.note,
          userId: currentUser.uid,
          createdAt: serverTimestamp(),
        })
      }

      setForm(defaultState)

    } catch (error) {
      console.error("🔥 Transaction error:", error)
      alert("Failed to save transaction.")
    }
  }

  return (
    <div className="card">
      <h3>{editTransaction ? 'Edit Transaction' : 'Add Transaction'}</h3>

      <form className="transaction-form" onSubmit={handleSubmit}>

        <label>
          Label (Name)
          <input
            type="text"
            name="label"
            value={form.label}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Type
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </label>

        <label>
          Amount (₦)
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            required
            min="0"
          />
        </label>

        <label>
          Category
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Date
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Note
          <input
            type="text"
            name="note"
            value={form.note}
            onChange={handleChange}
            placeholder="Optional"
          />
        </label>

        <div className="form-actions">
          <button type="submit">
            {editTransaction ? 'Update' : 'Add'}
          </button>

          {editTransaction && (
            <button type="button" onClick={clearEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
