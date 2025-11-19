import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function ResetPassword() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      setError('')
      await resetPassword(email)
      setMessage("Check your inbox for reset instructions")
    } catch (err) {
      setError("Failed to reset password")
    }
  }

  return (
    <div className="auth-page">

      <div className="auth-box">

        <div className="auth-logo">
          <img src="/assets/cashpilot-logo.png" alt="CashPilot" />
          <span>CashPilot</span>
        </div>

        <h2>Reset Password</h2>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {message && <p style={{ color: 'green' }}>{message}</p>}

        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            onChange={e => setEmail(e.target.value)}
          />

          <button type="submit">Send Reset Link</button>
        </form>

        <div className="auth-footer">
          Go back to <Link to="/login">Sign In</Link>
        </div>

      </div>

    </div>
  )
}
