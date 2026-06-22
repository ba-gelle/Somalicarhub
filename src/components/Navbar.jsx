import { Car, Plus, LogIn, LogOut, UserPlus, ChevronDown, Heart, Palette, Check, X, Menu } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useApp } from '../context/AppContext'
import { useWindowSize } from '../hooks/useWindowSize'

const NAV_LINKS = ['Home', 'Services', 'Browse Cars', 'New Cars', 'Used Cars', 'About Us', 'Contact Us']

const ROLE_STYLE = {
  admin:  { bg: '#1d3a8a', color: '#93c5fd', label: 'Admin' },
  dealer: { bg: '#3b1a7a', color: '#c4b5fd', label: 'Dealer' },
  staff:  { bg: '#14532d', color: '#86efac', label: 'Staff' },
  seller: { bg: '#451a03', color: '#fdba74', label: 'Seller' },
}

const THEME_OPTIONS = [
  { id: 'white',     label: 'White',          swatch: '#f8fafc', border: '#e2e8f0' },
  { id: 'dark-gray', label: 'Dark Gray',       swatch: '#1e293b' },
  { id: 'black',     label: 'Black',           swatch: '#000000', border: '#333' },
  { id: 'system',    label: 'System Settings', swatch: null },
  { id: 'colorful',  label: 'Colorful',        swatch: null },
]

function WhatsAppSVG() {
  return <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
}
function FacebookSVG() {
  return <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
}
function LinkedInSVG() {
  return <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
}

const SOCIAL = [
  { bg: '#25d366', Icon: WhatsAppSVG, label: 'WhatsApp' },
  { bg: '#1877f2', Icon: FacebookSVG, label: 'Facebook' },
  { bg: '#0a66c2', Icon: LinkedInSVG, label: 'LinkedIn' },
]

function Avatar({ name }) {
  const initials = name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
  return (
    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#3b5bdb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '11px', fontWeight: 700, fontFamily: "'DM Sans', sans-serif", flexShrink: 0 }}>
      {initials}
    </div>
  )
}

function ColorfulSwatch() {
  return <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'conic-gradient(#f97316, #eab308, #22c55e, #3b82f6, #8b5cf6, #ec4899, #f97316)', flexShrink: 0 }} />
}
function SystemSwatch() {
  return <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'linear-gradient(135deg, #000 50%, #f8fafc 50%)', border: '2px solid #e2e8f0', flexShrink: 0 }} />
}

export default function Navbar() {
  const { currentUser, canAddCar, logout, setShowLoginModal, setShowRegisterModal, setShowAddModal,
          favorites, cars, theme, setTheme, toggleFavorite,
          role, canApprove, canMarkSold, canDeleteListing, canManageUsers,
          mobileSidebarOpen, setMobileSidebarOpen } = useApp()

  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [themeOpen, setThemeOpen]       = useState(false)
  const [favOpen, setFavOpen]           = useState(false)
  const [scrolled, setScrolled]         = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const screenWidth    = useWindowSize()
  const isMobile       = screenWidth < 768
  const isSmall        = screenWidth < 540

  const hasAdminAccess = role === 'admin' || canApprove || canMarkSold || canDeleteListing || canManageUsers

  const themeRef = useRef(null)
  const favRef   = useRef(null)
  const userRef  = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    function handler(e) {
      if (themeRef.current && !themeRef.current.contains(e.target)) setThemeOpen(false)
      if (favRef.current   && !favRef.current.contains(e.target))   setFavOpen(false)
      if (userRef.current  && !userRef.current.contains(e.target))  setUserMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close mobile nav when going to desktop
  useEffect(() => { if (!isMobile) setMobileNavOpen(false) }, [isMobile])

  const roleStyle = currentUser ? ROLE_STYLE[currentUser.role] : null
  const favCars   = cars.filter((car) => favorites.includes(car.id))
  const isDark    = theme === 'dark-gray' || theme === 'black'

  const navBg     = scrolled ? 'var(--nav-bg-scroll)'     : 'var(--nav-bg)'
  const navBorder = scrolled ? 'var(--nav-border-scroll)' : 'var(--nav-border)'
  const iconColor = isDark ? '#ffffff' : 'var(--nav-text)'
  const subColor  = isDark ? 'rgba(255,255,255,0.55)' : 'var(--nav-sub)'

  const iconBtn = {
    width: '36px', height: '36px', borderRadius: '9px',
    background: 'transparent', border: '1px solid var(--nav-border)',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    position: 'relative', flexShrink: 0, transition: 'background 0.15s, border-color 0.15s',
  }

  function handleHamburger() {
    if (hasAdminAccess) {
      setMobileSidebarOpen((v) => !v)
    } else {
      setMobileNavOpen((v) => !v)
    }
  }

  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 40, width: '100%' }}>

      {/* ── Top Row ── */}
      <div style={{
        background: navBg,
        borderBottom: `1px solid ${navBorder}`,
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.08)' : 'none',
        transition: 'background 0.25s, border-color 0.25s, box-shadow 0.25s',
        height: '60px', padding: isMobile ? '0 16px' : '0 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>

        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: '#3b5bdb', borderRadius: '10px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Car size={18} color="white" />
          </div>
          {!isSmall && (
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '22px', fontWeight: 700 }}>
              <span style={{ color: 'var(--nav-text)' }}>Auto</span>
              <span style={{ color: '#f97316' }}>Broker</span>
            </span>
          )}
        </div>

        {/* Right cluster */}
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '6px' : '8px' }}>

          {/* Favourites */}
          <div ref={favRef} style={{ position: 'relative' }}>
            <button onClick={() => { setFavOpen(v => !v); setThemeOpen(false); setUserMenuOpen(false) }}
              style={{ ...iconBtn, borderColor: favOpen ? '#ef4444' : 'var(--nav-border)' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              title="Saved cars">
              <Heart size={17} color={favCars.length > 0 ? '#ef4444' : iconColor} fill={favCars.length > 0 ? '#ef4444' : 'none'} />
              {favCars.length > 0 && (
                <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#ef4444', color: 'white', fontSize: '9px', fontWeight: 800, width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif" }}>
                  {favCars.length > 9 ? '9+' : favCars.length}
                </span>
              )}
            </button>

            {favOpen && (
              <div style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '10px', minWidth: '280px', maxWidth: '320px', boxShadow: 'var(--shadow-card)', zIndex: 200 }}>
                <p style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '13px', margin: '0 0 10px 4px', fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Heart size={13} color="#ef4444" fill="#ef4444" /> Saved Cars ({favCars.length})
                </p>
                {favCars.length === 0 ? (
                  <p style={{ color: 'var(--text-hint)', fontSize: '13px', textAlign: 'center', padding: '20px 0', fontFamily: "'DM Sans', sans-serif" }}>No saved cars yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '320px', overflowY: 'auto' }}>
                    {favCars.map((car) => (
                      <div key={car.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', background: 'var(--bg-surface)', borderRadius: '9px', border: '1px solid var(--border)' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: car.imageBg, flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '12px', margin: 0, fontFamily: "'DM Sans', sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{car.name}</p>
                          <p style={{ color: 'var(--price-color)', fontWeight: 700, fontSize: '12px', margin: '1px 0 0', fontFamily: "'DM Sans', sans-serif" }}>{car.price}</p>
                        </div>
                        <button onClick={() => toggleFavorite(car.id)}
                          style={{ width: '26px', height: '26px', borderRadius: '6px', background: '#fef2f2', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <X size={12} color="#ef4444" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Theme switcher */}
          <div ref={themeRef} style={{ position: 'relative' }}>
            <button onClick={() => { setThemeOpen(v => !v); setFavOpen(false); setUserMenuOpen(false) }}
              style={{ ...iconBtn, borderColor: themeOpen ? '#3b5bdb' : 'var(--nav-border)' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(59,91,219,0.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              title="Change theme">
              <Palette size={17} color={iconColor} />
            </button>

            {themeOpen && (
              <div style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '8px', minWidth: '200px', boxShadow: 'var(--shadow-card)', zIndex: 200 }}>
                <p style={{ color: 'var(--text-hint)', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', margin: '2px 8px 8px', fontFamily: "'DM Sans', sans-serif" }}>Display Theme</p>
                {THEME_OPTIONS.map(({ id, label, swatch, border: sb }) => (
                  <button key={id} onClick={() => { setTheme(id); setThemeOpen(false) }}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', background: theme === id ? 'rgba(59,91,219,0.1)' : 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.15s' }}
                    onMouseEnter={(e) => { if (theme !== id) e.currentTarget.style.background = 'var(--bg-surface)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = theme === id ? 'rgba(59,91,219,0.1)' : 'transparent' }}>
                    {id === 'colorful' ? <ColorfulSwatch /> : id === 'system' ? <SystemSwatch /> : (
                      <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: swatch, border: `2px solid ${sb || swatch}`, flexShrink: 0 }} />
                    )}
                    <span style={{ flex: 1, color: 'var(--text-primary)', fontSize: '13px', fontWeight: theme === id ? 700 : 500, textAlign: 'left', fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
                    {theme === id && <Check size={13} color="#3b5bdb" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Divider — hide on mobile */}
          {!isMobile && <div style={{ width: '1px', height: '22px', background: 'var(--nav-border)', flexShrink: 0 }} />}

          {/* Auth — desktop only (mobile handled by hamburger panel) */}
          {!isMobile && (
            currentUser ? (
              <>
                {canAddCar && (
                  <button onClick={() => setShowAddModal(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f97316', color: 'white', border: 'none', borderRadius: '8px', padding: '9px 16px', fontWeight: 600, fontSize: '13px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#ea6c00')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#f97316')}>
                    <Plus size={14} /> Add Listing
                  </button>
                )}
                <div ref={userRef} style={{ position: 'relative' }}>
                  <button onClick={() => { setUserMenuOpen(v => !v); setFavOpen(false); setThemeOpen(false) }}
                    style={{ display: 'flex', alignItems: 'center', gap: '7px', background: 'var(--nav-menu-bg)', border: '1px solid var(--nav-border)', borderRadius: '8px', padding: '5px 10px', cursor: 'pointer' }}>
                    <Avatar name={currentUser.name} />
                    <div style={{ textAlign: 'left' }}>
                      <p style={{ color: iconColor, fontWeight: 700, fontSize: '12px', margin: 0, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.2 }}>{currentUser.name}</p>
                      {roleStyle && <span style={{ color: '#f97316', fontSize: '10px', fontFamily: "'DM Sans', sans-serif" }}>{roleStyle.label}</span>}
                    </div>
                    <ChevronDown size={13} color={subColor} style={{ transform: userMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
                  </button>
                  {userMenuOpen && (
                    <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '6px', minWidth: '180px', boxShadow: 'var(--shadow-card)', zIndex: 200 }}>
                      <div style={{ padding: '8px 12px 10px', borderBottom: '1px solid var(--border)', marginBottom: '4px' }}>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '11px', margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{currentUser.email}</p>
                        {currentUser.phone && <p style={{ color: 'var(--text-hint)', fontSize: '11px', margin: '2px 0 0', fontFamily: "'DM Sans', sans-serif" }}>{currentUser.phone}</p>}
                      </div>
                      <button onClick={() => { logout(); setUserMenuOpen(false) }}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 12px', background: 'none', border: 'none', borderRadius: '7px', color: '#ef4444', fontWeight: 600, fontSize: '13px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", textAlign: 'left' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#fef2f2')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}>
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button onClick={() => setShowLoginModal(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: '1px solid var(--nav-border)', borderRadius: '8px', padding: '8px 14px', color: iconColor, fontWeight: 600, fontSize: '13px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(128,128,128,0.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}>
                  <LogIn size={14} /> Sign In
                </button>
                <button onClick={() => setShowRegisterModal(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f97316', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 14px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#ea6c00')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#f97316')}>
                  <UserPlus size={14} /> List Your Car
                </button>
              </>
            )
          )}

          {/* Social circles — desktop only */}
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              {SOCIAL.map(({ bg, Icon, label }) => (
                <button key={label} title={label}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', background: bg, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'white', transition: 'opacity 0.15s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}>
                  <Icon />
                </button>
              ))}
            </div>
          )}

          {/* Hamburger — mobile only */}
          {isMobile && (
            <button
              onClick={handleHamburger}
              style={{ ...iconBtn, borderColor: (mobileSidebarOpen || mobileNavOpen) ? '#f97316' : 'var(--nav-border)' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(249,115,22,0.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
              {(mobileSidebarOpen || mobileNavOpen) ? <X size={18} color={iconColor} /> : <Menu size={18} color={iconColor} />}
            </button>
          )}
        </div>
      </div>

      {/* ── Nav Links Row — desktop only ── */}
      {!isMobile && (
        <div style={{ background: 'var(--nav-menu-bar)', borderBottom: '1px solid var(--nav-menu-bar-border)', height: '40px', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', overflowX: 'auto', transition: 'background 0.25s' }}>
          {NAV_LINKS.map((link) => {
            const linkColor  = isDark ? '#ffffff' : '#F72D05'
            const hoverBg    = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(247,45,5,0.08)'
            const hoverColor = isDark ? '#ffffff' : '#ff5533'
            return (
              <a key={link} href="#"
                style={{ color: linkColor, fontWeight: 700, fontSize: '13px', textDecoration: 'none', padding: '6px 14px', borderRadius: '6px', whiteSpace: 'nowrap', fontFamily: "'DM Sans', sans-serif", transition: 'color 0.15s, background 0.15s' }}
                onMouseEnter={(e) => { e.target.style.color = hoverColor; e.target.style.background = hoverBg }}
                onMouseLeave={(e) => { e.target.style.color = linkColor; e.target.style.background = 'transparent' }}>
                {link}
              </a>
            )
          })}
        </div>
      )}

      {/* ── Mobile Nav Panel (non-admin users) ── */}
      {isMobile && mobileNavOpen && !hasAdminAccess && (
        <div style={{ background: 'var(--nav-bg)', borderBottom: '1px solid var(--nav-border)', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '4px', animation: 'fadeInUp 0.2s ease' }}>
          {/* Nav links */}
          {NAV_LINKS.map((link) => (
            <a key={link} href="#" onClick={() => setMobileNavOpen(false)}
              style={{ color: isDark ? '#ffffff' : '#F72D05', fontWeight: 700, fontSize: '14px', textDecoration: 'none', padding: '10px 12px', borderRadius: '8px', fontFamily: "'DM Sans', sans-serif", display: 'block' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-surface)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
              {link}
            </a>
          ))}
          {/* Auth buttons in mobile panel */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {currentUser ? (
              <>
                <div style={{ padding: '8px 12px', background: 'var(--bg-surface)', borderRadius: '8px' }}>
                  <p style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '13px', margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{currentUser.name}</p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '11px', margin: '2px 0 0', fontFamily: "'DM Sans', sans-serif" }}>{currentUser.email}</p>
                </div>
                {canAddCar && (
                  <button onClick={() => { setShowAddModal(true); setMobileNavOpen(false) }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: '#f97316', color: 'white', border: 'none', borderRadius: '8px', padding: '11px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                    <Plus size={15} /> Add Listing
                  </button>
                )}
                <button onClick={() => { logout(); setMobileNavOpen(false) }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: 'none', border: '1px solid #ef4444', borderRadius: '8px', padding: '11px', color: '#ef4444', fontWeight: 600, fontSize: '14px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                  <LogOut size={15} /> Sign Out
                </button>
              </>
            ) : (
              <>
                <button onClick={() => { setShowLoginModal(true); setMobileNavOpen(false) }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: 'none', border: '1px solid var(--nav-border)', borderRadius: '8px', padding: '11px', color: iconColor, fontWeight: 600, fontSize: '14px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                  <LogIn size={15} /> Sign In
                </button>
                <button onClick={() => { setShowRegisterModal(true); setMobileNavOpen(false) }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: '#f97316', color: 'white', border: 'none', borderRadius: '8px', padding: '11px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                  <UserPlus size={15} /> List Your Car
                </button>
              </>
            )}
            {/* Social links */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', paddingTop: '4px' }}>
              {SOCIAL.map(({ bg, Icon, label }) => (
                <button key={label} title={label}
                  style={{ width: '40px', height: '40px', borderRadius: '50%', background: bg, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <Icon />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </nav>
  )
}
