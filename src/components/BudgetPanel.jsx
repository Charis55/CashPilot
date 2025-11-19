import React, { useEffect, useState } from 'react'
import { collection, addDoc, doc, setDoc, query, where, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../contexts/AuthContext'

export default function BudgetPanel({ budget, setBudget }) {
  const [input, setInput] = useState(budget || 0)
  const [saving, setSaving] = useState(false)
  const { currentUser } = useAuth()

  useEffect(() => {
    setInput(budget || 0)
  }, [budget])

  async function handleSave(e) {
    e.preventDefault()
    if (!currentUser) return alert("User not logged in")

    setSaving(true)

    try {
      const userId = currentUser.uid

      // Search if this user already has a budget doc
      const q = query(collection(db, 'budgets'), where('userId', '==', userId))
      const snapshot = await getDocs(q)

      if (!snapshot.empty) {
        // Update existing document
        const ref = doc(db, 'budgets', snapshot.docs[0].id)
        await setDoc(ref, { userId, amount: Number(input) }, { merge: true })
      } else {
        // Create new budget document
        await addDoc(collection(db, 'budgets'), {
          userId,
          amount: Number(input),
        })
      }

      setBudget(Number(input))

    } catch (error) {
      console.error("Error saving budget:", error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="card">
      <h3>Monthly Budget</h3>

      <form className="budget-form" onSubmit={handleSave}>
        <input
          type="number"
          min="0"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Set budget (₦)"
        />

        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </button>
      </form>

      <p>Current budget: ₦{Number(budget || 0).toFixed(2)}</p>
    </div>
  )
}
