import { colors } from '../../theme'
import type { CalendarEvent } from '../../types'
import { CalendarRow } from '../CalendarRow'
import { SectionHeader } from '../SectionHeader'

interface CalendarTabProps {
  calendar: CalendarEvent[]
}

export function CalendarTab({ calendar }: CalendarTabProps) {
  return (
    <div>
      <div style={{ fontSize: '13px', color: colors.text, marginBottom: '12px' }}>
        <span style={{ color: colors.blue }}>Upcoming releases</span> — market-moving data
      </div>
      <div style={{ marginBottom: '16px' }}>
        <SectionHeader title="THIS WEEK" />
        {calendar.slice(0, 4).map((item, i) => (
          <CalendarRow key={i} {...item} />
        ))}
      </div>
      <div style={{ marginBottom: '16px' }}>
        <SectionHeader title="NEXT WEEK — FOMC WEEK" />
        {calendar.slice(4, 10).map((item, i) => (
          <CalendarRow key={i} {...item} />
        ))}
      </div>
      <div>
        <SectionHeader title="UPCOMING HIGH IMPACT" />
        {calendar.slice(10).map((item, i) => (
          <CalendarRow key={i} {...item} />
        ))}
      </div>
    </div>
  )
}
