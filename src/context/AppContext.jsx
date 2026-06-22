import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext(null)

// ── Rejection reasons ─────────────────────────────────────────────────────────

export const REJECT_REASONS = [
  'No car image',
  'Not mentioned the name of the car',
  'Not mentioned the exact price',
]

// ── Permissions ───────────────────────────────────────────────────────────────

export const DEFAULT_PERMISSIONS = {
  admin:  { addListing: true,  approveListings: true,  markSold: true,  deleteListings: true,  manageUsers: true,  viewAnalytics: true,  editListings: true,  suspendDeleteUsers: true,  createUsers: true  },
  dealer: { addListing: true,  approveListings: false, markSold: false, deleteListings: false, manageUsers: false, viewAnalytics: false, editListings: false, suspendDeleteUsers: false, createUsers: false },
  staff:  { addListing: true,  approveListings: true,  markSold: true,  deleteListings: false, manageUsers: false, viewAnalytics: false, editListings: true,  suspendDeleteUsers: false, createUsers: false },
  seller: { addListing: true,  approveListings: false, markSold: false, deleteListings: false, manageUsers: false, viewAnalytics: false, editListings: false, suspendDeleteUsers: false, createUsers: false },
}

// ── Seed Data ────────────────────────────────────────────────────────────────

const INITIAL_USERS = [
  { id: 'u1', name: 'Admin',          email: 'admin@somalicarhub.com',      password: 'admin123',   role: 'admin',  status: 'active', phone: '',              permissions: DEFAULT_PERMISSIONS.admin, superAdmin: true },
  { id: 'u2', name: 'Demo Dealer',    email: 'dealer@somalicarhub.com',     password: 'dealer123',  role: 'dealer', status: 'active', phone: '+252615000001', permissions: DEFAULT_PERMISSIONS.dealer },
  { id: 'u3', name: 'Staff Ali',      email: 'staff@somalicarhub.com',      password: 'staff123',   role: 'staff',  status: 'active', phone: '+252615000002', permissions: DEFAULT_PERMISSIONS.staff  },
  { id: 'u4', name: 'Full Admin 1',   email: 'fulladmin1@somalicarhub.com', password: 'admin123',   role: 'admin',  status: 'active', phone: '+252615000003', permissions: DEFAULT_PERMISSIONS.admin  },
  { id: 'u5', name: 'Staff One',      email: 'staff1@somalicarhub.com',     password: 'staff123',   role: 'staff',  status: 'active', phone: '+252615000004', permissions: DEFAULT_PERMISSIONS.staff  },
  { id: 'u6', name: 'Dealer 12',      email: 'dealer12@somalicarhub.com',   password: 'dealer123',  role: 'dealer', status: 'active', phone: '+252615000005', permissions: DEFAULT_PERMISSIONS.dealer },
]

// Merge new seed users into stored users without overwriting existing ones
function mergeUsers(stored) {
  const result = [...stored]
  for (const u of INITIAL_USERS) {
    if (!result.find((x) => x.email.toLowerCase() === u.email.toLowerCase())) {
      result.push(u)
    }
  }
  return result
}

const INITIAL_CARS = [
  { id: 1, name: 'BMW M5 Competition', price: '$115,000', year: '2024', km: '0 km', fuel: 'Petrol', cc: '4,395cc', trans: 'Auto', location: 'Garowe', badge: 'NEW', type: 'Sedan', imageBg: '#1a1f5e', carColor: '#6b8cff', featured: true, seller: 'DEALER', dealType: null, status: 'active', addedBy: 'admin', dealerName: 'Admin', images: [] },
  { id: 2, name: 'Toyota Camry XSE', price: '$28,500', year: '2022', km: '43,200 km', fuel: 'Petrol', cc: '2,500cc', trans: 'Auto', location: 'Bosaso', badge: 'USED', type: 'Sedan', imageBg: '#3b0a0a', carColor: '#f87171', featured: true, seller: 'OWNER', dealType: null, status: 'active', addedBy: 'admin', dealerName: 'Admin', images: [] },
  { id: 3, name: 'Tesla Model 3 LR', price: '$44,990', year: '2024', km: '0 km', fuel: 'Electric', cc: '—', trans: 'Auto', location: 'Mogadishu', badge: 'NEW', type: 'Electric', imageBg: '#0a2e1a', carColor: '#4ade80', featured: true, seller: 'DEALER', dealType: 'GOOD DEAL', status: 'active', addedBy: 'admin', dealerName: 'Admin', images: [] },
  { id: 4, name: 'Range Rover Sport HSE', price: '$88,000', year: '2023', km: '12,500 km', fuel: 'Diesel', cc: '3,000cc', trans: 'Auto', location: 'Hargeisa', badge: 'USED', type: 'SUV', imageBg: '#2e1f00', carColor: '#fbbf24', featured: true, seller: 'DEALER', dealType: null, status: 'active', addedBy: 'admin', dealerName: 'Admin', images: [] },
]

// ── Provider ─────────────────────────────────────────────────────────────────

function load(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch { return fallback }
}

export function AppProvider({ children }) {
  const [cars, setCars]               = useState(() => load('sch_cars',        INITIAL_CARS))
  const [users, setUsers]             = useState(() => mergeUsers(load('sch_users', [])))
  const [currentUser, setCurrentUser] = useState(() => load('sch_currentUser', null))
  const [nextCarId, setNextCarId]     = useState(() => load('sch_nextCarId',   5))
  const [nextUserId, setNextUserId]   = useState(() => load('sch_nextUserId',  7))
  const [showAddModal, setShowAddModal]               = useState(false)
  const [showLoginModal, setShowLoginModal]           = useState(false)
  const [showRegisterModal, setShowRegisterModal]     = useState(false)
  const [adminTab, setAdminTab]       = useState('dashboard')
  const [toast, setToast]             = useState(null)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [favorites, setFavorites]     = useState(() => load('sch_favorites', []))
  const [theme, setThemeState]        = useState(() => load('sch_theme', 'white'))
  const [auditLog, setAuditLog]       = useState(() => load('sch_auditLog', []))

  useEffect(() => { localStorage.setItem('sch_cars',        JSON.stringify(cars))        }, [cars])
  useEffect(() => { localStorage.setItem('sch_users',       JSON.stringify(users))       }, [users])
  useEffect(() => { localStorage.setItem('sch_currentUser', JSON.stringify(currentUser)) }, [currentUser])
  useEffect(() => { localStorage.setItem('sch_nextCarId',   JSON.stringify(nextCarId))   }, [nextCarId])
  useEffect(() => { localStorage.setItem('sch_nextUserId',  JSON.stringify(nextUserId))  }, [nextUserId])
  useEffect(() => { localStorage.setItem('sch_favorites',   JSON.stringify(favorites))   }, [favorites])
  useEffect(() => { localStorage.setItem('sch_theme',       JSON.stringify(theme))       }, [theme])
  useEffect(() => { localStorage.setItem('sch_auditLog',    JSON.stringify(auditLog))    }, [auditLog])

  // Purge users deleted more than 30 days ago
  useEffect(() => {
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000
    setUsers((prev) => prev.filter((u) =>
      u.status !== 'deleted' || !u.deletedAt || (Date.now() - new Date(u.deletedAt).getTime()) < THIRTY_DAYS
    ))
  }, [])

  // Apply data-theme to documentElement so CSS variables cascade everywhere
  useEffect(() => {
    const apply = (t) => document.documentElement.setAttribute('data-theme', t)
    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      const handler = () => apply(mq.matches ? 'dark-gray' : 'white')
      handler()
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    }
    apply(theme)
  }, [theme])

  function setTheme(t) { setThemeState(t) }
  function toggleFavorite(carId) {
    setFavorites((prev) => prev.includes(carId) ? prev.filter((id) => id !== carId) : [...prev, carId])
  }

  // Derived role — everything in the app reads this
  const role = currentUser?.role ?? 'guest'

  // Permission helpers — fall back to role defaults for any missing key
  function perm(key) {
    if (!currentUser) return false
    const p = currentUser.permissions ?? {}
    if (key in p) return !!p[key]
    return !!(DEFAULT_PERMISSIONS[currentUser.role]?.[key] ?? false)
  }
  const canAddCar        = currentUser?.status === 'active' && perm('addListing')
  const canApprove       = perm('approveListings')
  const canMarkSold      = perm('markSold')
  const canDeleteListing     = perm('deleteListings')
  const canEditListing       = perm('editListings')
  const canManageUsers       = perm('manageUsers')
  const canSuspendDeleteUsers = perm('suspendDeleteUsers')
  const canCreateUsers       = perm('createUsers')

  // ── Toast ────────────────────────────────────────────────────────────────
  function showToast(message, type = 'success') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  // ── Auth ─────────────────────────────────────────────────────────────────
  function login(email, password) {
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    if (!user) return { error: 'Invalid email or password.' }
    if (user.status === 'pending')   return { error: 'Your account is pending admin approval.' }
    if (user.status === 'rejected')  return { error: 'Your account has been rejected. Contact admin.' }
    if (user.status === 'suspended') return { error: 'Your account has been suspended. Contact admin.' }
    setCurrentUser(user)
    setShowLoginModal(false)
    showToast(`Welcome back, ${user.name}!`)
    return { ok: true }
  }

  function logout() {
    setCurrentUser(null)
    showToast('Logged out successfully.')
  }

  // Buyer/seller self-registration (requires admin approval)
  function registerSeller(data) {
    const exists = users.find((u) => u.email.toLowerCase() === data.email.toLowerCase())
    if (exists) return { error: 'This email is already registered.' }
    const newUser = {
      id: `u${nextUserId}`,
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role === 'dealer' ? 'dealer' : 'seller',
      status: 'pending',
      phone: data.phone,
    }
    setUsers((prev) => [...prev, newUser])
    setNextUserId((n) => n + 1)
    setShowRegisterModal(false)
    showToast('Account created! Awaiting admin approval.', 'info')
    return { ok: true }
  }

  // Admin creates dealer or staff account (auto-approved)
  function createUserByAdmin(data) {
    const exists = users.find((u) => u.email.toLowerCase() === data.email.toLowerCase())
    if (exists) return { error: 'Email already registered.' }
    const basePerms = DEFAULT_PERMISSIONS[data.role] ?? DEFAULT_PERMISSIONS.dealer
    const newUser = {
      id: `u${nextUserId}`,
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      status: 'active',
      phone: data.phone || '',
      permissions: { ...basePerms, ...data.permissions },
    }
    setUsers((prev) => [...prev, newUser])
    setNextUserId((n) => n + 1)
    showToast(`${data.role.charAt(0).toUpperCase() + data.role.slice(1)} account created for ${data.name}.`)
    return { ok: true }
  }

  function approveUser(userId) {
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, status: 'active' } : u))
    showToast('User account approved and activated.')
  }

  function rejectUser(userId) {
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, status: 'rejected' } : u))
    showToast('User account rejected.', 'error')
  }

  function suspendUser(userId, reason = '') {
    const target = users.find((u) => u.id === userId)
    if (target && currentUser) {
      setAuditLog((log) => [{
        id:         Date.now(),
        type:       'user_suspended',
        actorId:    currentUser.id,
        actorName:  currentUser.name,
        actorRole:  currentUser.role,
        targetId:   target.id,
        targetName: target.name,
        targetRole: target.role,
        reason,
        timestamp:  new Date().toISOString(),
      }, ...log].slice(0, 200))
    }
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, status: 'suspended' } : u))
    if (currentUser?.id === userId) setCurrentUser(null)
    showToast('User account suspended.', 'error')
  }

  function reactivateUser(userId) {
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, status: 'active' } : u))
    showToast('User account reactivated.')
  }

  function changeUserPassword(userId, newPassword) {
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, password: newPassword } : u))
    showToast('Password updated successfully.')
  }

  function updateUserPermissions(userId, permissions, reason = '') {
    const target = users.find((u) => u.id === userId)
    if (target && currentUser) {
      const oldPerms = target.permissions ?? DEFAULT_PERMISSIONS[target.role] ?? {}
      const changed = {}
      const allKeys = new Set([...Object.keys(oldPerms), ...Object.keys(permissions)])
      allKeys.forEach((k) => {
        if (!!oldPerms[k] !== !!permissions[k]) {
          changed[k] = { from: !!oldPerms[k], to: !!permissions[k] }
        }
      })
      if (Object.keys(changed).length > 0) {
        setAuditLog((log) => [{
          id:         Date.now(),
          type:       'permissions_changed',
          actorId:    currentUser.id,
          actorName:  currentUser.name,
          actorRole:  currentUser.role,
          targetId:   target.id,
          targetName: target.name,
          targetRole: target.role,
          changes:    changed,
          reason,
          timestamp:  new Date().toISOString(),
        }, ...log].slice(0, 200))
      }
    }
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, permissions } : u))
    showToast('Permissions saved.')
  }

  function removeUser(userId, reason = '') {
    const target = users.find((u) => u.id === userId)
    if (target && currentUser) {
      setAuditLog((log) => [{
        id:         Date.now(),
        type:       'user_deleted',
        actorId:    currentUser.id,
        actorName:  currentUser.name,
        actorRole:  currentUser.role,
        targetId:   target.id,
        targetName: target.name,
        targetRole: target.role,
        reason,
        timestamp:  new Date().toISOString(),
      }, ...log].slice(0, 200))
    }
    setUsers((prev) => prev.map((u) =>
      u.id === userId ? { ...u, status: 'deleted', deletedAt: new Date().toISOString() } : u
    ))
    showToast('User moved to deleted. Permanently removed in 30 days.', 'error')
  }

  function restoreUser(userId) {
    setUsers((prev) => prev.map((u) =>
      u.id === userId ? { ...u, status: 'active', deletedAt: undefined } : u
    ))
    showToast('User restored.')
  }

  // ── Car Actions ──────────────────────────────────────────────────────────
  function addCar(carData) {
    if (!canAddCar) {
      setShowLoginModal(true)
      showToast('Please log in to add a listing.', 'error')
      return
    }
    const autoApprove = role === 'admin' || canApprove
    const newCar = {
      ...carData,
      id: nextCarId,
      status: autoApprove ? 'active' : 'pending',
      addedBy: role,
      dealerName: currentUser.name,
      submitterEmail: currentUser.email || '',
      submitterPhone: currentUser.phone || '',
      featured: false,
      dealType: null,
      images: carData.images || [],
    }
    setCars((prev) => [newCar, ...prev])
    setNextCarId((n) => n + 1)
    setShowAddModal(false)
    showToast(
      autoApprove
        ? 'Listing published successfully.'
        : 'Listing submitted! Awaiting admin approval.',
      autoApprove ? 'success' : 'info'
    )
  }

  function approveCar(id) {
    setCars((prev) => prev.map((c) => c.id === id ? { ...c, status: 'active' } : c))
    showToast('Listing approved and published.')
  }

  function rejectCar(id, reason) {
    setCars((prev) => prev.map((c) => c.id === id ? { ...c, status: 'rejected', rejectReason: reason || '' } : c))
    showToast('Listing rejected.', 'error')
  }

  function markSold(id) {
    setCars((prev) => prev.map((c) => c.id === id ? { ...c, status: 'sold' } : c))
    showToast('Car marked as sold.')
  }

  function unmarkSold(id) {
    setCars((prev) => prev.map((c) => c.id === id ? { ...c, status: 'active' } : c))
    showToast('Car restored to active listing.')
  }

  function deleteCar(id) {
    setCars((prev) => prev.filter((c) => c.id !== id))
    showToast('Listing deleted.', 'error')
  }

  function updateCar(id, data) {
    setCars((prev) => prev.map((c) => c.id === id ? { ...c, ...data } : c))
    showToast('Listing updated.')
  }

  function resubmitCarEdit(id, data) {
    setCars((prev) => prev.map((c) => c.id === id ? { ...c, ...data, status: 'pending' } : c))
    showToast('Listing updated — pending re-approval by staff/admin.', 'info')
  }

  return (
    <AppContext.Provider value={{
      // Car state
      cars, role, canAddCar, canApprove, canMarkSold, canDeleteListing, canEditListing, canManageUsers, canSuspendDeleteUsers, canCreateUsers,
      addCar, approveCar, rejectCar, markSold, unmarkSold, deleteCar, updateCar, resubmitCarEdit,
      // User state
      users, currentUser,
      login, logout, registerSeller, createUserByAdmin,
      approveUser, rejectUser, suspendUser, reactivateUser,
      changeUserPassword, updateUserPermissions, removeUser, restoreUser,
      // Modal visibility
      showAddModal, setShowAddModal,
      showLoginModal, setShowLoginModal,
      showRegisterModal, setShowRegisterModal,
      adminTab, setAdminTab,
      auditLog,
      mobileSidebarOpen, setMobileSidebarOpen,
      // Toast
      toast,
      // Favorites
      favorites, toggleFavorite,
      // Theme
      theme, setTheme,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
