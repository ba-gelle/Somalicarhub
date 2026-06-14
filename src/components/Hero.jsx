import { useState } from 'react'
import { Search, ChevronDown } from 'lucide-react'

const CAR_BRANDS = [
  'All Types',
  'Toyota', 'Nissan', 'Honda', 'BMW', 'Mercedes-Benz',
  'Hyundai', 'Kia', 'Land Rover', 'Mitsubishi', 'Mazda',
  'Ford', 'Chevrolet', 'Audi', 'Volkswagen', 'Jeep',
  'Lexus', 'Subaru', 'Suzuki', 'Isuzu', 'Peugeot',
  'Renault', 'Volvo', 'Porsche', 'Range Rover', 'Infiniti',
  'Cadillac', 'Dodge', 'Tesla', 'Hummer', 'GMC',
]

const STATS = [
  '50K+ Cars Available',
  '2,400 Verified Dealers',
  '$28K Avg. Price',
  'Free to Browse',
]

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Hero() {
  const [brand, setBrand] = useState('All Types')
  const [query, setQuery] = useState('')

  return (
    <section
      style={{
        background: 'var(--bg-section)',
        width: '100%',
        padding: '80px 32px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
      }}
    >
      {/* Greeting */}
      <p
        style={{
          color: 'var(--text-secondary)',
          fontSize: '15px',
          fontWeight: 500,
          fontFamily: "'DM Sans', sans-serif",
          margin: 0,
        }}
      >
        {getGreeting()} 👋
      </p>

      {/* Main Headline */}
      <h1
        style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 'clamp(44px, 7vw, 72px)',
          fontWeight: 900,
          color: 'var(--text-primary)',
          lineHeight: 1.1,
          margin: 0,
        }}
      >
        Find Your{' '}
        <span style={{ color: '#f97316' }}>Dream Car</span>
        {' '}in Minutes.
      </h1>

      {/* Subtitle */}
      <p
        style={{
          color: 'var(--text-secondary)',
          fontSize: '18px',
          fontFamily: "'DM Sans', sans-serif",
          maxWidth: '480px',
          textAlign: 'center',
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        Somalia&apos;s #1 car marketplace. Browse thousands of verified listings from trusted dealers.
      </p>

      {/* Search Bar */}
      <div
        style={{
          background: 'var(--bg-card)',
          borderRadius: '12px',
          display: 'flex',
          overflow: 'hidden',
          maxWidth: '640px',
          width: '100%',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        }}
      >
        {/* Brand Dropdown */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            style={{
              appearance: 'none',
              WebkitAppearance: 'none',
              background: 'var(--bg-input)',
              border: 'none',
              borderRight: '1px solid var(--border-input)',
              padding: '0 36px 0 16px',
              fontSize: '14px',
              color: 'var(--text-primary)',
              fontWeight: 500,
              fontFamily: "'DM Sans', sans-serif",
              outline: 'none',
              cursor: 'pointer',
              height: '52px',
              minWidth: '148px',
            }}
          >
            {CAR_BRANDS.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
          <span style={{ position: 'absolute', right: '10px', pointerEvents: 'none', display: 'flex', color: '#9ca3af' }}>
            <ChevronDown size={14} />
          </span>
        </div>

        {/* Search Input */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 12px', gap: '8px' }}>
          <Search size={16} color="#9ca3af" style={{ flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search by make, model, or keyword..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '14px',
              color: 'var(--text-primary)',
              fontFamily: "'DM Sans', sans-serif",
              background: 'transparent',
              padding: '14px 0',
              minWidth: 0,
            }}
          />
        </div>

        {/* Search Button */}
        <button
          style={{
            background: '#3b5bdb',
            color: 'white',
            border: 'none',
            padding: '0 28px',
            fontWeight: 700,
            fontSize: '15px',
            fontFamily: "'DM Sans', sans-serif",
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#2f4ec7')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#3b5bdb')}
        >
          <Search size={16} />
          Search
        </button>
      </div>

      {/* Stats Badges */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {STATS.map((stat) => (
          <span
            key={stat}
            style={{
              border: '1px solid var(--border)',
              borderRadius: '9999px',
              padding: '8px 18px',
              color: 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              background: 'var(--bg-surface)',
            }}
          >
            {stat}
          </span>
        ))}
      </div>
    </section>
  )
}
