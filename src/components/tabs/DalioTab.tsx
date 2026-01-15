import { colors } from '../../theme'
import type { DalioIndicators } from '../../types'
import { MetricCard } from '../MetricCard'
import { SectionHeader } from '../SectionHeader'
import { StatusBar } from '../StatusBar'

interface DalioTabProps {
  dalio: DalioIndicators
}

export function DalioTab({ dalio }: DalioTabProps) {
  const realRate = dalio.monetaryPolicy.realRates
  const realRateColor = realRate > 0 ? colors.green : colors.red

  return (
    <div>
      <SectionHeader title="DEBT CYCLE" />
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        <MetricCard label="DEBT/GDP" value={dalio.debtCycle.debtToGdp} unit="%" color={colors.red} />
        <MetricCard label="DEBT SERVICE" value={dalio.debtCycle.debtServiceRatio} unit="%" />
        <MetricCard label="CREDIT GROWTH" value={dalio.debtCycle.creditGrowth} unit="%" />
      </div>
      <StatusBar label="CYCLE PHASE" status={dalio.debtCycle.phase} value="" color={colors.yellow} />

      <SectionHeader title="MONETARY POLICY" />
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        <MetricCard label="REAL RATE" value={realRate} unit="%" color={realRateColor} subtitle="Positive = tight" />
        <MetricCard label="YIELD CURVE" value={dalio.monetaryPolicy.yieldCurve} unit="%" subtitle="10Y-2Y spread" />
      </div>
      <StatusBar label="FED STANCE" status={dalio.monetaryPolicy.phase} value="" color={colors.blue} />

      <SectionHeader title="PRODUCTIVITY" />
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        <MetricCard label="LABOR PROD" value={dalio.productivity.laborProductivity} unit="%" color={colors.green} />
        <MetricCard label="CAP INVEST" value={dalio.productivity.capitalInvestment} unit="%" />
      </div>
      <StatusBar label="TREND" status={dalio.productivity.phase} value="" color={colors.green} />

      <SectionHeader title="SOCIAL INDICATORS" />
      <div style={{ display: 'flex', gap: '8px' }}>
        <MetricCard label="WEALTH GAP" value={dalio.wealth.wealthGap} color={colors.red} />
        <MetricCard label="POPULISM" value={dalio.wealth.populism} color={colors.orange} />
      </div>
    </div>
  )
}
