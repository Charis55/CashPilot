import React from 'react'

export default function TransactionList({ transactions, onEdit, onDelete }) {

  // Convert Firestore Timestamp → "YYYY-MM-DD"
  function formatDate(date) {
    if (!date) return ""

    // Firestore Timestamp?
    if (date?.toDate) {
      return date.toDate().toISOString().split("T")[0]
    }

    // Already a string
    return date
  }

  return (
    <div className="card">
      <h3>Transactions</h3>

      {transactions.length === 0 && <p>No transactions yet.</p>}

      <table className="transactions-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Category</th>
            <th>Label</th>
            <th>Amount (₦)</th>
            <th>Note</th>
            <th />
          </tr>
        </thead>

        <tbody>
          {transactions.map(t => (
            <tr key={t.id}>

              <td>{formatDate(t.date)}</td>

              <td className={t.type === 'income' ? 'income' : 'expense'}>
                {t.type}
              </td>

              <td>{t.category}</td>

              <th>Label</th>

              <td>{Number(t.amount).toFixed(2)}</td>

              <td>{t.note}</td>

              <td>
                <button onClick={() => onEdit(t)}>Edit</button>
                <button onClick={() => onDelete(t.id)}>Delete</button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
