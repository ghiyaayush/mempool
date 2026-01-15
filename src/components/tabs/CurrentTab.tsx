import { colors } from '../../theme'
import type { CurrentData } from '../../types'
import { MetricCard } from '../MetricCard'
import { SectionHeader } from '../SectionHeader'
import { StatusBar } from '../StatusBar'

interface CurrentTabProps {
  current: CurrentData
  onEdit: (path: string, value: string) => void
}

export function CurrentTab({ current, onEdit }: CurrentTabProps) {
  const spread = current.treasury_10y - current.treasury_2y
  const spreadColor = spread < 0 ? colors.red : spread < 0.25 ? colors.yellow : colors.green
  const spreadStatus = spread < 0 ? 'INVERTED' : spread < 0.25 ? 'FLAT' : 'NORMAL'

  return (
    <div>
      <SectionHeader title="RATES & YIELDS" />
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        <MetricCard label="FED RATE" value={current.fed_rate} unit="%" editPath="current.fed_rate" onEdit={onEdit} />
        <MetricCard label="10Y YIELD" value={current.treasury_10y} unit="%" editPath="current.treasury_10y" onEdit={onEdit} />
        <MetricCard label="2Y YIELD" value={current.treasury_2y} unit="%" editPath="current.treasury_2y" onEdit={onEdit} />
      </div>
      <StatusBar
        label="10Y-2Y SPREAD"
        status={spreadStatus}
        value={`${spread >= 0 ? '+' : ''}${spread.toFixed(2)}%`}
        color={spreadColor}
      />

      <SectionHeader title="MARKET INDICATORS" />
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <MetricCard label="DXY" value={current.dxy} subtitle="Dollar Index" editPath="current.dxy" onEdit={onEdit} />
        <MetricCard label="VIX" value={current.vix} color={current.vix > 20 ? colors.red : colors.green} subtitle="Fear gauge" editPath="current.vix" onEdit={onEdit} />
      </div>

      <SectionHeader title="INFLATION" />
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <MetricCard label="CPI YoY" value={current.cpi} unit="%" color={current.cpi > 3 ? colors.red : colors.yellow} editPath="current.cpi" onEdit={onEdit} />
        <MetricCard label="CORE PCE" value={current.core_pce} unit="%" subtitle="Fed's target: 2%" editPath="current.core_pce" onEdit={onEdit} />
        <MetricCard label="PPI YoY" value={current.ppi} unit="%" editPath="current.ppi" onEdit={onEdit} />
      </div>

      <SectionHeader title="GROWTH & LABOR" />
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        <MetricCard label="GDP GROWTH" value={current.gdp_growth} unit="%" color={colors.green} editPath="current.gdp_growth" onEdit={onEdit} />
        <MetricCard label="UNEMPLOYMENT" value={current.unemployment} unit="%" color={current.unemployment > 5 ? colors.red : colors.yellow} editPath="current.unemployment" onEdit={onEdit} />
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <MetricCard label="ISM MFG" value={current.ism_pmi} color={current.ism_pmi < 50 ? colors.red : colors.green} subtitle={current.ism_pmi < 50 ? 'Contracting' : 'Expanding'} editPath="current.ism_pmi" onEdit={onEdit} />
        <MetricCard label="ISM SVCS" value={current.ism_services} color={colors.green} subtitle="Services" editPath="current.ism_services" onEdit={onEdit} />
      </div>
    </div>
  )
}
