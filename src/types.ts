export interface CurrentData {
  fed_rate: number
  treasury_10y: number
  treasury_2y: number
  treasury_30y: number
  dxy: number
  vix: number
  cpi: number
  core_cpi: number
  core_pce: number
  ppi: number
  unemployment: number
  ism_pmi: number
  ism_services: number
  gdp_growth: number
  retail_sales: number
  housing_starts: number
  debt_to_gdp: number
  deficit_gdp: number
  m2_growth: number
  consumer_confidence: number
}

export interface Predictions {
  recession_2026: number
  fed_hike_2026: number
  fed_cut_50bp: number
  tariffs_upheld: number
  bank_failure_q1: number
  gold_5k_first: number
  powell_fired: number
  inflation_above_3: number
}

export interface CalendarEvent {
  date: string
  event: string
  time: string
  impact: 'critical' | 'high' | 'med' | 'low'
  prev: string
}

export interface DalioIndicators {
  debtCycle: {
    debtToGdp: number
    debtServiceRatio: number
    creditGrowth: number
    phase: string
  }
  monetaryPolicy: {
    realRates: number
    yieldCurve: number
    qeQt: string
    phase: string
  }
  productivity: {
    laborProductivity: number
    capitalInvestment: number
    innovation: string
    phase: string
  }
  wealth: {
    wealthGap: string
    populism: string
    socialConflict: string
    phase: string
  }
}

export interface DashboardData {
  current: CurrentData
  predictions: Predictions
  calendar: CalendarEvent[]
  dalio: DalioIndicators
  lastUpdated: string | null
}

export type TabId = 'calendar' | 'predictions' | 'current' | 'policy' | 'dalio'
