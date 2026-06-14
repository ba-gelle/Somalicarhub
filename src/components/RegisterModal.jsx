import { useState } from 'react'
import { X, UserPlus, Eye, EyeOff, CheckCircle } from 'lucide-react'
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

export default function RegisterModal() {
  const { setShowRegisterModal, setShowLoginModal, registerSeller } = useApp()
  const [form, setForm]               = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [accountType, setAccountType] = useState('seller')
  const [showPw, setShowPw]           = useState(false)
  const [errors, setErrors]           = useState({})
  const [loading, setLoading]         = useState(false)
  const [success, setSuccess]         = useState(false)

  function set(key, val) {
    setForm((f) => ({ ...f, [key]: val }))
    setErrors((e) => ({ ...e, [key]: undefined, global: undefined }))
  }

  function validate() {
    const e = {}
    if (!form.name.trim())                     e.name     = 'Required'
    if (!form.email.trim())                    e.email    = 'Required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email    = 'Enter a valid email'
    if (!form.phone.trim())                    e.phone    = 'Required'
    if (form.password.length < 6)              e.password = 'Minimum 6 characters'
    if (form.password !== form.confirm)        e.confirm  = 'Passwords do not match'
    return e
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    setTimeout(() => {
      const result = registerSeller({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        role: accountType,
      })
      setLoading(false)
      if (result.error) setErrors({ global: result.error })
      else setSuccess(true)
    }, 500)
  }

  function switchToLogin() {
    setShowRegisterModal(false)
    setShowLoginModal(true)
  }

  const errStyle = { color: '#7f1d1d', fontSize: '11px', margin: '4px 0 0', fontFamily: "'DM Sans', sans-serif" }

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
      onClick={(e) => e.target === e.currentTarget && setShowRegisterModal(false)}
    >
      <div style={{ background: '#F28E55', borderRadius: '16px', width: '100%', maxWidth: '440px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 80px rgba(0,0,0,0.5)' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'rgba(255,255,255,0.25)', borderRadius: '8px', padding: '7px', display: 'flex' }}>
              <UserPlus size={16} color="white" />
            </div>
            <div>
              <p style={{ color: '#111111', fontWeight: 700, fontSize: '16px', margin: 0, fontFamily: "'DM Sans', sans-serif" }}>Create Account</p>
              <p style={{ color: '#333333', fontSize: '12px', margin: 0, fontFamily: "'DM Sans', sans-serif" }}>List your car on Somalicarhub</p>
            </div>
          </div>
          <button onClick={() => setShowRegisterModal(false)}
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#111111', cursor: 'pointer', display: 'flex', padding: '6px', borderRadius: '6px' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.35)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          {success ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <CheckCircle size={28} color="white" />
              </div>
              <p style={{ color: '#111111', fontWeight: 700, fontSize: '18px', margin: '0 0 8px', fontFamily: "'DM Sans', sans-serif" }}>Account Created!</p>
              <p style={{ color: '#333333', fontSize: '14px', margin: '0 0 20px', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6 }}>
                Your account is pending admin review. You&apos;ll be able to list cars once approved. This usually takes 24–48 hours.
              </p>
              <button onClick={switchToLogin}
                style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.25)', border: '1px solid rgba(255,255,255,0.5)', borderRadius: '8px', color: '#111111', fontWeight: 700, fontSize: '14px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.4)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.25)')}>
                Go to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

              <div>
                <label style={L}>Full Name *</label>
                <input placeholder="Your full name" value={form.name} onChange={(e) => set('name', e.target.value)}
                  style={{ ...I, borderColor: errors.name ? 'rgba(255,100,100,0.8)' : 'rgba(255,255,255,0.35)' }} autoFocus />
                {errors.name && <p style={errStyle}>{errors.name}</p>}
              </div>

              <div>
                <label style={L}>Email Address *</label>
                <input type="email" placeholder="you@example.com" value={form.email} onChange={(e) => set('email', e.target.value)}
                  style={{ ...I, borderColor: errors.email ? 'rgba(255,100,100,0.8)' : 'rgba(255,255,255,0.35)' }} />
                {errors.email && <p style={errStyle}>{errors.email}</p>}
              </div>

              <div>
                <label style={L}>Contact Number *</label>
                <input type="tel" placeholder="+252 61 xxx xxxx" value={form.phone} onChange={(e) => set('phone', e.target.value)}
                  style={{ ...I, borderColor: errors.phone ? 'rgba(255,100,100,0.8)' : 'rgba(255,255,255,0.35)' }} />
                {errors.phone && <p style={errStyle}>{errors.phone}</p>}
              </div>

              <div>
                <label style={L}>Password *</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPw ? 'text' : 'password'} placeholder="Min. 6 characters" value={form.password} onChange={(e) => set('password', e.target.value)}
                    style={{ ...I, paddingRight: '44px', borderColor: errors.password ? 'rgba(255,100,100,0.8)' : 'rgba(255,255,255,0.35)' }} />
                  <button type="button" onClick={() => setShowPw((v) => !v)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', display: 'flex', padding: '2px' }}>
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p style={errStyle}>{errors.password}</p>}
              </div>

              <div>
                <label style={L}>Confirm Password *</label>
                <input type={showPw ? 'text' : 'password'} placeholder="Re-enter password" value={form.confirm} onChange={(e) => set('confirm', e.target.value)}
                  style={{ ...I, borderColor: errors.confirm ? 'rgba(255,100,100,0.8)' : 'rgba(255,255,255,0.35)' }} />
                {errors.confirm && <p style={errStyle}>{errors.confirm}</p>}
              </div>

              {/* Account Type */}
              <div>
                <label style={L}>Account Type <span style={{ color: '#666666', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['seller', 'dealer'].map((type) => (
                    <button key={type} type="button" onClick={() => setAccountType(type)}
                      style={{
                        flex: 1, padding: '10px', borderRadius: '8px',
                        border: `1px solid ${accountType === type ? '#ccc' : 'rgba(255,255,255,0.35)'}`,
                        background: '#E8E8E8',
                        color: '#000000', fontWeight: accountType === type ? 700 : 500,
                        fontSize: '13px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                        transition: 'all 0.15s',
                      }}>
                      {type === 'seller' ? '👤 Seller' : '🏢 Dealer'}
                    </button>
                  ))}
                </div>
                <p style={{ color: '#111111', fontSize: '11px', margin: '6px 0 0', fontFamily: "'DM Sans', sans-serif" }}>
                  {accountType === 'dealer' ? 'Dealers can list multiple cars and manage inventory.' : 'Sellers can list individual cars for sale.'}
                </p>
              </div>

              {errors.global && (
                <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,100,100,0.6)', borderRadius: '8px', padding: '10px 14px', color: '#111111', fontSize: '13px', fontFamily: "'DM Sans', sans-serif" }}>
                  {errors.global}
                </div>
              )}

              <div style={{ background: '#E8E8E8', border: 'none', borderRadius: '8px', padding: '10px 14px' }}>
                <p style={{ color: '#111111', fontSize: '12px', margin: 0, lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" }}>
                  📋 Your account will be reviewed by an admin before you can list cars. Browsing is always free and open to everyone.
                </p>
              </div>

              <button type="submit" disabled={loading}
                style={{ width: '100%', padding: '12px', background: loading ? '#d0d0d0' : '#E8E8E8', border: 'none', borderRadius: '8px', color: '#000000', fontWeight: 700, fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'background 0.15s' }}
                onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = '#d4d4d4' }}
                onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = '#E8E8E8' }}>
                {loading ? 'Creating account…' : 'Create Account'}
              </button>

              <p style={{ color: '#111111', fontSize: '13px', textAlign: 'center', margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
                Already have an account?{' '}
                <button type="button" onClick={switchToLogin}
                  style={{ background: 'none', border: 'none', color: '#111111', fontWeight: 700, fontSize: '13px', cursor: 'pointer', padding: 0, fontFamily: "'DM Sans', sans-serif", textDecoration: 'underline' }}>
                  Sign in
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
