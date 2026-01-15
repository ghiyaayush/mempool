import { colors } from '../../theme'
import type { CurrentData } from '../../types'
import { MetricCard } from '../MetricCard'
import { SectionHeader } from '../SectionHeader'

interface PolicyTabProps {
  current: CurrentData
  onEdit: (path: string, value: string) => void
}

export function PolicyTab({ current, onEdit }: PolicyTabProps) {
  const realRate = current.fed_rate - current.cpi
  const realRateColor = realRate > 0 ? colors.green : colors.red

  return (
    <div>
      <SectionHeader title="FEDERAL RESERVE" />
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        <MetricCard label="FED FUNDS" value={current.fed_rate} unit="%" editPath="current.fed_rate" onEdit={onEdit} />
        <MetricCard label="REAL RATE" value={parseFloat(realRate.toFixed(2))} unit="%" color={realRateColor} subtitle="Fed - CPI" />
      </div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <MetricCard label="10Y YIELD" value={current.treasury_10y} unit="%" editPath="current.treasury_10y" onEdit={onEdit} />
        <MetricCard label="30Y YIELD" value={current.treasury_30y} unit="%" editPath="current.treasury_30y" onEdit={onEdit} />
      </div>

      <SectionHeader title="FISCAL POLICY" />
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <MetricCard label="DEBT/GDP" value={current.debt_to_gdp} unit="%" color={colors.red} subtitle="High" editPath="current.debt_to_gdp" onEdit={onEdit} />
        <MetricCard label="DEFICIT/GDP" value={current.deficit_gdp} unit="%" color={colors.red} subtitle="FY2025" editPath="current.deficit_gdp" onEdit={onEdit} />
      </div>

      <SectionHeader title="MONEY SUPPLY" />
      <div style={{ display: 'flex', gap: '8px' }}>
        <MetricCard label="M2 GROWTH" value={current.m2_growth} unit="%" subtitle="YoY" editPath="current.m2_growth" onEdit={onEdit} />
        <MetricCard label="CONSUMER CONF" value={current.consumer_confidence} subtitle="Dec 2025" editPath="current.consumer_confidence" onEdit={onEdit} />
      </div>
    </div>
  )
}
