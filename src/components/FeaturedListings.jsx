import { useState } from 'react'
import {
  Search, SlidersHorizontal, MapPin, Heart,
  Eye, MessageCircle, ShoppingCart, Star,
  CheckCircle, XCircle, Tag, Trash2, X,
  ZoomIn, ChevronLeft, ChevronRight, Pencil, Save, RefreshCw,
} from 'lucide-react'
import CarSpecsBox from './CarSpecsBox'
import { useApp, REJECT_REASONS } from '../context/AppContext'

const TABS = ['All Cars', 'New Cars', 'Used Cars', 'Electric', 'SUV', 'Sedan', 'Featured']

function waLink(car, intent = 'inquiry') {
  const msg = intent === 'buy'
    ? `Hi! I'd like to buy the ${car.name} listed at ${car.price} on Somalicarhub. Please let me know how to proceed.`
    : `Hi! I'm interested in the ${car.name} listed at ${car.price} on Somalicarhub. Is it still available?`
  return `https://wa.me/?text=${encodeURIComponent(msg)}`
}

function CarSilhouette({ color }) {
  return (
    <svg viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '140px', height: '56px' }}>
      <path d="M170 52H30C22 52 16 46 16 40V38C16 34 18 30 22 28L50 22C58 18 68 16 80 16H120C132 16 142 18 148 22L176 28C180 30 184 34 184 38V40C184 46 178 52 170 52Z" fill={color} fillOpacity="0.85" />
      <path d="M60 22L68 14C70 12 74 10 80 10H118C124 10 128 12 130 14L140 22" fill={color} fillOpacity="0.6" stroke={color} strokeWidth="1" />
      <circle cx="55" cy="54" r="10" fill={color} fillOpacity="0.4" stroke={color} strokeWidth="2" />
      <circle cx="55" cy="54" r="5"  fill={color} fillOpacity="0.8" />
      <circle cx="145" cy="54" r="10" fill={color} fillOpacity="0.4" stroke={color} strokeWidth="2" />
      <circle cx="145" cy="54" r="5"  fill={color} fillOpacity="0.8" />
      <path d="M22 38H178" stroke={color} strokeWidth="1" strokeOpacity="0.3" />
    </svg>
  )
}

// ── Car Detail Modal ──────────────────────────────────────────────────────────

const PLACEHOLDER_IMGS = [
  'https://picsum.photos/seed/car1/640/380',
  'https://picsum.photos/seed/car2/640/380',
  'https://picsum.photos/seed/car3/640/380',
  'https://picsum.photos/seed/car4/640/380',
  'https://picsum.photos/seed/car5/640/380',
  'https://picsum.photos/seed/car6/640/380',
  'https://picsum.photos/seed/car7/640/380',
  'https://picsum.photos/seed/car8/640/380',
  'https://picsum.photos/seed/car9/640/380',
]

const CIRCLE_BTN = {
  width: '36px', height: '36px', borderRadius: '50%',
  background: 'white', border: 'none', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  boxShadow: '0 2px 8px rgba(0,0,0,0.22)', flexShrink: 0,
}

function CarDetailModal({ car, onClose }) {
  const { canEditListing, updateCar, resubmitCarEdit, toggleFavorite, favorites, currentUser } = useApp()
  const isSold = car.status === 'sold'
  const images = car.images?.length > 0 ? car.images : PLACEHOLDER_IMGS
  const total = images.length

  const isOwnCar = currentUser?.role === 'dealer' && car.submitterEmail === currentUser?.email
  const canEdit  = canEditListing || isOwnCar

  const [activeImg, setActiveImg] = useState(0)
  const liked = favorites.includes(car.id)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: car.name, price: car.price, year: car.year || '',
    km: car.km || '', fuel: car.fuel || '', cc: car.cc || '',
    trans: car.trans || '', type: car.type || '', location: car.location || '',
  })
  const [saved, setSaved] = useState(false)

  function saveEdit() {
    if (isOwnCar && !canEditListing) {
      resubmitCarEdit(car.id, editForm)
    } else {
      updateCar(car.id, editForm)
    }
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const prev = () => setActiveImg((i) => (i - 1 + total) % total)
  const next = () => setActiveImg((i) => (i + 1) % total)

  const SPECS = [
    { label: 'YEAR',         value: car.year },
    { label: 'MILEAGE',      value: car.km },
    { label: 'FUEL',         value: car.fuel },
    { label: 'ENGINE',       value: car.cc },
    { label: 'TRANSMISSION', value: car.trans },
    { label: 'TYPE',         value: car.type },
    { label: 'LOCATION',     value: car.location },
    { label: 'SELLER',       value: car.seller },
  ]

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: 'var(--bg-card)', borderRadius: '16px', width: '100%', maxWidth: '640px',
        maxHeight: '90vh', display: 'flex', flexDirection: 'column',
        boxShadow: '0 25px 80px rgba(0,0,0,0.5)', overflow: 'hidden',
      }}>

        {/* ── Main Photo ── */}
        <div style={{ position: 'relative', height: '380px', flexShrink: 0, background: '#111', overflow: 'hidden' }}>
          <img src={images[activeImg]} alt={car.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />

          {isSold && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ background: '#dc2626', color: 'white', padding: '8px 28px', borderRadius: '8px', fontSize: '22px', fontWeight: 800, letterSpacing: '5px', transform: 'rotate(-12deg)', fontFamily: "'Barlow Condensed', sans-serif" }}>SOLD</div>
            </div>
          )}

          {/* X close — top right */}
          <button onClick={onClose} style={{ ...CIRCLE_BTN, position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.55)', zIndex: 10 }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.8)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.55)')}>
            <X size={17} color="white" />
          </button>

          {/* Heart + Zoom — top left */}
          <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '8px', zIndex: 10 }}>
            <button onClick={() => toggleFavorite(car.id)} style={CIRCLE_BTN}>
              <Heart size={16} color={liked ? '#ef4444' : '#374151'} fill={liked ? '#ef4444' : 'none'} />
            </button>

            <button style={CIRCLE_BTN}>
              <ZoomIn size={16} color="#374151" />
            </button>
          </div>

          {/* Left arrow */}
          <button onClick={prev} style={{ ...CIRCLE_BTN, position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'rgba(255,255,255,0.92)' }}>
            <ChevronLeft size={19} color="#111827" />
          </button>

          {/* Right arrow */}
          <button onClick={next} style={{ ...CIRCLE_BTN, position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'rgba(255,255,255,0.92)' }}>
            <ChevronRight size={19} color="#111827" />
          </button>

          {/* Counter — bottom left */}
          <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(0,0,0,0.55)', color: 'white', fontSize: '12px', fontWeight: 700, padding: '4px 11px', borderRadius: '9999px', fontFamily: "'DM Sans', sans-serif", zIndex: 10 }}>
            {activeImg + 1}/{total}
          </div>

          {/* Watermark — bottom center */}
          <div style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.5px', fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap', zIndex: 10 }}>
            BE FORWARD Ref#:CD332506
          </div>
        </div>

        {/* ── Thumbnail Strip ── */}
        <div style={{ background: 'var(--bg-surface)', padding: '6px 8px', display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', flexShrink: 0 }}>
          {images.map((src, i) => (
            <div key={i} onClick={() => setActiveImg(i)}
              style={{ height: '72px', borderRadius: '6px', overflow: 'hidden', cursor: 'pointer', border: activeImg === i ? '2px solid #f97316' : '2px solid transparent', transition: 'border-color 0.15s', boxSizing: 'border-box' }}>
              <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          ))}
        </div>

        {/* ── Scrollable Info ── */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          <div style={{ padding: '14px 20px' }}>

            {/* Name + location row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', gap: '12px' }}>
              <h2 style={{ fontWeight: 700, fontSize: '17px', color: 'var(--text-primary)', margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{car.name}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                <MapPin size={12} color="#9ca3af" />
                <span style={{ color: 'var(--text-secondary)', fontSize: '12px', fontFamily: "'DM Sans', sans-serif" }}>{car.location}</span>
              </div>
            </div>

            {/* Price */}
            <p style={{ color: isSold ? 'var(--text-hint)' : 'var(--price-color)', fontWeight: 700, fontSize: '20px', margin: '0 0 10px', fontFamily: "'DM Sans', sans-serif", textDecoration: isSold ? 'line-through' : 'none' }}>
              {car.price}
            </p>

            {/* Specs grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', marginBottom: '10px' }}>
              {SPECS.map(({ label, value }) => (
                <div key={label} style={{ background: 'var(--bg-surface)', borderRadius: '7px', padding: '6px 10px', border: '1px solid var(--border)' }}>
                  <p style={{ color: 'var(--text-hint)', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 2px', fontFamily: "'DM Sans', sans-serif" }}>{label}</p>
                  <p style={{ color: 'var(--text-primary)', fontSize: '12px', fontWeight: 700, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{value || '—'}</p>
                </div>
              ))}
            </div>

            {/* Listed by */}
            <p style={{ color: 'var(--text-hint)', fontSize: '11px', margin: '0 0 10px', fontFamily: "'DM Sans', sans-serif" }}>
              Listed by: <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{car.dealerName || 'Admin'}</span>
            </p>

            {/* ── Edit Listing — admin/staff + car owner (dealer) ── */}
            {canEdit && (
              <div style={{ marginBottom: '12px' }}>
                {!editing ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button onClick={() => setEditing(true)}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', background: '#EBC51E', border: '1px solid #c9a800', borderRadius: '8px', color: '#000000', fontWeight: 600, fontSize: '12px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                      <Pencil size={13} /> Edit Listing
                    </button>
                    {saved && (
                      <span style={{ color: '#22c55e', fontSize: '12px', fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle size={12} /> {isOwnCar && !canEditListing ? 'Submitted — awaiting approval' : 'Saved'}
                      </span>
                    )}
                  </div>
                ) : (
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px 16px' }}>
                    <p style={{ color: '#000000', fontWeight: 700, fontSize: '13px', margin: '0 0 4px', fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Pencil size={13} /> Edit Listing
                    </p>
                    {isOwnCar && !canEditListing && (
                      <p style={{ color: '#f97316', fontSize: '11px', margin: '0 0 12px', fontFamily: "'DM Sans', sans-serif" }}>
                        Changes will be sent for staff/admin approval before going live.
                      </p>
                    )}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: isOwnCar && !canEditListing ? '0' : '12px' }}>
                      {[
                        { label: 'Name',         key: 'name',     full: true  },
                        { label: 'Price',        key: 'price',    full: false },
                        { label: 'Year',         key: 'year',     full: false },
                        { label: 'Mileage',      key: 'km',       full: false },
                        { label: 'Fuel',         key: 'fuel',     full: false },
                        { label: 'Engine',       key: 'cc',       full: false },
                        { label: 'Transmission', key: 'trans',    full: false },
                        { label: 'Type',         key: 'type',     full: false },
                        { label: 'Location',     key: 'location', full: false },
                      ].map(({ label, key, full }) => (
                        <div key={key} style={{ gridColumn: full ? '1 / -1' : 'auto' }}>
                          <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '4px', fontFamily: "'DM Sans', sans-serif" }}>{label}</label>
                          <input
                            value={editForm[key]}
                            onChange={(e) => setEditForm((f) => ({ ...f, [key]: e.target.value }))}
                            style={{ width: '100%', background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '7px', padding: '7px 10px', color: '#0f172a', fontSize: '13px', fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box' }}
                          />
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                      <button onClick={saveEdit}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, justifyContent: 'center', padding: '9px', background: isOwnCar && !canEditListing ? '#f97316' : '#3b5bdb', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 700, fontSize: '13px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                        <Save size={14} /> {isOwnCar && !canEditListing ? 'Submit for Approval' : 'Save Changes'}
                      </button>
                      <button onClick={() => setEditing(false)}
                        style={{ padding: '9px 18px', background: '#e5e7eb', border: '1px solid #d1d5db', borderRadius: '8px', color: '#374151', fontWeight: 600, fontSize: '13px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Action buttons */}
            {!isSold ? (
              <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                <a href={waLink(car, 'inquiry')} target="_blank" rel="noopener noreferrer"
                  style={{ flex: 1, height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#22c55e', borderRadius: '10px', color: 'white', fontWeight: 700, fontSize: '15px', textDecoration: 'none', fontFamily: "'DM Sans', sans-serif" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#16a34a')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#22c55e')}>
                  <MessageCircle size={17} /> WhatsApp
                </a>
                <a href={waLink(car, 'buy')} target="_blank" rel="noopener noreferrer"
                  style={{ flex: 1, height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#3b5bdb', borderRadius: '10px', color: 'white', fontWeight: 700, fontSize: '15px', textDecoration: 'none', fontFamily: "'DM Sans', sans-serif" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#2f4ac9')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#3b5bdb')}>
                  <ShoppingCart size={17} /> Buy Now
                </a>
              </div>
            ) : (
              <div style={{ height: '48px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', fontWeight: 600, fontSize: '14px', fontFamily: "'DM Sans', sans-serif", marginBottom: '12px' }}>
                This car is no longer available
              </div>
            )}

            {/* All photos link */}
            <div style={{ textAlign: 'center' }}>
              <button style={{ background: 'none', border: 'none', color: '#3b82f6', fontWeight: 700, fontSize: '12px', letterSpacing: '0.6px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                ALL PHOTOS ({total})
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

// ── Reject notify helpers ─────────────────────────────────────────────────────

function buildMsg(car, reason) {
  return `Dear ${car.dealerName || 'Dealer'},\n\nYour car listing "${car.name}" submitted to Somalicarhub has been rejected.\n\nReason: ${reason}\n\nPlease fix the issue and resubmit your listing.\n\nRegards,\nSomalicarhub Team`
}

function WaIconSmall() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

// ── Car Card ──────────────────────────────────────────────────────────────────

function CarCard({ car, onDetails }) {
  const { role, markSold, unmarkSold, deleteCar, approveCar, rejectCar,
          canApprove, canMarkSold, canDeleteListing,
          favorites, toggleFavorite } = useApp()
  const hasElevated = canApprove || canMarkSold || canDeleteListing
  const liked = favorites.includes(car.id)
  const [confirmDelete, setConfirmDelete]   = useState(false)
  const [confirmSold, setConfirmSold]       = useState(false)
  const [confirmUnmark, setConfirmUnmark]   = useState(false)
  const [rejecting, setRejecting]           = useState(false)
  const [rejectReason, setRejectReason]     = useState('')
  const [notifying, setNotifying]           = useState(false)

  function doRejectCard() {
    rejectCar(car.id, rejectReason)
    setNotifying(false)
    setRejecting(false)
    setRejectReason('')
  }

  const isSold    = car.status === 'sold'
  const isPending = car.status === 'pending'

  return (
    <div
      className="flex flex-col transition-transform duration-200"
      style={{ borderRadius: '16px', background: 'var(--bg-card)', boxShadow: 'var(--shadow-card)', overflow: 'hidden', cursor: 'pointer' }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
    >
      {/* ── Image Area ── */}
      <div className="relative flex items-center justify-center" style={{ background: car.imageBg, height: '160px', overflow: 'hidden', cursor: 'pointer' }}
        onClick={() => onDetails(car)}>

        {car.images && car.images.length > 0 && (
          <img src={car.images[0]} alt={car.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }} />
        )}

        {isSold && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
            <div style={{ background: '#dc2626', color: 'white', padding: '8px 28px', borderRadius: '8px', fontSize: '22px', fontWeight: 800, letterSpacing: '5px', transform: 'rotate(-12deg)', boxShadow: '0 4px 24px rgba(220,38,38,0.5)', fontFamily: "'Barlow Condensed', sans-serif" }}>
              SOLD
            </div>
          </div>
        )}

        {isPending && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
            <div style={{ background: '#d97706', color: 'white', padding: '6px 18px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', fontFamily: "'DM Sans', sans-serif" }}>
              PENDING REVIEW
            </div>
          </div>
        )}

        <div className="absolute top-3 left-3 flex flex-col gap-1" style={{ zIndex: 3 }}>
          <div className="flex items-center gap-1">
            <span style={{ background: car.badge === 'NEW' ? '#3b5bdb' : '#f97316', color: 'white', fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '9999px', fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.5px' }}>
              {car.badge}
            </span>
            <span style={{ background: '#7c3aed', color: 'white', fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '9999px', fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.5px' }}>
              {car.seller}
            </span>
          </div>
          {car.featured && (
            <span style={{ background: '#f59e0b', color: 'white', fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '9999px', fontFamily: "'DM Sans', sans-serif", display: 'inline-flex', alignItems: 'center', gap: '3px', width: 'fit-content' }}>
              <Star size={9} fill="white" /> FEATURED
            </span>
          )}
          {car.dealType && (
            <span style={{ background: '#22c55e', color: 'white', fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '9999px', fontFamily: "'DM Sans', sans-serif", width: 'fit-content' }}>
              {car.dealType}
            </span>
          )}
        </div>

        <button className="absolute top-3 right-3 flex items-center justify-center" style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', zIndex: 3, transition: 'transform 0.15s' }}
          onClick={(e) => { e.stopPropagation(); toggleFavorite(car.id) }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}>
          <Heart size={15} color={liked ? '#ef4444' : '#9ca3af'} fill={liked ? '#ef4444' : 'none'} />
        </button>

        {(!car.images || car.images.length === 0) && <CarSilhouette color={car.carColor} />}
      </div>

      {/* ── Card Body ── */}
      <div className="flex flex-col gap-2" style={{ padding: '16px' }}>
        <div>
          <p style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)', fontFamily: "'DM Sans', sans-serif", margin: 0 }}>{car.name}</p>
          <p style={{ fontWeight: 700, fontSize: '20px', color: isSold ? 'var(--text-hint)' : 'var(--price-color)', fontFamily: "'DM Sans', sans-serif", margin: '2px 0 0', textDecoration: isSold ? 'line-through' : 'none' }}>{car.price}</p>
          {isSold && <p style={{ color: '#ef4444', fontSize: '12px', fontWeight: 700, margin: '2px 0 0', fontFamily: "'DM Sans', sans-serif" }}>This car has been sold</p>}
        </div>

        <CarSpecsBox car={car} />

        <div className="flex flex-wrap gap-1">
          {[car.year, car.km, car.fuel, car.cc !== '—' ? car.cc : null, car.trans]
            .filter(Boolean)
            .map((spec) => (
              <span key={spec} style={{ background: 'var(--bg-surface)', borderRadius: '4px', fontSize: '11px', padding: '2px 7px', color: 'var(--text-secondary)', fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
                {spec}
              </span>
            ))}
        </div>

        <div className="flex items-center gap-1">
          <MapPin size={12} color="#9ca3af" />
          <span style={{ color: 'var(--text-secondary)', fontSize: '12px', fontFamily: "'DM Sans', sans-serif" }}>{car.location}</span>
        </div>

        {/* ── Action Buttons ── */}
        <div className="flex gap-2 mt-1">

          {/* Approve / Reject — users with approveListings permission */}
          {canApprove && isPending && (
            <div className="flex flex-col gap-2 w-full">

              {/* Step 1 — reason picker */}
              {rejecting && !notifying && (
                <div style={{ background: '#1a0808', border: '1px solid #7f1d1d', borderRadius: '8px', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <p style={{ color: '#fca5a5', fontSize: '10px', fontWeight: 700, margin: 0, fontFamily: "'DM Sans', sans-serif", textTransform: 'uppercase', letterSpacing: '0.5px' }}>Rejection reason *</p>
                  {REJECT_REASONS.map((r) => (
                    <label key={r} onClick={() => setRejectReason(r)}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: '4px 6px', borderRadius: '5px', background: rejectReason === r ? 'rgba(220,38,38,0.2)' : 'transparent', border: `1px solid ${rejectReason === r ? '#dc2626' : 'transparent'}` }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: `2px solid ${rejectReason === r ? '#f87171' : '#475569'}`, background: rejectReason === r ? '#dc2626' : 'transparent', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {rejectReason === r && <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'white' }} />}
                      </div>
                      <span style={{ color: rejectReason === r ? '#fca5a5' : '#94a3b8', fontSize: '11px', fontFamily: "'DM Sans', sans-serif" }}>{r}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* Step 2 — notify panel */}
              {notifying && (
                <div style={{ background: '#0a1628', border: '1px solid #1d4ed8', borderRadius: '8px', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  <p style={{ color: '#93c5fd', fontSize: '11px', fontWeight: 700, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
                    Notify dealer?
                  </p>
                  <p style={{ color: '#f87171', fontSize: '10px', margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{rejectReason}</p>
                  <div className="flex gap-1 flex-wrap">
                    {car.submitterPhone && (
                      <a href={`https://wa.me/${car.submitterPhone.replace(/\D/g,'')}?text=${encodeURIComponent(buildMsg(car, rejectReason))}`}
                        target="_blank" rel="noreferrer" onClick={doRejectCard}
                        style={{ flex: 1, minWidth: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '6px 4px', background: '#14532d', border: '1px solid #16a34a', borderRadius: '6px', color: '#4ade80', fontWeight: 600, fontSize: '11px', cursor: 'pointer', textDecoration: 'none', fontFamily: "'DM Sans', sans-serif" }}>
                        <WaIconSmall /> WhatsApp
                      </a>
                    )}
                    {car.submitterEmail && (
                      <a href={`mailto:${car.submitterEmail}?subject=${encodeURIComponent(`"${car.name}" rejected – Somalicarhub`)}&body=${encodeURIComponent(buildMsg(car, rejectReason))}`}
                        onClick={doRejectCard}
                        style={{ flex: 1, minWidth: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '6px 4px', background: '#1d3a8a', border: '1px solid #3b82f6', borderRadius: '6px', color: '#93c5fd', fontWeight: 600, fontSize: '11px', cursor: 'pointer', textDecoration: 'none', fontFamily: "'DM Sans', sans-serif" }}>
                        ✉ Email
                      </a>
                    )}
                    <button onClick={doRejectCard}
                      style={{ flex: 1, minWidth: '50px', padding: '6px 4px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#94a3b8', fontWeight: 600, fontSize: '11px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                      Skip
                    </button>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                {!rejecting && !notifying && (
                  <>
                    <button onClick={() => approveCar(car.id)}
                      className="flex items-center justify-center gap-1 flex-1"
                      style={{ background: '#14532d', border: '1px solid #16a34a', borderRadius: '8px', padding: '7px 4px', fontSize: '12px', fontWeight: 600, color: '#4ade80', fontFamily: "'DM Sans', sans-serif", cursor: 'pointer' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#166534')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = '#14532d')}>
                      <CheckCircle size={13} /> Approve
                    </button>
                    <button onClick={() => setRejecting(true)}
                      className="flex items-center justify-center gap-1 flex-1"
                      style={{ background: '#3b0a0a', border: '1px solid #dc2626', borderRadius: '8px', padding: '7px 4px', fontSize: '12px', fontWeight: 600, color: '#f87171', fontFamily: "'DM Sans', sans-serif", cursor: 'pointer' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#450a0a')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = '#3b0a0a')}>
                      <XCircle size={13} /> Reject
                    </button>
                  </>
                )}
                {rejecting && !notifying && (
                  <>
                    <button onClick={() => { if (rejectReason) setNotifying(true) }} disabled={!rejectReason}
                      className="flex items-center justify-center gap-1 flex-1"
                      style={{ background: rejectReason ? '#dc2626' : '#3b1212', border: `1px solid ${rejectReason ? '#dc2626' : '#5a1a1a'}`, borderRadius: '8px', padding: '7px 4px', fontSize: '12px', fontWeight: 700, color: rejectReason ? 'white' : '#7f1d1d', fontFamily: "'DM Sans', sans-serif", cursor: rejectReason ? 'pointer' : 'not-allowed' }}>
                      <XCircle size={13} /> Confirm
                    </button>
                    <button onClick={() => { setRejecting(false); setRejectReason('') }}
                      className="flex items-center justify-center flex-1"
                      style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '7px 4px', fontSize: '12px', fontWeight: 600, color: '#94a3b8', fontFamily: "'DM Sans', sans-serif", cursor: 'pointer' }}>
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Mark Sold / Delete — users with respective permissions, active cars */}
          {(canMarkSold || canDeleteListing) && !isPending && !isSold && (
            <>
              {canMarkSold && !confirmSold && (
                <button onClick={() => setConfirmSold(true)}
                  className="flex items-center justify-center gap-1 flex-1"
                  style={{ background: '#451a03', border: '1px solid #d97706', borderRadius: '8px', padding: '7px 4px', fontSize: '12px', fontWeight: 600, color: '#fbbf24', fontFamily: "'DM Sans', sans-serif", cursor: 'pointer' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#78350f')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#451a03')}>
                  <Tag size={13} /> Mark Sold
                </button>
              )}
              {canMarkSold && confirmSold && (
                <>
                  <button onClick={() => { markSold(car.id); setConfirmSold(false) }}
                    style={{ flex: 1, padding: '7px 4px', background: '#d97706', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 700, fontSize: '12px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                    Confirm Sold?
                  </button>
                  <button onClick={() => setConfirmSold(false)}
                    style={{ flex: 1, padding: '7px 4px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontWeight: 600, fontSize: '12px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                    Cancel
                  </button>
                </>
              )}
              {canDeleteListing && (!confirmDelete ? (
                <button onClick={(e) => { e.stopPropagation(); setConfirmDelete(true) }}
                  className="flex items-center justify-center gap-1 flex-1"
                  style={{ background: '#1c0a0a', border: '1px solid #7f1d1d', borderRadius: '8px', padding: '7px 4px', fontSize: '12px', fontWeight: 600, color: '#f87171', fontFamily: "'DM Sans', sans-serif", cursor: 'pointer' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#3b0a0a')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#1c0a0a')}>
                  <Trash2 size={13} /> Delete
                </button>
              ) : (
                <>
                  <button onClick={() => deleteCar(car.id)}
                    style={{ flex: 1, padding: '7px 4px', background: '#dc2626', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 700, fontSize: '12px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                    Confirm?
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setConfirmDelete(false) }}
                    style={{ flex: 1, padding: '7px 4px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontWeight: 600, fontSize: '12px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                    Cancel
                  </button>
                </>
              ))}
            </>
          )}

          {/* Sold car actions — undo + delete */}
          {(canMarkSold || canDeleteListing) && isSold && (
            <>
              {canMarkSold && !confirmUnmark && (
                <button onClick={() => setConfirmUnmark(true)}
                  className="flex items-center justify-center gap-1 flex-1"
                  style={{ background: '#1e3a5f', border: '1px solid #3b82f6', borderRadius: '8px', padding: '7px 4px', fontSize: '12px', fontWeight: 600, color: '#93c5fd', fontFamily: "'DM Sans', sans-serif", cursor: 'pointer' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#1d4ed8')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#1e3a5f')}>
                  <RefreshCw size={13} /> Mark Available
                </button>
              )}
              {canMarkSold && confirmUnmark && (
                <>
                  <button onClick={() => { unmarkSold(car.id); setConfirmUnmark(false) }}
                    style={{ flex: 1, padding: '7px 4px', background: '#1d4ed8', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 700, fontSize: '12px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                    Restore?
                  </button>
                  <button onClick={() => setConfirmUnmark(false)}
                    style={{ flex: 1, padding: '7px 4px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontWeight: 600, fontSize: '12px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                    Cancel
                  </button>
                </>
              )}
              {canDeleteListing && !confirmUnmark && (
                <button onClick={() => deleteCar(car.id)}
                  className="flex items-center justify-center gap-1 flex-1"
                  style={{ background: '#1c0a0a', border: '1px solid #7f1d1d', borderRadius: '8px', padding: '7px 4px', fontSize: '12px', fontWeight: 600, color: '#f87171', fontFamily: "'DM Sans', sans-serif", cursor: 'pointer' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#3b0a0a')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#1c0a0a')}>
                  <Trash2 size={13} /> Remove
                </button>
              )}
            </>
          )}

          {/* Buyer buttons — only for users with NO elevated permissions */}
          {!hasElevated && (
            <>
              <button onClick={() => onDetails(car)}
                className="flex items-center justify-center gap-1 flex-1"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', padding: '7px 4px', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'DM Sans', sans-serif", cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-surface)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--bg-card)')}>
                <Eye size={13} /> Details
              </button>
              {!isSold ? (
                <a href={waLink(car, 'inquiry')} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1 flex-1"
                  style={{ background: '#22c55e', border: 'none', borderRadius: '8px', padding: '7px 4px', fontSize: '12px', fontWeight: 600, color: 'white', fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', textDecoration: 'none', display: 'flex' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#16a34a')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#22c55e')}>
                  <MessageCircle size={13} /> WhatsApp
                </a>
              ) : (
                <span className="flex items-center justify-center gap-1 flex-1"
                  style={{ background: '#e5e7eb', borderRadius: '8px', padding: '7px 4px', fontSize: '12px', fontWeight: 600, color: '#9ca3af', fontFamily: "'DM Sans', sans-serif", cursor: 'not-allowed', display: 'flex' }}>
                  <MessageCircle size={13} /> WhatsApp
                </span>
              )}
              {!isSold ? (
                <a href={waLink(car, 'buy')} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1 flex-1"
                  style={{ background: '#3b5bdb', border: 'none', borderRadius: '8px', padding: '7px 4px', fontSize: '12px', fontWeight: 600, color: 'white', fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', textDecoration: 'none', display: 'flex' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#2f4ac9')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#3b5bdb')}>
                  <ShoppingCart size={13} /> Buy Now
                </a>
              ) : (
                <span className="flex items-center justify-center gap-1 flex-1"
                  style={{ background: '#e5e7eb', borderRadius: '8px', padding: '7px 4px', fontSize: '12px', fontWeight: 600, color: '#9ca3af', fontFamily: "'DM Sans', sans-serif", cursor: 'not-allowed', display: 'flex' }}>
                  <ShoppingCart size={13} /> Buy Now
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Featured Listings ─────────────────────────────────────────────────────────

export default function FeaturedListings() {
  const { cars, role, canApprove, canMarkSold, canDeleteListing } = useApp()
  const [activeTab, setActiveTab] = useState('All Cars')
  const [search, setSearch] = useState('')
  const [detailCarId, setDetailCarId] = useState(null)
  const detailCar = detailCarId ? cars.find((c) => c.id === detailCarId) ?? null : null

  const visibleCars = cars.filter((c) => {
    if (role === 'admin' || canApprove || canMarkSold || canDeleteListing) return c.status !== 'rejected'
    if (role === 'dealer') return c.status === 'active' || c.status === 'sold' || c.status === 'pending'
    return c.status === 'active' || c.status === 'sold'
  })

  const tabFiltered = visibleCars.filter((c) => {
    if (activeTab === 'All Cars') return true
    if (activeTab === 'New Cars') return c.badge === 'NEW'
    if (activeTab === 'Used Cars') return c.badge === 'USED'
    if (activeTab === 'Electric') return c.fuel === 'Electric'
    if (activeTab === 'SUV') return c.type === 'SUV'
    if (activeTab === 'Sedan') return c.type === 'Sedan'
    if (activeTab === 'Featured') return c.featured
    return true
  })

  const displayed = tabFiltered.filter((c) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      c.name.toLowerCase().includes(q) ||
      c.location.toLowerCase().includes(q) ||
      c.fuel.toLowerCase().includes(q) ||
      c.type?.toLowerCase().includes(q)
    )
  })

  return (
    <section style={{ background: 'var(--bg-section)', padding: 'clamp(24px, 4vw, 48px) clamp(16px, 3vw, 32px)', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 style={{ fontWeight: 800, fontSize: '28px', color: 'var(--text-primary)', margin: '0 0 4px', fontFamily: "'DM Sans', sans-serif" }}>Featured Listings</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>Handpicked top deals from verified sellers</p>
          </div>
          <a href="#" style={{ color: '#3b82f6', fontWeight: 600, fontSize: '14px', textDecoration: 'none', whiteSpace: 'nowrap', marginTop: '4px' }}>View all →</a>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2 flex-1" style={{ border: '1px solid var(--border-input)', borderRadius: '10px', height: '48px', padding: '0 16px', background: 'var(--bg-input)' }}>
            <Search size={16} color="var(--text-hint)" />
            <input type="text" placeholder="Search Toyota, BMW, SUV, Mogadishu..." value={search} onChange={(e) => setSearch(e.target.value)}
              style={{ border: 'none', outline: 'none', flex: 1, fontSize: '14px', color: 'var(--text-primary)', fontFamily: "'DM Sans', sans-serif", background: 'transparent' }} />
          </div>
          <button className="flex items-center gap-2"
            style={{ border: '1px solid var(--border)', borderRadius: '10px', background: 'var(--bg-card)', padding: '0 16px', height: '48px', color: 'var(--text-primary)', fontWeight: 600, fontSize: '14px', fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', whiteSpace: 'nowrap' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-surface)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--bg-card)')}>
            <SlidersHorizontal size={16} /> Filters
          </button>
        </div>

        <div className="flex items-center flex-wrap gap-2 mb-3">
          {TABS.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ background: activeTab === tab ? '#f97316' : 'var(--tab-bg)', color: activeTab === tab ? 'white' : 'var(--tab-text)', border: activeTab === tab ? 'none' : '1px solid var(--tab-border)', borderRadius: '9999px', fontSize: '13px', padding: '6px 16px', fontFamily: "'DM Sans', sans-serif", fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s' }}>
              {tab}
            </button>
          ))}
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
          {displayed.length} result{displayed.length !== 1 ? 's' : ''} found
          {role === 'admin' && cars.filter(c => c.status === 'pending').length > 0 && (
            <span style={{ marginLeft: '12px', background: '#451a03', color: '#fb923c', fontSize: '11px', fontWeight: 700, padding: '2px 10px', borderRadius: '9999px' }}>
              {cars.filter(c => c.status === 'pending').length} pending approval
            </span>
          )}
        </p>

        {displayed.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#9ca3af' }}>
            <Search size={36} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.4 }} />
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '15px' }}>No listings match your search.</p>
          </div>
        ) : (
          <div className="resp-grid">
            {displayed.map((car) => <CarCard key={car.id} car={car} onDetails={(c) => setDetailCarId(c.id)} />)}
          </div>
        )}
      </div>

      {detailCar && <CarDetailModal car={detailCar} onClose={() => setDetailCarId(null)} />}
    </section>
  )
}
