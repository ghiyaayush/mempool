import { colors } from '../../theme'
import type { Predictions } from '../../types'
import { PredictionCard } from '../PredictionCard'
import { SectionHeader } from '../SectionHeader'

interface PredictionsTabProps {
  predictions: Predictions
  onEdit: (path: string, value: string) => void
}

export function PredictionsTab({ predictions, onEdit }: PredictionsTabProps) {
  return (
    <div>
      <div
        style={{
          fontSize: '11px',
          color: colors.dim,
          marginBottom: '16px',
          background: colors.card,
          padding: '10px 12px',
          borderRadius: '6px',
          border: `1px solid ${colors.border}`
        }}
      >
        <span style={{ color: colors.purple }}>Polymarket</span> — Real-money prediction markets (click to edit)
      </div>
      <SectionHeader title="FED & RATES" />
      <PredictionCard label="Fed rate HIKE in 2026" prob={predictions.fed_hike_2026} volume="$180k" editPath="predictions.fed_hike_2026" onEdit={onEdit} />
      <PredictionCard label="Fed cuts 50+ bps total in 2026" prob={predictions.fed_cut_50bp} volume="$420k" editPath="predictions.fed_cut_50bp" onEdit={onEdit} />
      <PredictionCard label="Powell fired/removed in 2026" prob={predictions.powell_fired} volume="$95k" editPath="predictions.powell_fired" onEdit={onEdit} />
      <SectionHeader title="ECONOMY" />
      <PredictionCard label="US recession by end of 2026" prob={predictions.recession_2026} volume="$85k" editPath="predictions.recession_2026" onEdit={onEdit} />
      <PredictionCard label="Inflation stays above 3% YoY" prob={predictions.inflation_above_3} volume="$62k" editPath="predictions.inflation_above_3" onEdit={onEdit} />
      <PredictionCard label="US bank failure by Mar 31" prob={predictions.bank_failure_q1} volume="$45k" editPath="predictions.bank_failure_q1" onEdit={onEdit} />
      <SectionHeader title="GEOPOLITICS & MARKETS" />
      <PredictionCard label="Supreme Court upholds tariffs" prob={predictions.tariffs_upheld} volume="$310k" editPath="predictions.tariffs_upheld" onEdit={onEdit} />
      <PredictionCard label="Gold hits $5K before ETH" prob={predictions.gold_5k_first} volume="$940k" editPath="predictions.gold_5k_first" onEdit={onEdit} />
      <div style={{ fontSize: '9px', color: colors.dim, marginTop: '12px', textAlign: 'center' }}>
        Data from polymarket.com/economy - Not financial advice
      </div>
    </div>
  )
}
