import { colors } from '../../theme'
import type { LiquidityData } from '../../types'
import { MetricCard } from '../MetricCard'
import { SectionHeader } from '../SectionHeader'
import { StatusBar } from '../StatusBar'

interface LiquidityTabProps {
  liquidity: LiquidityData
}

export function LiquidityTab({ liquidity }: LiquidityTabProps) {
  // Determine colors based on values
  const netLiquidityColor = liquidity.netLiquidity4wChange > 0 ? colors.green : colors.red
  const change4wColor = liquidity.netLiquidity4wChange > 0 ? colors.green : liquidity.netLiquidity4wChange < -50 ? colors.red : colors.yellow
  const change12wColor = liquidity.netLiquidity12wChange > 0 ? colors.green : liquidity.netLiquidity12wChange < -100 ? colors.red : colors.yellow

  const regimeColor = liquidity.liquidityRegime === 'expanding' ? colors.green : liquidity.liquidityRegime === 'contracting' ? colors.red : colors.yellow
  const stressColor = liquidity.fundingStress === 'low' ? colors.green : liquidity.fundingStress === 'high' ? colors.red : colors.yellow

  const formatTrillion = (val: number) => `$${val.toFixed(2)}T`
  const formatBillion = (val: number) => `${val >= 0 ? '+' : ''}${val.toFixed(0)}B`

  return (
    <div>
      <SectionHeader title="NET LIQUIDITY (Fed – TGA – RRP)" />
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        <MetricCard
          label="NET LIQUIDITY"
          value={liquidity.netLiquidity}
          unit="T"
          color={netLiquidityColor}
          subtitle="Total fuel"
        />
        <MetricCard
          label="4W CHANGE"
          value={liquidity.netLiquidity4wChange}
          unit="B"
          color={change4wColor}
          subtitle="Impulse"
        />
        <MetricCard
          label="12W CHANGE"
          value={liquidity.netLiquidity12wChange}
          unit="B"
          color={change12wColor}
          subtitle="Trend"
        />
      </div>
      <StatusBar
        label="LIQUIDITY REGIME"
        status={liquidity.liquidityRegime.toUpperCase()}
        value={formatTrillion(liquidity.netLiquidity)}
        color={regimeColor}
      />

      <SectionHeader title="COMPONENTS" />
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <MetricCard
          label="FED B/S"
          value={liquidity.fedBalanceSheet}
          unit="T"
          subtitle="Fed assets"
        />
        <MetricCard
          label="TGA"
          value={liquidity.tga}
          unit="B"
          subtitle="Treasury cash"
        />
        <MetricCard
          label="RRP"
          value={liquidity.rrp}
          unit="B"
          subtitle="Reverse repo"
        />
      </div>

      <SectionHeader title="FUNDING MARKETS" />
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        <MetricCard
          label="SOFR"
          value={liquidity.sofr}
          unit="%"
          subtitle="Overnight rate"
        />
        <MetricCard
          label="MOVE"
          value={liquidity.move}
          color={liquidity.move > 120 ? colors.red : liquidity.move > 100 ? colors.yellow : colors.green}
          subtitle="Rates vol"
        />
      </div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        <MetricCard
          label="XCY BASIS"
          value={liquidity.crossCurrencyBasis}
          unit="bps"
          color={liquidity.crossCurrencyBasis < -30 ? colors.red : colors.text}
          subtitle="USD funding stress"
        />
        <MetricCard
          label="REPO STRESS"
          value={liquidity.repoStress}
          color={liquidity.repoStress > 50 ? colors.red : liquidity.repoStress > 25 ? colors.yellow : colors.green}
          subtitle="Proxy index"
        />
      </div>
      <StatusBar
        label="FUNDING STRESS"
        status={liquidity.fundingStress.toUpperCase()}
        value=""
        color={stressColor}
      />

      <SectionHeader title="RISK TRANSMISSION" />
      <div style={{ display: 'flex', gap: '8px' }}>
        <MetricCard
          label="HY SPREAD"
          value={liquidity.hySpread}
          unit="bps"
          color={liquidity.hySpread > 500 ? colors.red : liquidity.hySpread > 400 ? colors.yellow : colors.green}
          subtitle="Credit risk"
        />
        <MetricCard
          label="VIX"
          value={liquidity.vix}
          color={liquidity.vix > 25 ? colors.red : liquidity.vix > 20 ? colors.yellow : colors.green}
          subtitle="Equity vol"
        />
        <MetricCard
          label="DXY"
          value={liquidity.dxy}
          color={liquidity.dxy > 105 ? colors.red : colors.text}
          subtitle="USD strength"
        />
      </div>
    </div>
  )
}
