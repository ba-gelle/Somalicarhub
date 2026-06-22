import { useState } from 'react'
import { CheckCircle, XCircle, Trash2, Tag, AlertCircle, Users, UserPlus, Eye, EyeOff, Car, TrendingUp, Clock, ShieldCheck, Settings, KeyRound, Ban, RefreshCw, Bell, Mail, ScrollText } from 'lucide-react'
import { useApp, DEFAULT_PERMISSIONS, REJECT_REASONS } from '../context/AppContext'

// ── Shared helpers ────────────────────────────────────────────────────────────

const ROLE_COLOR = {
  admin:  { bg: '#E61534', color: '#ffffff' },
  dealer: { bg: '#14F77B', color: '#000000' },
  staff:  { bg: '#FAB300', color: '#000000' },
  seller: { bg: '#451a03', color: '#fdba74' },
}

const PERM_DEFS = [
  { key: 'addListing',      label: 'Add Listings',    group: 'Listings' },
  { key: 'approveListings', label: 'Approve/Reject',  group: 'Listings' },
  { key: 'markSold',        label: 'Mark as Sold',    group: 'Listings' },
  { key: 'deleteListings',  label: 'Delete Listings', group: 'Listings' },
  { key: 'editListings',    label: 'Edit Listings',   group: 'Listings' },
  { key: 'manageUsers',        label: 'Manage Users',          group: 'Users'    },
  { key: 'createUsers',        label: 'Create Users',          group: 'Users'    },
  { key: 'suspendDeleteUsers', label: 'Suspend / Delete Users', group: 'Users'    },
  { key: 'viewAnalytics',      label: 'View Analytics',        group: 'Reports'  },
]

function StatusBadge({ status }) {
  const MAP = {
    active:    { bg: '#08C94F', color: '#ffffff', label: 'ACTIVE'    },
    sold:      { bg: '#1c1917', color: '#a8a29e', label: 'SOLD'      },
    pending:   { bg: '#451a03', color: '#fb923c', label: 'PENDING'   },
    rejected:  { bg: '#F50F0F', color: '#ffffff', label: 'REJECTED'  },
    suspended: { bg: '#1e1b4b', color: '#a5b4fc', label: 'SUSPENDED' },
  }
  const s = MAP[status] || MAP.active
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '9999px', fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.5px' }}>
      {s.label}
    </span>
  )
}

// ── Notify helpers ────────────────────────────────────────────────────────────

function buildRejectMsg(car, reason) {
  return `Dear ${car.dealerName || 'Dealer'},\n\nYour car listing "${car.name}" submitted to Somalicarhub has been rejected.\n\nReason: ${reason}\n\nPlease fix the issue and resubmit your listing.\n\nRegards,\nSomalicarhub Team`
}

function waHref(phone, msg) {
  const num = phone.replace(/\D/g, '')
  return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`
}

function mailHref(email, carName, msg) {
  return `mailto:${email}?subject=${encodeURIComponent(`Your listing "${carName}" was rejected – Somalicarhub`)}&body=${encodeURIComponent(msg)}`
}

// WhatsApp inline SVG icon
function WaIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

// ── Pending card ──────────────────────────────────────────────────────────────

function PendingCard({ car }) {
  const { approveCar, rejectCar } = useApp()
  const [rejecting, setRejecting]       = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [notifying, setNotifying]       = useState(false)

  function goToNotify() {
    if (!rejectReason) return
    setNotifying(true)
  }

  function doReject() {
    rejectCar(car.id, rejectReason)
    setNotifying(false)
    setRejecting(false)
    setRejectReason('')
  }

  const msg = rejectReason ? buildRejectMsg(car, rejectReason) : ''

  return (
    <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
        <div>
          <p style={{ color: 'white', fontWeight: 700, fontSize: '14px', margin: '0 0 4px', fontFamily: "'DM Sans', sans-serif" }}>{car.name}</p>
          <p style={{ color: '#3b82f6', fontWeight: 700, fontSize: '16px', margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{car.price}</p>
        </div>
        <StatusBadge status={car.status} />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {[car.year, car.km, car.fuel, car.trans, car.location].map((v) => (
          <span key={v} style={{ background: '#1e293b', color: '#94a3b8', fontSize: '11px', padding: '3px 8px', borderRadius: '4px', fontFamily: "'DM Sans', sans-serif" }}>{v}</span>
        ))}
      </div>
      {car.dealerName && (
        <p style={{ color: '#64748b', fontSize: '12px', margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
          Submitted by: <span style={{ color: '#94a3b8' }}>{car.dealerName}</span>
          {car.submitterEmail && <span style={{ color: '#475569' }}> · {car.submitterEmail}</span>}
        </p>
      )}

      {/* Step 1 — reason picker */}
      {rejecting && !notifying && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#1a0808', border: '1px solid #7f1d1d', borderRadius: '8px', padding: '10px 12px' }}>
          <p style={{ color: '#fca5a5', fontSize: '11px', fontWeight: 700, margin: 0, fontFamily: "'DM Sans', sans-serif", textTransform: 'uppercase', letterSpacing: '0.6px' }}>
            Select rejection reason *
          </p>
          {REJECT_REASONS.map((r) => (
            <label key={r} onClick={() => setRejectReason(r)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '6px 8px', borderRadius: '6px', background: rejectReason === r ? 'rgba(220,38,38,0.2)' : 'transparent', border: `1px solid ${rejectReason === r ? '#dc2626' : 'transparent'}`, transition: 'all 0.15s' }}>
              <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: `2px solid ${rejectReason === r ? '#f87171' : '#475569'}`, background: rejectReason === r ? '#dc2626' : 'transparent', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {rejectReason === r && <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'white' }} />}
              </div>
              <span style={{ color: rejectReason === r ? '#fca5a5' : '#94a3b8', fontSize: '12px', fontFamily: "'DM Sans', sans-serif" }}>{r}</span>
            </label>
          ))}
        </div>
      )}

      {/* Step 2 — notify dealer */}
      {notifying && (
        <div style={{ background: '#0a1628', border: '1px solid #1d4ed8', borderRadius: '10px', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <p style={{ color: '#93c5fd', fontSize: '12px', fontWeight: 700, margin: 0, fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Bell size={13} /> Notify the dealer about rejection?
          </p>
          <p style={{ color: '#475569', fontSize: '11px', margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
            Reason: <span style={{ color: '#f87171', fontWeight: 600 }}>{rejectReason}</span>
          </p>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {car.submitterPhone && (
              <a href={waHref(car.submitterPhone, msg)} target="_blank" rel="noreferrer" onClick={doReject}
                style={{ flex: 1, minWidth: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '8px 10px', background: '#14532d', border: '1px solid #16a34a', borderRadius: '7px', color: '#4ade80', fontWeight: 600, fontSize: '12px', cursor: 'pointer', textDecoration: 'none', fontFamily: "'DM Sans', sans-serif" }}>
                <WaIcon /> WhatsApp
              </a>
            )}
            {car.submitterEmail && (
              <a href={mailHref(car.submitterEmail, car.name, msg)} onClick={doReject}
                style={{ flex: 1, minWidth: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '8px 10px', background: '#1d3a8a', border: '1px solid #3b82f6', borderRadius: '7px', color: '#93c5fd', fontWeight: 600, fontSize: '12px', cursor: 'pointer', textDecoration: 'none', fontFamily: "'DM Sans', sans-serif" }}>
                <Mail size={13} /> Email
              </a>
            )}
            <button onClick={doReject}
              style={{ flex: 1, minWidth: '80px', padding: '8px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '7px', color: '#94a3b8', fontWeight: 600, fontSize: '12px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
              Skip
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px' }}>
        {!rejecting && !notifying && (
          <>
            <button onClick={() => approveCar(car.id)}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '9px', background: '#14532d', border: '1px solid #16a34a', borderRadius: '8px', color: '#4ade80', fontWeight: 600, fontSize: '13px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#166534')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#14532d')}>
              <CheckCircle size={14} /> Approve
            </button>
            <button onClick={() => setRejecting(true)}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '9px', background: '#3b0a0a', border: '1px solid #dc2626', borderRadius: '8px', color: '#f87171', fontWeight: 600, fontSize: '13px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#450a0a')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#3b0a0a')}>
              <XCircle size={14} /> Reject
            </button>
          </>
        )}
        {rejecting && !notifying && (
          <>
            <button onClick={goToNotify} disabled={!rejectReason}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '9px', background: rejectReason ? '#dc2626' : '#3b1212', border: `1px solid ${rejectReason ? '#dc2626' : '#5a1a1a'}`, borderRadius: '8px', color: rejectReason ? 'white' : '#7f1d1d', fontWeight: 700, fontSize: '13px', cursor: rejectReason ? 'pointer' : 'not-allowed', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.15s' }}>
              <XCircle size={14} /> Confirm Reject
            </button>
            <button onClick={() => { setRejecting(false); setRejectReason('') }}
              style={{ padding: '9px 14px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#94a3b8', fontWeight: 600, fontSize: '13px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// ── Manage row ────────────────────────────────────────────────────────────────

function ManagementRow({ car, isRejected = false }) {
  const { markSold, deleteCar } = useApp()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const STATUS_STYLE = {
    active:    { bg: '#C73F10', color: '#ffffff' },
    sold:      { bg: '#1c1917', color: '#a8a29e' },
    pending:   { bg: '#451a03', color: '#fb923c' },
    rejected:  { bg: '#F0A418', color: '#000000' },
    suspended: { bg: '#1e1b4b', color: '#a5b4fc' },
  }
  const ss = STATUS_STYLE[car.status] || STATUS_STYLE.pending
  const delBg   = isRejected ? '#F0A418' : '#E8C310'
  const delBdr  = isRejected ? '#c98510' : '#c9a800'
  const delClr  = '#000000'
  const delHov  = isRejected ? '#659BF0' : '#d4b000'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '10px' }}>
      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: car.carColor, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: '#000000', fontWeight: 600, fontSize: '14px', margin: 0, fontFamily: "'DM Sans', sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{car.name}</p>
        <p style={{ color: isRejected ? '#F50F0F' : '#000000', fontSize: '12px', margin: '2px 0 0', fontFamily: "'DM Sans', sans-serif" }}>{car.price} · {car.year} · {car.location}</p>
        {car.status === 'rejected' && car.rejectReason && (
          <p style={{ color: '#f87171', fontSize: '11px', margin: '3px 0 0', fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', gap: '4px' }}>
            <XCircle size={11} /> {car.rejectReason}
          </p>
        )}
      </div>
      <span style={{ background: ss.bg, color: ss.color, fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '9999px', fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.5px' }}>
        {(car.status || 'pending').toUpperCase()}
      </span>
      <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
        {car.status === 'active' && (
          <button onClick={() => markSold(car.id)}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 12px', background: '#f97316', border: '1px solid #ea6c00', borderRadius: '7px', color: '#ffffff', fontWeight: 600, fontSize: '12px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#ea6c00')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#f97316')}>
            <Tag size={12} /> Mark Sold
          </button>
        )}
        {!confirmDelete ? (
          <button onClick={() => setConfirmDelete(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 12px', background: delBg, border: `1px solid ${delBdr}`, borderRadius: '7px', color: delClr, fontWeight: 600, fontSize: '12px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = delHov)}
            onMouseLeave={(e) => (e.currentTarget.style.background = delBg)}>
            <Trash2 size={12} /> Delete
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '4px' }}>
            <button onClick={() => deleteCar(car.id)}
              style={{ padding: '7px 10px', background: '#dc2626', border: 'none', borderRadius: '7px', color: 'white', fontWeight: 700, fontSize: '12px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
              Confirm
            </button>
            <button onClick={() => setConfirmDelete(false)}
              style={{ padding: '7px 10px', background: '#e5e7eb', border: '1px solid #d1d5db', borderRadius: '7px', color: '#374151', fontWeight: 600, fontSize: '12px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

function Dashboard() {
  const { cars, users, approveCar, rejectCar, approveUser, rejectUser, setAdminTab, role, canApprove, canManageUsers, currentUser, auditLog } = useApp()
  const isFullAdmin  = role === 'admin'
  const isSuperAdmin = currentUser?.superAdmin === true

  const active       = cars.filter((c) => c.status === 'active').length
  const sold         = cars.filter((c) => c.status === 'sold').length
  const pending      = cars.filter((c) => c.status === 'pending')
  const rejected     = cars.filter((c) => c.status === 'rejected').length
  const totalUsers   = users.length
  const pendingUsers = users.filter((u) => u.status === 'pending')

  const BASE_CARDS = [
    { label: 'Active Listings', value: active,         icon: <Car size={18} />,       color: '#FFFFFF', bg: 'rgba(255,255,255,0.08)', tab: 'manage'    },
    { label: 'Cars Sold',       value: sold,           icon: <TrendingUp size={18} />, color: '#FFFFFF', bg: 'rgba(255,255,255,0.08)', tab: 'manage'    },
    { label: 'Pending Review',  value: pending.length, icon: <Clock size={18} />,      color: '#FFFFFF', bg: 'rgba(255,255,255,0.08)', tab: 'dashboard' },
  ]
  const ADMIN_CARDS = [
    { label: 'Total Users', value: totalUsers, icon: <Users size={18} />, color: '#FFFFFF', bg: 'rgba(255,255,255,0.08)', tab: 'users' },
  ]
  const STAT_CARDS = isFullAdmin ? [...BASE_CARDS, ...ADMIN_CARDS] : BASE_CARDS

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${STAT_CARDS.length}, 1fr)`, gap: '12px' }}>
        {STAT_CARDS.map(({ label, value, icon, color, bg, tab }) => (
          <div key={label} onClick={() => setAdminTab(tab)}
            style={{ background: '#0D0C0C', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', padding: '16px', cursor: 'pointer', transition: 'border-color 0.15s, transform 0.15s' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#000000'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(0)' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color, marginBottom: '10px' }}>
              {icon}
            </div>
            <p style={{ color: '#FFFFFF', fontWeight: 800, fontSize: '24px', margin: '0 0 2px', fontFamily: "'DM Sans', sans-serif" }}>{value}</p>
            <p style={{ color: '#FFFFFF', fontSize: '12px', margin: 0, fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', gap: '4px' }}>
              {label} <span style={{ color, fontSize: '10px' }}>→</span>
            </p>
          </div>
        ))}
      </div>

      {/* Pending car approvals — admin + users with approveListings */}
      {(isFullAdmin || canApprove) && (
        <div>
          <h3 style={{ color: '#000000', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '15px', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={15} /> Pending Car Approvals ({pending.length})
          </h3>
          {pending.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', background: '#EDEDED', border: '1px solid #000000', borderRadius: '12px' }}>
              <CheckCircle size={32} color="#FF8D00" style={{ margin: '0 auto 10px', display: 'block' }} />
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: '#000000' }}>All caught up — no pending listings.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
              {pending.map((c) => <PendingCard key={c.id} car={c} />)}
            </div>
          )}
        </div>
      )}

      {/* Pending user registrations — admin + staff with manageUsers */}
      {canManageUsers && pendingUsers.length > 0 && (
        <div>
          <h3 style={{ color: '#a78bfa', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '15px', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={15} /> Pending User Registrations ({pendingUsers.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {pendingUsers.map((u) => (
              <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: '#FEFCE8', border: '1px solid #1300FF', borderRadius: '10px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: '#000000', fontWeight: 600, fontSize: '14px', margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{u.name}</p>
                  <p style={{ color: '#E61534', fontSize: '12px', margin: '2px 0 0', fontFamily: "'DM Sans', sans-serif" }}>{u.email}{u.phone ? ` · ${u.phone}` : ''}</p>
                </div>
                <span style={{ background: '#451a03', color: '#fdba74', fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '9999px', fontFamily: "'DM Sans', sans-serif", flexShrink: 0 }}>
                  {(u.role || 'seller').toUpperCase()}
                </span>
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  <button onClick={() => approveUser(u.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 12px', background: '#14532d', border: '1px solid #16a34a', borderRadius: '7px', color: '#4ade80', fontWeight: 600, fontSize: '12px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#166534')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#14532d')}>
                    <CheckCircle size={12} /> Approve
                  </button>
                  <button onClick={() => rejectUser(u.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 12px', background: '#3b0a0a', border: '1px solid #dc2626', borderRadius: '7px', color: '#f87171', fontWeight: 600, fontSize: '12px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#450a0a')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#3b0a0a')}>
                    <XCircle size={12} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rejected summary — full admin only */}
      {isFullAdmin && rejected > 0 && (
        <p style={{ color: '#000000', fontSize: '13px', fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
          <XCircle size={13} style={{ verticalAlign: 'middle', marginRight: '6px', color: '#000000' }} />
          {rejected} listing{rejected > 1 ? 's' : ''} rejected — view in the <strong style={{ color: '#000000' }}>Rejected</strong> tab.
        </p>
      )}

      {/* Audit Log summary — super admin only */}
      {isSuperAdmin && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h3 style={{ color: '#000000', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '15px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ScrollText size={15} color="#E61534" /> Recent Admin Actions
            </h3>
            {auditLog.length > 5 && (
              <button onClick={() => setAdminTab('audit')}
                style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                View all ({auditLog.length}) →
              </button>
            )}
          </div>
          {auditLog.length === 0 ? (
            <div style={{ padding: '18px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', textAlign: 'center' }}>
              <p style={{ color: '#94a3b8', fontSize: '13px', fontFamily: "'DM Sans', sans-serif", margin: 0 }}>No admin actions recorded yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {auditLog.slice(0, 5).map((entry) => {
                const timeAgo = (() => {
                  const diff = Date.now() - new Date(entry.timestamp).getTime()
                  const m = Math.floor(diff / 60000)
                  if (m < 1)  return 'just now'
                  if (m < 60) return `${m}m ago`
                  const h = Math.floor(m / 60)
                  if (h < 24) return `${h}h ago`
                  return `${Math.floor(h / 24)}d ago`
                })()
                const actionLabel = entry.type === 'user_suspended' ? 'suspended' : entry.type === 'user_deleted' ? 'deleted' : 'changed permissions of'
                const cardBorder  = entry.type === 'user_deleted' ? '#fecaca' : entry.type === 'user_suspended' ? '#fde68a' : '#e5e7eb'
                return (
                  <div key={entry.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 14px', background: '#ffffff', border: `1px solid ${cardBorder}`, borderRadius: '9px' }}>
                    <ScrollText size={13} color="#E61534" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: '12px', fontFamily: "'DM Sans', sans-serif", color: '#000000' }}>
                        <strong>{entry.actorName}</strong>
                        <span style={{ background: ROLE_COLOR[entry.actorRole]?.bg || '#e5e7eb', color: ROLE_COLOR[entry.actorRole]?.color || '#000', fontSize: '9px', fontWeight: 700, padding: '1px 6px', borderRadius: '9999px', margin: '0 5px', fontFamily: "'DM Sans', sans-serif" }}>
                          {entry.actorRole.toUpperCase()}
                        </span>
                        {actionLabel} <strong>{entry.targetName}</strong>
                        <span style={{ background: ROLE_COLOR[entry.targetRole]?.bg || '#e5e7eb', color: ROLE_COLOR[entry.targetRole]?.color || '#000', fontSize: '9px', fontWeight: 700, padding: '1px 6px', borderRadius: '9999px', margin: '0 0 0 5px', fontFamily: "'DM Sans', sans-serif" }}>
                          {entry.targetRole.toUpperCase()}
                        </span>
                      </p>
                      {entry.type === 'permissions_changed' && entry.changes && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '5px' }}>
                          {Object.entries(entry.changes).map(([key, { to }]) => (
                            <span key={key} style={{ fontSize: '10px', fontWeight: 600, padding: '2px 6px', borderRadius: '5px', fontFamily: "'DM Sans', sans-serif", background: to ? 'rgba(8,201,79,0.12)' : 'rgba(229,64,64,0.12)', color: to ? '#059669' : '#E54040', border: `1px solid ${to ? '#6ee7b7' : '#fca5a5'}` }}>
                              {to ? '✓' : '✗'} {PERM_LABELS[key] || key}
                            </span>
                          ))}
                        </div>
                      )}
                      {entry.reason && (
                        <p style={{ margin: '5px 0 0', fontSize: '10px', fontFamily: "'DM Sans', sans-serif", color: '#374151' }}>
                          <strong>Reason:</strong> {entry.reason}
                        </p>
                      )}
                    </div>
                    <span style={{ color: '#94a3b8', fontSize: '10px', fontFamily: "'DM Sans', sans-serif", flexShrink: 0, whiteSpace: 'nowrap' }}>{timeAgo}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── User Row (expandable edit) ────────────────────────────────────────────────

function UserRow({ user }) {
  const { approveUser, rejectUser, suspendUser, reactivateUser, removeUser, changeUserPassword, updateUserPermissions, currentUser, canSuspendDeleteUsers } = useApp()
  const [expanded, setExpanded]       = useState(false)
  const [perms, setPerms]             = useState(() => ({ ...(user.permissions ?? DEFAULT_PERMISSIONS[user.role] ?? {}) }))
  const [newPw, setNewPw]             = useState('')
  const [showPw, setShowPw]           = useState(false)
  const [permsSaved, setPermsSaved]   = useState(false)
  const [pwSaved, setPwSaved]         = useState(false)
  const [pwErr, setPwErr]             = useState('')
  const [confirmSuspend, setConfirmSuspend] = useState(false)
  const [confirmDelete, setConfirmDelete]   = useState(false)
  const [suspendReason, setSuspendReason]   = useState('')
  const [deleteReason, setDeleteReason]     = useState('')
  const [permReason, setPermReason]         = useState('')
  const [showPermReason, setShowPermReason] = useState(false)

  const rc = ROLE_COLOR[user.role] || ROLE_COLOR.seller
  const isSelf = user.id === currentUser?.id

  const iAmSuperAdmin    = currentUser?.role === 'admin' && currentUser?.superAdmin === true
  const iAmFullAdmin     = currentUser?.role === 'admin'
  const isTargetSuperAdmin = user.role === 'admin' && user.superAdmin === true
  const isTargetAdmin    = user.role === 'admin'

  // Only super admins can act on other admins — no one else can touch any admin account
  const blockedByHierarchy = isTargetAdmin && !iAmSuperAdmin

  const canActOnThisUser = canSuspendDeleteUsers && !isSelf && !blockedByHierarchy

  function savePerms() {
    updateUserPermissions(user.id, perms, permReason)
    setPermReason('')
    setShowPermReason(false)
    setPermsSaved(true)
    setTimeout(() => setPermsSaved(false), 2500)
  }

  function savePw() {
    if (newPw.length < 6) { setPwErr('Min 6 characters'); return }
    setPwErr('')
    changeUserPassword(user.id, newPw)
    setNewPw('')
    setPwSaved(true)
    setTimeout(() => setPwSaved(false), 2500)
  }

  return (
    <div style={{ marginBottom: '8px' }}>
      {/* Clickable row — shows role + status only */}
      <div onClick={() => setExpanded((v) => !v)}
        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: '#FFFFFF', border: '1px solid #e5e7eb', borderRadius: expanded ? '10px 10px 0 0' : '10px', cursor: 'pointer', userSelect: 'none' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000000', fontSize: '11px', fontWeight: 700, fontFamily: "'DM Sans', sans-serif", flexShrink: 0 }}>
          {user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: '#000000', fontWeight: 600, fontSize: '13px', margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{user.name}</p>
          <p style={{ color: '#E61534', fontSize: '11px', margin: '1px 0 0', fontFamily: "'DM Sans', sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}{user.phone ? ` · ${user.phone}` : ''}</p>
        </div>
        <span style={{ background: rc.bg, color: rc.color, fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '9999px', fontFamily: "'DM Sans', sans-serif", flexShrink: 0 }}>{user.role.toUpperCase()}</span>
        <StatusBadge status={user.status} />
      </div>

      {/* Expanded panel */}
      {expanded && (
        <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderTop: 'none', borderRadius: '0 0 10px 10px', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* ── Action buttons ── */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
            {user.status === 'pending' && (
              <button onClick={() => approveUser(user.id)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', background: '#08C94F', border: '1px solid #06a340', borderRadius: '7px', color: '#ffffff', fontWeight: 600, fontSize: '12px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                <CheckCircle size={13} /> Approve
              </button>
            )}
            {canActOnThisUser && user.status === 'active' && !confirmSuspend && (
              <button onClick={() => setConfirmSuspend(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', background: '#EBC51E', border: '1px solid #c9a800', borderRadius: '7px', color: '#000000', fontWeight: 600, fontSize: '12px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                <Ban size={13} /> Suspend
              </button>
            )}
            {canActOnThisUser && confirmSuspend && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px 12px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', width: '100%' }}>
                <span style={{ color: '#000000', fontSize: '12px', fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>Suspend this user?</span>
                <textarea
                  autoFocus
                  placeholder="Reason for suspending (required)"
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                  rows={2}
                  style={{ width: '100%', borderRadius: '6px', border: '1px solid #d1d5db', padding: '6px 10px', fontSize: '12px', fontFamily: "'DM Sans', sans-serif", resize: 'vertical', boxSizing: 'border-box' }}
                />
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    disabled={!suspendReason.trim()}
                    onClick={() => { suspendUser(user.id, suspendReason.trim()); setConfirmSuspend(false); setSuspendReason('') }}
                    style={{ padding: '5px 12px', background: suspendReason.trim() ? '#E54040' : '#d1d5db', border: 'none', borderRadius: '6px', color: '#ffffff', fontWeight: 700, fontSize: '12px', cursor: suspendReason.trim() ? 'pointer' : 'not-allowed', fontFamily: "'DM Sans', sans-serif" }}>
                    Confirm Suspend
                  </button>
                  <button onClick={() => { setConfirmSuspend(false); setSuspendReason('') }}
                    style={{ padding: '5px 12px', background: '#e5e7eb', border: '1px solid #d1d5db', borderRadius: '6px', color: '#374151', fontWeight: 600, fontSize: '12px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Cancel</button>
                </div>
              </div>
            )}
            {canActOnThisUser && user.status === 'suspended' && (
              <button onClick={() => reactivateUser(user.id)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', background: '#08C94F', border: '1px solid #06a340', borderRadius: '7px', color: '#ffffff', fontWeight: 600, fontSize: '12px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                <RefreshCw size={13} /> Reactivate
              </button>
            )}
            {!isSelf && user.status === 'suspended' && !canActOnThisUser && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#94a3b8', fontFamily: "'DM Sans', sans-serif", padding: '6px 10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '7px' }}>
                <Ban size={12} /> {blockedByHierarchy ? 'Protected — higher-level account' : 'No permission to reactivate'}
              </span>
            )}
            {canActOnThisUser && (!confirmDelete ? (
              <button onClick={() => setConfirmDelete(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', background: '#E54040', border: '1px solid #c03030', borderRadius: '7px', color: '#ffffff', fontWeight: 600, fontSize: '12px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                <Trash2 size={13} /> Delete User
              </button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px 12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', width: '100%' }}>
                <span style={{ color: '#000000', fontSize: '12px', fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>Delete this user?</span>
                <textarea
                  autoFocus
                  placeholder="Reason for deleting (required)"
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  rows={2}
                  style={{ width: '100%', borderRadius: '6px', border: '1px solid #d1d5db', padding: '6px 10px', fontSize: '12px', fontFamily: "'DM Sans', sans-serif", resize: 'vertical', boxSizing: 'border-box' }}
                />
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    disabled={!deleteReason.trim()}
                    onClick={() => { removeUser(user.id, deleteReason.trim()); setConfirmDelete(false); setDeleteReason('') }}
                    style={{ padding: '5px 12px', background: deleteReason.trim() ? '#E54040' : '#d1d5db', border: 'none', borderRadius: '6px', color: '#ffffff', fontWeight: 700, fontSize: '12px', cursor: deleteReason.trim() ? 'pointer' : 'not-allowed', fontFamily: "'DM Sans', sans-serif" }}>
                    Confirm Delete
                  </button>
                  <button onClick={() => { setConfirmDelete(false); setDeleteReason('') }}
                    style={{ padding: '5px 12px', background: '#e5e7eb', border: '1px solid #d1d5db', borderRadius: '6px', color: '#374151', fontWeight: 600, fontSize: '12px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Cancel</button>
                </div>
              </div>
            ))}
          </div>

          {/* Permissions — admin only */}
          {currentUser?.role === 'admin' ? (
            <div>
              <p style={{ color: '#000000', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 12px', fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={13} /> Permissions
              </p>
              {['Listings', 'Users', 'Reports'].map((group) => (
                <div key={group} style={{ marginBottom: '10px' }}>
                  <p style={{ color: '#000000', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 6px', fontFamily: "'DM Sans', sans-serif" }}>{group}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {PERM_DEFS.filter((p) => p.group === group).map(({ key, label }) => (
                      <label key={key} onClick={() => setPerms((p) => ({ ...p, [key]: !p[key] }))}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', background: perms[key] ? 'rgba(227,96,5,0.12)' : '#ffffff', border: `1px solid ${perms[key] ? '#E36005' : '#000000'}`, borderRadius: '7px', padding: '5px 10px', userSelect: 'none', transition: 'all 0.15s' }}>
                        <div style={{ width: '13px', height: '13px', borderRadius: '3px', background: perms[key] ? '#E36005' : '#ffffff', border: '2px solid #000000', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {perms[key] && <CheckCircle size={9} color="white" />}
                        </div>
                        <span style={{ color: '#111827', fontSize: '12px', fontWeight: 500, fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <div style={{ marginTop: '8px' }}>
                {showPermReason ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px 12px', background: '#f0f4ff', border: '1px solid #c7d2fe', borderRadius: '8px' }}>
                    <span style={{ color: '#000000', fontSize: '12px', fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>Reason for permission change (required)</span>
                    <input
                      autoFocus
                      placeholder="e.g. Promoting to senior staff"
                      value={permReason}
                      onChange={(e) => setPermReason(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && permReason.trim()) savePerms() }}
                      style={{ width: '100%', borderRadius: '6px', border: '1px solid #c7d2fe', padding: '7px 10px', fontSize: '12px', fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box' }}
                    />
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button
                        disabled={!permReason.trim()}
                        onClick={savePerms}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', background: permReason.trim() ? '#1d3a8a' : '#d1d5db', border: '1px solid #3b5bdb', borderRadius: '7px', color: '#93c5fd', fontWeight: 600, fontSize: '12px', cursor: permReason.trim() ? 'pointer' : 'not-allowed', fontFamily: "'DM Sans', sans-serif" }}>
                        <ShieldCheck size={12} /> Confirm Save
                      </button>
                      <button onClick={() => { setShowPermReason(false); setPermReason('') }}
                        style={{ padding: '7px 12px', background: '#e5e7eb', border: '1px solid #d1d5db', borderRadius: '7px', color: '#374151', fontWeight: 600, fontSize: '12px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Cancel</button>
                      {permsSaved && <span style={{ color: '#4ade80', fontSize: '12px', fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={12} /> Saved</span>}
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button onClick={() => setShowPermReason(true)}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', background: '#1d3a8a', border: '1px solid #3b5bdb', borderRadius: '7px', color: '#93c5fd', fontWeight: 600, fontSize: '12px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                      <ShieldCheck size={12} /> Save Permissions
                    </button>
                    {permsSaved && <span style={{ color: '#4ade80', fontSize: '12px', fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={12} /> Saved</span>}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
              <ShieldCheck size={13} color="#94a3b8" />
              <span style={{ color: '#94a3b8', fontSize: '12px', fontFamily: "'DM Sans', sans-serif" }}>Permission management is restricted to admins.</span>
            </div>
          )}

          {/* Change password — admin only */}
          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
            {currentUser?.role === 'admin' ? (
              <>
                <p style={{ color: '#000000', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 10px', fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <KeyRound size={13} /> Change Password
                </p>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <input type="password" placeholder="New password (min. 6 chars)" value={newPw} onChange={(e) => { setNewPw(e.target.value); setPwErr('') }}
                      style={{ width: '100%', background: '#ffffff', border: `1px solid ${pwErr ? '#ef4444' : '#000000'}`, borderRadius: '7px', padding: '8px 12px', color: '#0B1326', fontSize: '13px', fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <button onClick={savePw}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: '#451a03', border: '1px solid #d97706', borderRadius: '7px', color: '#fbbf24', fontWeight: 600, fontSize: '12px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap', flexShrink: 0 }}>
                    <KeyRound size={12} /> Update
                  </button>
                  {pwSaved && <span style={{ color: '#4ade80', fontSize: '12px', fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}><CheckCircle size={12} /> Updated</span>}
                </div>
                {pwErr && <p style={{ color: '#f87171', fontSize: '11px', margin: '4px 0 0', fontFamily: "'DM Sans', sans-serif" }}>{pwErr}</p>}
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                <KeyRound size={13} color="#94a3b8" />
                <span style={{ color: '#94a3b8', fontSize: '12px', fontFamily: "'DM Sans', sans-serif" }}>Password management is restricted to admins.</span>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  )
}

// ── Audit Log ────────────────────────────────────────────────────────────────

const PERM_LABELS = Object.fromEntries(
  [
    { key: 'addListing',         label: 'Add Listings'          },
    { key: 'approveListings',    label: 'Approve/Reject'        },
    { key: 'markSold',           label: 'Mark as Sold'          },
    { key: 'deleteListings',     label: 'Delete Listings'       },
    { key: 'editListings',       label: 'Edit Listings'         },
    { key: 'manageUsers',        label: 'Manage Users'          },
    { key: 'createUsers',        label: 'Create Users'          },
    { key: 'suspendDeleteUsers', label: 'Suspend / Delete Users' },
    { key: 'viewAnalytics',      label: 'View Analytics'        },
  ].map(({ key, label }) => [key, label])
)

function AuditLog() {
  const { auditLog } = useApp()

  function timeAgo(iso) {
    const diff = Date.now() - new Date(iso).getTime()
    const m = Math.floor(diff / 60000)
    if (m < 1)  return 'just now'
    if (m < 60) return `${m}m ago`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h}h ago`
    return `${Math.floor(h / 24)}d ago`
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
        <ScrollText size={16} color="#E61534" />
        <h3 style={{ color: '#000000', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '15px', margin: 0 }}>
          Admin Action Audit Log
        </h3>
        <span style={{ color: '#94a3b8', fontSize: '11px', fontFamily: "'DM Sans', sans-serif" }}>— visible only to super admin</span>
      </div>

      {auditLog.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
          <ScrollText size={28} color="#cbd5e1" style={{ margin: '0 auto 10px', display: 'block' }} />
          <p style={{ color: '#94a3b8', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', margin: 0 }}>No admin actions recorded yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {auditLog.map((entry) => {
            const actionLabel = entry.type === 'user_suspended' ? 'suspended' : entry.type === 'user_deleted' ? 'deleted' : 'changed permissions of'
            const borderColor = entry.type === 'user_deleted' ? '#fecaca' : entry.type === 'user_suspended' ? '#fde68a' : '#e5e7eb'
            const bgColor     = entry.type === 'user_deleted' ? '#fff8f8' : entry.type === 'user_suspended' ? '#fffdf0' : '#ffffff'
            return (
              <div key={entry.id} style={{ background: bgColor, border: `1px solid ${borderColor}`, borderRadius: '10px', padding: '12px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <span style={{ background: ROLE_COLOR[entry.actorRole]?.bg || '#e5e7eb', color: ROLE_COLOR[entry.actorRole]?.color || '#000', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '9999px', fontFamily: "'DM Sans', sans-serif" }}>
                    {entry.actorRole.toUpperCase()}
                  </span>
                  <span style={{ color: '#000000', fontWeight: 700, fontSize: '13px', fontFamily: "'DM Sans', sans-serif" }}>{entry.actorName}</span>
                  <span style={{ color: '#64748b', fontSize: '12px', fontFamily: "'DM Sans', sans-serif" }}>{actionLabel}</span>
                  <span style={{ color: '#000000', fontWeight: 700, fontSize: '13px', fontFamily: "'DM Sans', sans-serif" }}>{entry.targetName}</span>
                  <span style={{ background: ROLE_COLOR[entry.targetRole]?.bg || '#e5e7eb', color: ROLE_COLOR[entry.targetRole]?.color || '#000', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '9999px', fontFamily: "'DM Sans', sans-serif" }}>
                    {entry.targetRole.toUpperCase()}
                  </span>
                  <span style={{ marginLeft: 'auto', color: '#94a3b8', fontSize: '11px', fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap' }}>
                    {timeAgo(entry.timestamp)} · {new Date(entry.timestamp).toLocaleString()}
                  </span>
                </div>
                {entry.type === 'permissions_changed' && entry.changes && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: entry.reason ? '8px' : 0 }}>
                    {Object.entries(entry.changes).map(([key, { to }]) => (
                      <span key={key} style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '6px',
                        fontFamily: "'DM Sans', sans-serif",
                        background: to ? 'rgba(8,201,79,0.12)' : 'rgba(229,64,64,0.12)',
                        color: to ? '#059669' : '#E54040',
                        border: `1px solid ${to ? '#6ee7b7' : '#fca5a5'}`,
                      }}>
                        {to ? '✓' : '✗'} {PERM_LABELS[key] || key}
                      </span>
                    ))}
                  </div>
                )}
                {entry.reason && (
                  <p style={{ margin: 0, fontSize: '11px', fontFamily: "'DM Sans', sans-serif", color: '#374151', background: 'rgba(0,0,0,0.04)', borderRadius: '5px', padding: '5px 9px' }}>
                    <strong>Reason:</strong> {entry.reason}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── User Management panel ─────────────────────────────────────────────────────

const IF = { width: '100%', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '10px 14px', color: '#0B1326', fontSize: '13px', fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box' }
const LF = { fontSize: '11px', fontWeight: 700, color: '#000000', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '5px', display: 'block', fontFamily: "'DM Sans', sans-serif" }

function UserManagement() {
  const { users, approveUser, rejectUser, createUserByAdmin, restoreUser, currentUser, canCreateUsers } = useApp()
  const isAdmin = currentUser?.role === 'admin'

  const pendingSellers = users.filter((u) => u.status === 'pending')
  const allUsers       = users.filter((u) => u.status !== 'rejected' && u.status !== 'deleted')
  const deletedUsers   = users.filter((u) => u.status === 'deleted')

  const [userTab, setUserTab]   = useState('all')
  const [form, setForm]         = useState({ name: '', email: '', phone: '', password: '', role: '', permissions: {} })
  const [showPw, setShowPw]     = useState(false)
  const [formErr, setFormErr]   = useState({})
  const [createOk, setCreateOk] = useState(false)

  function setF(k, v) {
    if (k === 'role') {
      setForm((f) => ({ ...f, role: v, permissions: v ? { ...DEFAULT_PERMISSIONS[v] } : {} }))
    } else {
      setForm((f) => ({ ...f, [k]: v }))
    }
    setFormErr((e) => ({ ...e, [k]: undefined, global: undefined }))
    setCreateOk(false)
  }

  function togglePerm(key) {
    setForm((f) => ({ ...f, permissions: { ...f.permissions, [key]: !f.permissions[key] } }))
  }

  function submitCreate(e) {
    e.preventDefault()
    const errs = {}
    if (!form.name.trim())              errs.name     = 'Required'
    if (!form.email.trim())             errs.email    = 'Required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email'
    if (!form.role)                     errs.role     = 'Please select a role'
    if (form.password.length < 6)       errs.password = 'Min 6 characters'
    if (Object.keys(errs).length) { setFormErr(errs); return }
    const result = createUserByAdmin({ name: form.name.trim(), email: form.email.trim(), password: form.password, role: form.role, phone: form.phone.trim(), permissions: form.permissions })
    if (result.error) { setFormErr({ global: result.error }); return }
    setForm({ name: '', email: '', phone: '', password: '', role: '', permissions: {} })
    setCreateOk(true)
  }

  const TABS = [
    { id: 'all',     label: 'All Users',                    icon: <Users size={14} />,    count: allUsers.length     },
    { id: 'create',  label: 'Create Dealer / Staff Account', icon: <UserPlus size={14} />, count: null                },
    { id: 'deleted', label: 'Deleted Users',                 icon: <Trash2 size={14} />,   count: deletedUsers.length },
  ].filter((t) => t.id !== 'create' || canCreateUsers)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* ── Tab buttons ── */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', overflowX: 'auto', paddingBottom: '2px' }}>
        {TABS.map((t) => {
          const active = userTab === t.id
          return (
            <button key={t.id} onClick={() => setUserTab(t.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                padding: '9px 18px', borderRadius: '8px',
                border: active ? 'none' : '1px solid #d1d5db',
                background: active ? '#3b5bdb' : '#ffffff',
                color: active ? '#ffffff' : '#374151',
                fontWeight: active ? 700 : 500, fontSize: '13px',
                cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = '#f3f4f6' }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = '#ffffff' }}>
              {t.icon}
              {t.label}
              {t.count !== null && (
                <span style={{ background: active ? 'rgba(255,255,255,0.25)' : '#e5e7eb', color: active ? '#fff' : '#374151', fontSize: '11px', fontWeight: 700, padding: '1px 7px', borderRadius: '9999px', fontFamily: "'DM Sans', sans-serif" }}>
                  {t.count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* ── All Users tab ── */}
      {userTab === 'all' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Pending registrations */}
          <div style={{ background: '#FEFCE8', border: '1px solid #1300FF', borderRadius: '10px', padding: '16px 20px' }}>
            <h3 style={{ color: '#f97316', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '15px', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={15} color="#F22711" /> Pending Seller Registrations ({pendingSellers.length})
            </h3>
            {pendingSellers.length === 0 ? (
              <p style={{ color: '#000000', fontFamily: "'DM Sans', sans-serif", fontSize: '14px' }}>No pending registrations.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {pendingSellers.map((u) => (
                  <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: '#FCE6E6', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: '#000000', fontWeight: 600, fontSize: '14px', margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{u.name}</p>
                      <p style={{ color: '#555555', fontSize: '12px', margin: '2px 0 0', fontFamily: "'DM Sans', sans-serif" }}>{u.email}{u.phone ? ` · ${u.phone}` : ''}</p>
                    </div>
                    <span style={{ background: '#451a03', color: '#fdba74', fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '9999px', fontFamily: "'DM Sans', sans-serif" }}>SELLER</span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => approveUser(u.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 12px', background: '#14532d', border: '1px solid #16a34a', borderRadius: '7px', color: '#4ade80', fontWeight: 600, fontSize: '12px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#166534')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = '#14532d')}>
                        <CheckCircle size={12} /> Approve
                      </button>
                      <button onClick={() => rejectUser(u.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 12px', background: '#3b0a0a', border: '1px solid #dc2626', borderRadius: '7px', color: '#f87171', fontWeight: 600, fontSize: '12px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#450a0a')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = '#3b0a0a')}>
                        <XCircle size={12} /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* All users list */}
          <div>
            <h3 style={{ color: '#374151', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '15px', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={15} /> All Users ({allUsers.length})
              <span style={{ color: '#9ca3af', fontSize: '11px', fontWeight: 400 }}>— click <Settings size={10} style={{ verticalAlign: 'middle' }} /> to edit permissions</span>
            </h3>
            <div>{allUsers.map((u) => <UserRow key={u.id} user={u} />)}</div>
          </div>
        </div>
      )}

      {/* ── Create Account tab ── */}
      {userTab === 'create' && canCreateUsers && (
      <div style={{ background: '#E8E8E8', border: '1px solid #ccc', borderRadius: '14px', padding: '20px 24px' }}>
        <h3 style={{ color: '#000000', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '15px', margin: '0 0 18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserPlus size={15} /> Create Dealer / Staff Account
        </h3>
        <form onSubmit={submitCreate}>
          <div className="resp-form-2col">
            <div>
              <label style={LF}>Full Name *</label>
              <input className="admin-input" placeholder="e.g. Abukar Mohamed" value={form.name} onChange={(e) => setF('name', e.target.value)}
                style={{ ...IF, borderColor: formErr.name ? '#ef4444' : '#d1d5db' }} />
              {formErr.name && <p style={{ color: '#f87171', fontSize: '11px', margin: '4px 0 0', fontFamily: "'DM Sans', sans-serif" }}>{formErr.name}</p>}
            </div>
            <div>
              <label style={LF}>Email *</label>
              <input className="admin-input" type="email" placeholder="email@domain.com" value={form.email} onChange={(e) => setF('email', e.target.value)}
                style={{ ...IF, borderColor: formErr.email ? '#ef4444' : '#d1d5db' }} />
              {formErr.email && <p style={{ color: '#f87171', fontSize: '11px', margin: '4px 0 0', fontFamily: "'DM Sans', sans-serif" }}>{formErr.email}</p>}
            </div>
            <div>
              <label style={LF}>Contact Number</label>
              <input className="admin-input" type="tel" placeholder="+252 61 xxx xxxx" value={form.phone} onChange={(e) => setF('phone', e.target.value)}
                style={{ ...IF, borderColor: '#d1d5db' }} />
            </div>
            <div>
              <label style={LF}>Role *</label>
              <select value={form.role} onChange={(e) => setF('role', e.target.value)} style={{ ...IF, cursor: 'pointer', background: '#ffffff', color: form.role ? '#0B1326' : '#9ca3af', border: `1px solid ${formErr.role ? '#ef4444' : '#DE7E16'}` }}>
                <option value="" disabled>Select a role...</option>
                <option value="dealer">Dealer</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin (Full Access)</option>
              </select>
              {formErr.role && <p style={{ color: '#f87171', fontSize: '11px', margin: '4px 0 0', fontFamily: "'DM Sans', sans-serif" }}>{formErr.role}</p>}
            </div>
            {/* Permissions — admin only */}
            {isAdmin && (
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ ...LF, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                  <ShieldCheck size={13} style={{ color: '#60a5fa' }} /> Permissions
                </label>
                {['Listings', 'Users', 'Reports'].map((group) => {
                  const groupPerms = PERM_DEFS.filter((p) => p.group === group)
                  return (
                    <div key={group} style={{ marginBottom: '10px' }}>
                      <p style={{ color: '#000000', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 6px', fontFamily: "'DM Sans', sans-serif" }}>{group}</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {groupPerms.map(({ key, label }) => (
                          <label key={key} onClick={() => togglePerm(key)}
                            style={{ display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer', background: form.permissions[key] ? 'rgba(227,96,5,0.12)' : '#ffffff', border: `1px solid ${form.permissions[key] ? '#E36005' : '#000000'}`, borderRadius: '7px', padding: '6px 12px', transition: 'all 0.15s', userSelect: 'none' }}>
                            <div style={{ width: '14px', height: '14px', borderRadius: '3px', background: form.permissions[key] ? '#E36005' : '#ffffff', border: '2px solid #000000', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
                              {form.permissions[key] && <CheckCircle size={10} color="white" />}
                            </div>
                            <span style={{ color: '#111827', fontSize: '12px', fontWeight: 500, fontFamily: "'DM Sans', sans-serif", transition: 'color 0.15s' }}>{label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={LF}>Password *</label>
              <div style={{ position: 'relative' }}>
                <input className="admin-input" type={showPw ? 'text' : 'password'} placeholder="Min. 6 characters" value={form.password} onChange={(e) => setF('password', e.target.value)}
                  style={{ ...IF, paddingRight: '44px', borderColor: formErr.password ? '#ef4444' : '#d1d5db' }} />
                <button type="button" onClick={() => setShowPw((v) => !v)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex', padding: '2px' }}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {formErr.password && <p style={{ color: '#f87171', fontSize: '11px', margin: '4px 0 0', fontFamily: "'DM Sans', sans-serif" }}>{formErr.password}</p>}
            </div>
          </div>
          {formErr.global && (
            <div style={{ marginTop: '12px', background: '#3b0a0a', border: '1px solid #dc2626', borderRadius: '8px', padding: '10px 14px', color: '#f87171', fontSize: '13px', fontFamily: "'DM Sans', sans-serif" }}>{formErr.global}</div>
          )}
          {createOk && (
            <div style={{ marginTop: '12px', background: '#14532d', border: '1px solid #16a34a', borderRadius: '8px', padding: '10px 14px', color: '#4ade80', fontSize: '13px', fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={14} /> Account created successfully.
            </div>
          )}
          <button type="submit"
            style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 20px', background: '#3b5bdb', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 700, fontSize: '14px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#2f4ac9')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#3b5bdb')}>
            <UserPlus size={14} /> Create Account
          </button>
        </form>
      </div>
      )}

      {/* ── Deleted Users tab ── */}
      {userTab === 'deleted' && (
        <div>
          <h3 style={{ color: '#374151', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '15px', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Trash2 size={15} color="#E54040" /> Deleted Users ({deletedUsers.length})
            <span style={{ color: '#9ca3af', fontSize: '11px', fontWeight: 400 }}>— permanently removed after 30 days</span>
          </h3>
          {deletedUsers.length === 0 ? (
            <p style={{ color: '#9ca3af', fontFamily: "'DM Sans', sans-serif", fontSize: '14px' }}>No deleted users.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {deletedUsers.map((u) => {
                const daysLeft = u.deletedAt
                  ? Math.max(0, 30 - Math.floor((Date.now() - new Date(u.deletedAt).getTime()) / (24 * 60 * 60 * 1000)))
                  : 30
                const rc = ROLE_COLOR[u.role] || ROLE_COLOR.seller
                return (
                  <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: '#FFF5F5', border: '1px solid #fecaca', borderRadius: '10px', opacity: 0.85 }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000000', fontSize: '11px', fontWeight: 700, fontFamily: "'DM Sans', sans-serif", flexShrink: 0 }}>
                      {u.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: '#000000', fontWeight: 600, fontSize: '13px', margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{u.name}</p>
                      <p style={{ color: '#E61534', fontSize: '11px', margin: '1px 0 0', fontFamily: "'DM Sans', sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</p>
                    </div>
                    <span style={{ background: rc.bg, color: rc.color, fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '9999px', fontFamily: "'DM Sans', sans-serif", flexShrink: 0 }}>{u.role.toUpperCase()}</span>
                    <span style={{ background: '#FEE2E2', color: '#E54040', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '9999px', fontFamily: "'DM Sans', sans-serif", flexShrink: 0, whiteSpace: 'nowrap' }}>
                      {daysLeft}d left
                    </span>
                    <button onClick={() => restoreUser(u.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', background: '#08C94F', border: '1px solid #06a340', borderRadius: '7px', color: '#ffffff', fontWeight: 600, fontSize: '12px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", flexShrink: 0 }}>
                      <RefreshCw size={12} /> Restore
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main panel ────────────────────────────────────────────────────────────────

const TAB_LABEL = {
  dashboard: 'Dashboard',
  manage:    'Manage Listings',
  rejected:  'Rejected',
  users:     'User Management',
}

export default function AdminPanel() {
  const { cars, adminTab } = useApp()

  const managed  = cars.filter((c) => c.status === 'active' || c.status === 'sold')
  const rejected = cars.filter((c) => c.status === 'rejected')

  return (
    <section style={{ background: '#FFFFFF', borderTop: '1px solid #e5e7eb', minHeight: '400px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(16px, 3vw, 32px)' }}>

        {/* Header */}
        <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '14px 20px', marginBottom: '24px', borderBottom: '1px solid #e5e7eb' }}>
          <h2 style={{ color: '#000000', fontWeight: 700, fontSize: '18px', margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
            {TAB_LABEL[adminTab] || 'Dashboard'}
          </h2>
        </div>

        <div style={{ background: '#E8E8E8', borderRadius: '16px', padding: '24px' }}>

        {adminTab === 'dashboard' && <Dashboard />}

        {adminTab === 'manage' && (
          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '16px' }}>
            {managed.length === 0 ? (
              <p style={{ color: '#000000', fontFamily: "'DM Sans', sans-serif", textAlign: 'center', padding: '60px 0' }}>No listings yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {managed.map((c) => <ManagementRow key={c.id} car={c} />)}
              </div>
            )}
          </div>
        )}

        {adminTab === 'rejected' && (
          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '16px' }}>
            {rejected.length === 0 ? (
              <p style={{ color: '#EDF2FA', fontFamily: "'DM Sans', sans-serif", textAlign: 'center', padding: '60px 0' }}>No rejected listings.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {rejected.map((c) => <ManagementRow key={c.id} car={c} isRejected />)}
              </div>
            )}
          </div>
        )}

        {adminTab === 'users' && <UserManagement />}

        {adminTab === 'audit' && <AuditLog />}

        </div>
      </div>
    </section>
  )
}
