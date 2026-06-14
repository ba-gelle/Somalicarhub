import { Gauge, LayoutGrid, XCircle, Users, ScrollText } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function AdminSidebar() {
  const { cars, users, currentUser, adminTab, setAdminTab,
          canApprove, canMarkSold, canDeleteListing, canManageUsers, auditLog } = useApp()
  const isSuperAdmin = currentUser?.superAdmin === true

  const pending      = cars.filter((c) => c.status === 'pending')
  const managed      = cars.filter((c) => c.status === 'active' || c.status === 'sold')
  const rejected     = cars.filter((c) => c.status === 'rejected')
  const pendingUsers = users.filter((u) => u.status === 'pending')

  const NAV = [
    { id: 'dashboard', label: 'Dashboard',      icon: <Gauge size={15} />,      count: pending.length,   show: true                             },
    { id: 'manage',    label: 'Manage Listings', icon: <LayoutGrid size={15} />, count: managed.length,   show: canMarkSold || canDeleteListing  },
    { id: 'rejected',  label: 'Rejected',        icon: <XCircle size={15} />,   count: rejected.length,  show: canDeleteListing                 },
    { id: 'users',     label: 'User Management', icon: <Users size={15} />,      count: pendingUsers.length,  show: canManageUsers  },
    { id: 'audit',     label: 'Audit Log',        icon: <ScrollText size={15} />, count: auditLog.length,     show: isSuperAdmin    },
  ].filter((n) => n.show)

  const STATS = [
    { label: 'Active',   value: managed.filter((c) => c.status === 'active').length },
    { label: 'Sold',     value: managed.filter((c) => c.status === 'sold').length },
    { label: 'Pending',  value: pending.length },
    { label: 'New msgs', value: pendingUsers.length },
  ]

  const initials = (currentUser?.name || 'Admin')
    .split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()

  return (
    <aside style={{
      width: '260px',
      minHeight: '100vh',
      background: '#ffffff',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 50,
      borderRight: '1px solid rgba(0,0,0,0.15)',
      padding: '20px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      overflowY: 'auto',
    }}>

      {/* ── Admin info ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: 700, fontSize: '14px', flexShrink: 0, fontFamily: "'DM Sans', sans-serif" }}>
            {initials}
          </div>
          <div>
            <p style={{ color: '#000000', fontWeight: 700, fontSize: '14px', margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
              {currentUser?.name || 'Admin'}
            </p>
            <p style={{ color: 'rgba(0,0,0,0.65)', fontSize: '12px', margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
              {currentUser?.role ? currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1) : 'Admin'}
            </p>
          </div>
        </div>
        <div>
          <p style={{ color: '#000000', fontWeight: 700, fontSize: '13px', margin: 0, fontFamily: "'DM Sans', sans-serif" }}>Admin Panel</p>
          <p style={{ color: 'rgba(0,0,0,0.65)', fontSize: '12px', margin: 0, fontFamily: "'DM Sans', sans-serif" }}>Frontend Owner</p>
        </div>
      </div>

      {/* ── Stats ── */}
      <div style={{ background: 'rgba(0,0,0,0.08)', borderRadius: '10px', padding: '10px 14px' }}>
        {STATS.map(({ label, value }) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' }}>
            <span style={{ color: '#F50F0F', fontSize: '13px', fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
            <span style={{ color: '#F50F0F', fontWeight: 700, fontSize: '13px', fontFamily: "'DM Sans', sans-serif" }}>{value}</span>
          </div>
        ))}
      </div>

      {/* ── Nav ── */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {NAV.map((n) => {
          const active = adminTab === n.id
          return (
            <button key={n.id} onClick={() => setAdminTab(n.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 12px', borderRadius: '8px', border: 'none',
                background: active ? 'rgba(0,0,0,0.15)' : 'transparent',
                color: '#000000',
                fontWeight: active ? 700 : 500,
                fontSize: '13px', cursor: 'pointer', textAlign: 'left', width: '100%',
                fontFamily: "'DM Sans', sans-serif",
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'rgba(0,0,0,0.10)' }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent' }}>
              <span style={{ flexShrink: 0, color: '#000000' }}>{n.icon}</span>
              <span style={{ flex: 1, color: active ? '#000000' : '#E80000' }}>{n.label}</span>
              {n.count > 0 && (
                <span style={{ background: '#000000', color: '#ffffff', fontSize: '10px', fontWeight: 700, width: '20px', height: '20px', borderRadius: '9999px', flexShrink: 0, fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {n.count}
                </span>
              )}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
