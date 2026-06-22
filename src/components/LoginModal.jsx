import { useState } from 'react'
import { X, LogIn, Eye, EyeOff } from 'lucide-react'
import { useApp } from '../context/AppContext'

const I = {
  width: '100%',
  background: '#FFFFFF',
  border: '1px solid rgba(255,255,255,0.5)',
  borderRadius: '8px',
  padding: '11px 14px',
  color: '#111111',
  fontSize: '14px',
  fontFamily: "'DM Sans', sans-serif",
  outline: 'none',
  boxSizing: 'border-box',
}
const L = {
  fontSize: '11px',
  fontWeight: 700,
  color: '#111111',
  textTransform: 'uppercase',
  letterSpacing: '0.8px',
  marginBottom: '6px',
  display: 'block',
  fontFamily: "'DM Sans', sans-serif",
}

export default function LoginModal() {
  const { setShowLoginModal, setShowRegisterModal, login } = useApp()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password) { setError('Please enter your email and password.'); return }
    setLoading(true)
    setTimeout(() => {
      const result = login(email.trim(), password)
      setLoading(false)
      if (result.error) setError(result.error)
    }, 400)
  }

  function switchToRegister() {
    setShowLoginModal(false)
    setShowRegisterModal(true)
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
      onClick={(e) => e.target === e.currentTarget && setShowLoginModal(false)}
    >
      <div style={{ background: '#F28E55', borderRadius: '16px', width: '100%', maxWidth: '420px', boxShadow: '0 25px 80px rgba(0,0,0,0.5)', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'rgba(255,255,255,0.25)', borderRadius: '8px', padding: '7px', display: 'flex' }}>
              <LogIn size={16} color="black" />
            </div>
            <div>
              <p style={{ color: '#111111', fontWeight: 700, fontSize: '16px', margin: 0, fontFamily: "'DM Sans', sans-serif" }}>Sign In</p>
              <p style={{ color: '#333333', fontSize: '12px', margin: 0, fontFamily: "'DM Sans', sans-serif" }}>Welcome back to Somalicarhub</p>
            </div>
          </div>
          <button onClick={() => setShowLoginModal(false)}
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#111111', cursor: 'pointer', display: 'flex', padding: '6px', borderRadius: '6px' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.35)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={L}>Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError('') }}
                className="modal-input"
                style={{ ...I, borderColor: error ? 'rgba(255,100,100,0.8)' : 'rgba(255,255,255,0.35)' }}
                autoFocus
              />
            </div>

            <div>
              <label style={L}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError('') }}
                  className="modal-input"
                  style={{ ...I, paddingRight: '44px', borderColor: error ? 'rgba(255,100,100,0.8)' : 'rgba(255,255,255,0.35)' }}
                />
                <button type="button" onClick={() => setShowPw((v) => !v)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'black', display: 'flex', padding: '2px' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,100,100,0.6)', borderRadius: '8px', padding: '10px 14px', color: '#111111', fontSize: '13px', fontFamily: "'DM Sans', sans-serif" }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '12px', background: loading ? '#d0d0d0' : '#E8E8E8', border: 'none', borderRadius: '8px', color: '#000000', fontWeight: 700, fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'background 0.15s' }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = '#d4d4d4' }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = '#E8E8E8' }}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          {/* Footer */}
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <p style={{ color: '#111111', fontSize: '13px', margin: '0 0 6px', fontFamily: "'DM Sans', sans-serif" }}>
              Don&apos;t have an account?{' '}
              <button onClick={switchToRegister}
                style={{ background: 'none', border: 'none', color: '#111111', fontWeight: 700, fontSize: '13px', cursor: 'pointer', padding: 0, fontFamily: "'DM Sans', sans-serif", textDecoration: 'underline' }}>
                Create Account
              </button>
            </p>
            <p style={{ color: '#555555', fontSize: '11px', margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
              Dealer &amp; Staff accounts are set up by the admin.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
