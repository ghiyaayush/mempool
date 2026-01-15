import { colors } from '../theme'

interface StatusBarProps {
  label: string
  status: string
  value: string
  color: string
}

export function StatusBar({ label, status, value, color }: StatusBarProps) {
  return (
    <div
      style={{
        background: colors.card,
        border: `1px solid ${color}40`,
        borderRadius: '8px',
        padding: '10px 14px',
        marginBottom: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <span style={{ fontSize: '10px', color: colors.dim }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span
          style={{
            fontSize: '10px',
            color,
            fontWeight: 600,
            background: color + '20',
            padding: '2px 6px',
            borderRadius: '4px'
          }}
        >
          {status}
        </span>
        <span style={{ fontSize: '14px', color, fontWeight: 700, fontFamily: 'monospace' }}>
          {value}
        </span>
      </div>
    </div>
  )
}
