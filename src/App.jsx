import { AppProvider, useApp } from './context/AppContext'
import AdminSidebar from './components/AdminSidebar'
import AdminPanel from './components/AdminPanel'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import FilterBar from './components/FilterBar'
import FeaturedListings from './components/FeaturedListings'
import AddCarModal from './components/AddCarModal'
import LoginModal from './components/LoginModal'
import RegisterModal from './components/RegisterModal'
import './index.css'

const SIDEBAR_W = 260

function Toast() {
  const { toast } = useApp()
  if (!toast) return null
  const BG     = { success: '#14532d', info: '#1d3a8a', error: '#3b0a0a' }
  const BORDER = { success: '#16a34a', info: '#3b5bdb', error: '#dc2626' }
  const COLOR  = { success: '#4ade80', info: '#93c5fd', error: '#f87171' }
  const type   = toast.type || 'success'
  return (
    <div style={{
      position: 'fixed', bottom: '28px', right: '28px', zIndex: 300,
      background: BG[type], border: `1px solid ${BORDER[type]}`,
      borderRadius: '10px', padding: '14px 20px',
      color: COLOR[type], fontWeight: 600, fontSize: '14px',
      fontFamily: "'DM Sans', sans-serif",
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      maxWidth: '320px',
      animation: 'fadeInUp 0.25s ease',
    }}>
      {toast.message}
    </div>
  )
}

function AppInner() {
  const { role, showAddModal, showLoginModal, showRegisterModal,
          canApprove, canMarkSold, canDeleteListing, canManageUsers } = useApp()
  const isAdmin        = role === 'admin'
  const hasAdminAccess = isAdmin || canApprove || canMarkSold || canDeleteListing || canManageUsers

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Fixed Left Sidebar (admin + elevated users) ── */}
      {hasAdminAccess && <AdminSidebar />}

      {/* ── Right Content ── */}
      <main style={{ marginLeft: hasAdminAccess ? `${SIDEBAR_W}px` : '0', flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        <Navbar />

        <Hero />

        {/* Filter bar wrapper */}
        <div style={{ background: 'var(--bg-section)', padding: '16px 32px', display: 'flex', justifyContent: 'center' }}>
          <FilterBar />
        </div>

        <FeaturedListings />

        {hasAdminAccess && <AdminPanel />}

      </main>

      {/* ── Modals ── */}
      {showAddModal    && <AddCarModal />}
      {showLoginModal  && <LoginModal />}
      {showRegisterModal && <RegisterModal />}

      <Toast />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  )
}
