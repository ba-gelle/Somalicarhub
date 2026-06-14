import { useState, useRef } from 'react'
import { X, Car, ImagePlus } from 'lucide-react'
import { useApp } from '../context/AppContext'

const BRANDS = [
  'Toyota', 'Nissan', 'Honda', 'BMW', 'Mercedes-Benz', 'Hyundai', 'Kia',
  'Land Rover', 'Mitsubishi', 'Mazda', 'Ford', 'Chevrolet', 'Audi',
  'Volkswagen', 'Jeep', 'Lexus', 'Subaru', 'Suzuki', 'Isuzu', 'Peugeot',
  'Renault', 'Volvo', 'Porsche', 'Range Rover', 'Infiniti', 'Tesla',
  'GMC', 'Hummer', 'Cadillac', 'Dodge', 'Other',
]

const CITIES = ['Mogadishu', 'Hargeisa', 'Bosaso', 'Garowe']

const CARD_THEME = {
  NEW:  { imageBg: '#1a1f5e', carColor: '#6b8cff' },
  USED: { imageBg: '#2e1f00', carColor: '#fbbf24' },
}

const EMPTY = {
  brand: 'Toyota', model: '', year: '', km: '',
  fuel: 'Petrol', cc: '', trans: 'Auto',
  price: '', location: 'Bosaso', badge: 'NEW',
}

const L = {
  fontSize: '11px', fontWeight: 850, color: '#000000',
  textTransform: 'uppercase', letterSpacing: '1px',
  marginBottom: '6px', display: 'block', fontFamily: "'DM Sans', sans-serif",
}

const I = {
  width: '100%', background: '#F5F5F5', border: '1px solid #374151',
  borderRadius: '8px', padding: '12px 14px', color: '#000000',
  fontSize: '16px', fontWeight: 500, fontFamily: "'DM Sans', sans-serif",
  outline: 'none', boxSizing: 'border-box',
}

const S = { ...I, appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer' }

function SectionHead({ title }) {
  return (
    <p style={{ color: '#075CF0', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 12px', fontFamily: "'DM Sans', sans-serif" }}>
      {title}
    </p>
  )
}

export default function AddCarModal() {
  const { setShowAddModal, addCar, role } = useApp()
  const [form, setForm]       = useState(EMPTY)
  const [images, setImages]   = useState([])
  const [errors, setErrors]   = useState({})
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef()

  function set(key, val) {
    setForm((f) => ({ ...f, [key]: val }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  function validate() {
    const e = {}
    if (!form.model.trim()) e.model = 'Required'
    if (!form.year.trim())  e.year  = 'Required'
    if (!form.price.trim()) e.price = 'Required'
    return e
  }

  function readFiles(files) {
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return
      const reader = new FileReader()
      reader.onload = (ev) =>
        setImages((prev) => [...prev, { url: ev.target.result, name: file.name }])
      reader.readAsDataURL(file)
    })
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    readFiles(e.dataTransfer.files)
  }

  function removeImage(idx) {
    setImages((prev) => prev.filter((_, i) => i !== idx))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    const theme = CARD_THEME[form.badge]
    addCar({
      name:     `${form.brand} ${form.model}`.trim(),
      price:    form.price.trim().startsWith('$') ? form.price.trim() : `$${form.price.trim()}`,
      year:     form.year.trim(),
      km:       form.km ? `${form.km} km` : '0 km',
      fuel:     form.fuel,
      cc:       form.cc.trim() || '—',
      trans:    form.trans,
      location: form.location,
      badge:    form.badge,
      seller:   'DEALER',
      type:     form.fuel === 'EV' ? 'Electric' : 'Sedan',
      imageBg:  theme.imageBg,
      carColor: theme.carColor,
      images:   images.map((img) => img.url),
    })
  }

  const isStaff = role === 'staff' || role === 'admin'

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
      onClick={(e) => e.target === e.currentTarget && setShowAddModal(false)}
    >
      <div style={{ background: '#FFFFFF', borderRadius: '16px', width: '100%', maxWidth: '580px', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 80px rgba(0,0,0,0.5)' }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px 16px', position: 'sticky', top: 0, background: '#FFFFFF', zIndex: 2, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: '#FF8800', borderRadius: '6px', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Car size={24} color="white" />
            </div>
            <div>
              <p style={{ color: '#000000', fontWeight: 700, fontSize: '17px', margin: 0, fontFamily: "'Barlow Condensed', sans-serif" }}>Add New Listing</p>
              <p style={{ color: '#000000', fontSize: '12px', fontWeight: 500, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
                {isStaff ? 'Publishes immediately' : 'Submitted for admin approval'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowAddModal(false)}
            style={{ background: 'none', border: 'none', color: '#000000', cursor: 'pointer', display: 'flex', padding: '4px', borderRadius: '6px', transition: 'color 0.15s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#000000')}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1 }}>
          <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* ── Section 1: Basic Information ── */}
            <div>
              <SectionHead title="Basic Information" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={L}>Brand</label>
                  <select value={form.brand} onChange={(e) => set('brand', e.target.value)} style={S}>
                    {BRANDS.map((b) => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label style={L}>Model *</label>
                  <input
                    className="add-modal-input"
                    placeholder="e.g. Land Cruiser"
                    value={form.model}
                    onChange={(e) => set('model', e.target.value)}
                    style={{ ...I, borderColor: errors.model ? '#ef4444' : '#374151' }}
                  />
                  {errors.model && <p style={{ color: '#ef4444', fontSize: '11px', margin: '4px 0 0', fontFamily: "'DM Sans', sans-serif" }}>{errors.model}</p>}
                </div>
              </div>
            </div>

            {/* ── Section 2: Specifications ── */}
            <div>
              <SectionHead title="Specifications" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                {/* Year | Odometer */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={L}>Year *</label>
                    <input
                      className="add-modal-input"
                      placeholder="e.g. 2004"
                      value={form.year}
                      onChange={(e) => set('year', e.target.value)}
                      style={{ ...I, borderColor: errors.year ? '#ef4444' : '#374151' }}
                    />
                    {errors.year && <p style={{ color: '#ef4444', fontSize: '11px', margin: '4px 0 0', fontFamily: "'DM Sans', sans-serif" }}>{errors.year}</p>}
                  </div>
                  <div>
                    <label style={L}>Odometer (km)</label>
                    <input className="add-modal-input" placeholder="e.g. 15,000" value={form.km} onChange={(e) => set('km', e.target.value)} style={I} />
                  </div>
                </div>

                {/* Fuel | Engine CC | Transmission */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={L}>Fuel Type</label>
                    <select value={form.fuel} onChange={(e) => set('fuel', e.target.value)} style={S}>
                      {['Petrol', 'Diesel', 'Hybrid', 'EV'].map((f) => <option key={f}>{f}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={L}>Engine CC</label>
                    <input className="add-modal-input" placeholder="e.g. 2,000cc" value={form.cc} onChange={(e) => set('cc', e.target.value)} style={I} />
                  </div>
                  <div>
                    <label style={L}>Transmission</label>
                    <select value={form.trans} onChange={(e) => set('trans', e.target.value)} style={S}>
                      {['Auto', 'Manual'].map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Section 3: Listing Details ── */}
            <div>
              <SectionHead title="Listing Details" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                {/* Price | Location */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={L}>Price (USD) *</label>
                    <input
                      className="add-modal-input"
                      placeholder="e.g. 45000"
                      value={form.price}
                      onChange={(e) => set('price', e.target.value)}
                      style={{ ...I, borderColor: errors.price ? '#ef4444' : '#374151' }}
                    />
                    {errors.price && <p style={{ color: '#ef4444', fontSize: '11px', margin: '4px 0 0', fontFamily: "'DM Sans', sans-serif" }}>{errors.price}</p>}
                  </div>
                  <div>
                    <label style={L}>Location</label>
                    <select value={form.location} onChange={(e) => set('location', e.target.value)} style={S}>
                      {CITIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                {/* NEW / USED toggle */}
                <div>
                  <label style={L}>Type</label>
                  <div style={{ display: 'flex', borderRadius: '8px', overflow: 'hidden' }}>
                    {['NEW', 'USED'].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => set('badge', opt)}
                        style={{
                          flex: 1, height: '44px', border: 'none', cursor: 'pointer',
                          fontWeight: form.badge === opt ? 700 : 500,
                          fontSize: '14px', fontFamily: "'DM Sans', sans-serif",
                          background: form.badge === opt ? '#3b5bdb' : '#2a3247',
                          color: form.badge === opt ? '#ffffff' : '#e2e8f0',
                          transition: 'all 0.15s',
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Section 4: Car Photos ── */}
            <div>
              <SectionHead title="Car Photos" />
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                style={{
                  background: '#F5F5F5',
                  border: `2px dashed ${dragging ? '#000000' : '#374151'}`,
                  borderRadius: '12px',
                  height: '120px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  cursor: 'pointer', transition: 'border-color 0.15s',
                }}
                onMouseEnter={(e) => { if (!dragging) e.currentTarget.style.borderColor = '#000000' }}
                onMouseLeave={(e) => { if (!dragging) e.currentTarget.style.borderColor = '#374151' }}
              >
                <ImagePlus size={28} color="#000000" />
                <p style={{ color: '#000000', fontSize: '15px', fontWeight: 500, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
                  Click to upload or drag & drop
                </p>
                <p style={{ color: '#000000', fontSize: '13px', fontWeight: 500, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
                  JPG · PNG · WebP · Multiple files allowed
                </p>
              </div>
              <input
                ref={fileRef}
                type="file"
                multiple
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => { readFiles(e.target.files); e.target.value = '' }}
              />

              {images.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '12px' }}>
                  {images.map((img, i) => (
                    <div key={i} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', aspectRatio: '4/3', background: '#2a3247' }}>
                      <img src={img.url} alt={`img-${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button type="button" onClick={() => removeImage(i)}
                        style={{ position: 'absolute', top: '5px', right: '5px', width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(0,0,0,0.7)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                        <X size={11} />
                      </button>
                      {i === 0 && (
                        <span style={{ position: 'absolute', bottom: '5px', left: '5px', background: '#3b5bdb', color: 'white', fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', fontFamily: "'DM Sans', sans-serif" }}>
                          COVER
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Action Buttons ── */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{ flex: 1, height: '48px', background: '#2a3247', border: '1px solid #374151', borderRadius: '8px', color: '#e2e8f0', fontWeight: 600, fontSize: '14px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{ flex: 2, height: '48px', background: '#3b5bdb', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 700, fontSize: '14px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.15s' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#2f4ec7')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#3b5bdb')}
              >
                ✓ {isStaff ? 'Add Listing' : 'Submit for Approval'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}
