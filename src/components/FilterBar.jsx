import { useState } from 'react'
import { ChevronDown, MapPin, DollarSign, Tag, Search } from 'lucide-react'

const FILTERS = [
  {
    id: 'region',
    label: 'Somalia Regions',
    Icon: MapPin,
    options: ['All Cities (Somalia)', 'Mogadishu', 'Hargeisa', 'Bosaso', 'Garowe', 'Kismayo'],
  },
  {
    id: 'condition',
    label: 'Listing Conditions',
    Icon: Tag,
    options: ['New and Used', 'New Only', 'Used Only'],
  },
  {
    id: 'budget',
    label: 'Budget',
    Icon: DollarSign,
    options: ['Any', 'Under $10K', '$10K–$30K', '$30K–$60K', '$60K–$100K', 'Above $100K'],
  },
]

export default function FilterBar() {
  const [values, setValues] = useState({
    region:    FILTERS[0].options[0],
    condition: FILTERS[1].options[0],
    budget:    FILTERS[2].options[0],
  })
  const [hoveredFilter, setHoveredFilter] = useState(null)

  return (
    /* Centering wrapper */
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>

      <div style={{
        background: '#090924',
        borderRadius: '16px',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'flex-end',
        gap: '12px',
        width: '100%',
        maxWidth: '1000px',
        height: '110px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* Centered top line */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          height: '5px',
          background: '#F58802',
          borderRadius: '0 0 6px 6px',
        }} />

        {/* ── Filter columns ── */}
        {FILTERS.map(({ id, label, Icon, options }) => (
          <div key={id} style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1, minWidth: 0 }}>

            <label style={{
              textTransform: 'uppercase',
              fontSize: '10px',
              fontWeight: 800,
              color: '#fff',
              letterSpacing: '1px',
              fontFamily: "'DM Sans', sans-serif",
              paddingLeft: '2px',
            }}>
              {label}
            </label>

            <div
              style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
              onMouseEnter={() => setHoveredFilter(id)}
              onMouseLeave={() => setHoveredFilter(null)}
            >
              <span style={{ position: 'absolute', left: '11px', pointerEvents: 'none', display: 'flex', alignItems: 'center', color: hoveredFilter === id ? '#FF0000' : '#000000', zIndex: 1, transition: 'color 0.15s' }}>
                <Icon size={14} />
              </span>

              <select
                value={values[id]}
                onChange={(e) => setValues((prev) => ({ ...prev, [id]: e.target.value }))}
                style={{
                  background: '#ffffff',
                  border: '1.5px solid transparent',
                  borderRadius: '10px',
                  padding: '10px 34px 10px 33px',
                  color: '#0f172a',
                  fontSize: '13px',
                  fontWeight: 600,
                  width: '100%',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif",
                  outline: 'none',
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#f97316'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.15)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'transparent'
                  e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'
                }}
              >
                {options.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>

              <span style={{ position: 'absolute', right: '10px', pointerEvents: 'none', display: 'flex', alignItems: 'center', color: hoveredFilter === id ? '#FF0000' : '#000000', transition: 'color 0.15s' }}>
                <ChevronDown size={13} />
              </span>
            </div>
          </div>
        ))}

        {/* ── Divider ── */}
        <div style={{ width: '3px', height: '42px', background: '#ffffff', borderRadius: '2px', flexShrink: 0, marginBottom: '1px' }} />

        {/* ── Search button (aligned to bottom with dropdowns) ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flexShrink: 0 }}>
          <label style={{ fontSize: '10px', color: 'transparent', userSelect: 'none' }}>.</label>
          <button
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              background: '#FFFFFF', color: '#000000', border: 'none',
              borderRadius: '10px', padding: '10px 22px',
              fontWeight: 700, fontSize: '13px', cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap',
              transition: 'background 0.15s',
              boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#E88205'; e.currentTarget.style.color = '#ffffff' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.color = '#000000' }}
          >
            <Search size={14} /> Search
          </button>
        </div>

      </div>
    </div>
  )
}
