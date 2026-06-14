import { Gauge, Zap, Fuel } from 'lucide-react'

function buildSpecs(car) {
  return [
    { icon: <Gauge size={14} />, text: car?.km ?? '18,000 km' },
    { icon: <Zap size={14} />, text: car?.trans ?? 'Automatic' },
    { icon: <Fuel size={14} />, text: car?.fuel ?? 'Diesel' },
    { icon: <Zap size={14} />, text: car?.cc && car.cc !== '—' ? car.cc : '2800 CC' },
  ]
}

export default function CarSpecsBox({ car, specs }) {
  const items = specs ?? buildSpecs(car)

  return (
    <div
      style={{
        background: 'var(--spec-bg)',
        border: '1px solid var(--spec-border)',
        borderRadius: '10px',
        padding: '12px 16px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
      }}
    >
      {items.map((spec, i) => (
        <div
          key={i}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <span style={{ color: 'var(--spec-icon)', display: 'flex', flexShrink: 0 }}>
            {spec.icon}
          </span>
          <span
            style={{
              color: 'var(--spec-text)',
              fontSize: '13px',
              fontWeight: 500,
              fontFamily: "'DM Sans', sans-serif",
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {spec.text}
          </span>
        </div>
      ))}
    </div>
  )
}
