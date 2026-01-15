import { colors } from '../theme'
import type { CalendarEvent } from '../types'

const impactColors = {
  critical: colors.red,
  high: colors.orange,
  med: colors.yellow,
  low: colors.dim
}

export function CalendarRow({ date, event, time, impact, prev }: CalendarEvent) {
  const impactColor = impactColors[impact]

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px 12px',
        background: colors.card,
        borderRadius: '6px',
        marginBottom: '6px',
        border: `1px solid ${impact === 'critical' ? colors.red + '40' : colors.border}`
      }}
    >
      <div style={{ width: '60px', fontSize: '11px', color: colors.blue, fontWeight: 600 }}>
        {date}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '12px', color: colors.text, fontWeight: 500 }}>{event}</div>
        <div style={{ fontSize: '10px', color: colors.dim }}>{time} IST</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div
          style={{
            fontSize: '9px',
            color: impactColor,
            fontWeight: 600,
            textTransform: 'uppercase',
            background: impactColor + '20',
            padding: '2px 6px',
            borderRadius: '3px'
          }}
        >
          {impact}
        </div>
        <div style={{ fontSize: '10px', color: colors.dim, marginTop: '2px' }}>Prev: {prev}</div>
      </div>
    </div>
  )
}
