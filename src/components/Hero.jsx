import { useState } from 'react'
import { Search, MapPin } from 'lucide-react'
import { useWindowSize } from '../hooks/useWindowSize'

const CITIES = ['Mogadishu', 'Hargeisa', 'Kismayo', 'Garowe', 'Baidoa', 'Bosaso']

const STATS = [
  { value: '1,240+', label: 'Active listings' },
  { value: '430+',   label: 'Verified sellers' },
  { value: '18',     label: 'Cities covered'   },
  { value: '$0',     label: 'Free to list'      },
]

export default function Hero() {
  const [query, setQuery] = useState('')
  const screenWidth = useWindowSize()
  const isMobile    = screenWidth < 768

  return (
    <section style={{
      background: 'var(--bg-section)',
      width: '100%',
      padding: isMobile ? '32px 16px 28px' : '56px 32px 48px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '24px',
      fontFamily: "'DM Sans', sans-serif",
      borderBottom: '1px solid var(--border)',
    }}>

      {/* Headline */}
      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 'clamp(38px, 6vw, 64px)',
          fontWeight: 800,
          color: 'var(--text-primary)',
          lineHeight: 1.1,
          margin: '0 0 10px',
        }}>
          Find Your Next <span style={{ color: '#f97316' }}>Car</span> in Somalia
        </h1>
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '16px',
          fontWeight: 500,
          maxWidth: '500px',
          lineHeight: 1.6,
          margin: '0 auto',
        }}>
          Buy or rent verified cars across all of Somalia — EVC Plus payments accepted.
        </p>
      </div>

      {/* Search Bar */}
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: '12px',
        display: 'flex',
        overflow: 'hidden',
        maxWidth: '640px',
        width: '100%',
        border: '1px solid var(--border-input)',
        boxShadow: 'var(--shadow-card)',
      }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 16px', gap: '10px' }}>
          <Search size={17} color="var(--text-hint)" style={{ flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search by city, make, or model..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1, border: 'none', outline: 'none',
              fontSize: '14px', color: 'var(--text-primary)',
              fontFamily: "'DM Sans', sans-serif",
              background: 'transparent',
              padding: '16px 0', minWidth: 0,
            }}
          />
        </div>
        <button
          style={{
            background: '#f97316', color: 'white', border: 'none',
            padding: '0 28px', fontWeight: 700, fontSize: '15px',
            fontFamily: "'DM Sans', sans-serif", cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '7px',
            whiteSpace: 'nowrap', flexShrink: 0,
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#ea6c00')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#f97316')}
        >
          <Search size={15} /> Search
        </button>
      </div>

      {/* City Quick Links */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {CITIES.map((city) => (
          <button key={city}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: '9999px',
              padding: '6px 16px',
              color: 'var(--text-secondary)',
              fontSize: '13px', fontWeight: 500,
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = '#f97316' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border)' }}
          >
            <MapPin size={11} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
            {city}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 'clamp(20px, 5vw, 60px)', flexWrap: 'wrap', justifyContent: 'center' }}>
        {STATS.map(({ value, label }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <p style={{ color: '#f97316', fontWeight: 800, fontSize: 'clamp(20px, 3vw, 26px)', margin: 0, fontFamily: "'Barlow Condensed', sans-serif" }}>
              {value}
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500, margin: '2px 0 0', fontFamily: "'DM Sans', sans-serif" }}>
              {label}
            </p>
          </div>
        ))}
      </div>

    </section>
  )
}
