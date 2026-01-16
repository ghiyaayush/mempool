import { useState, useEffect } from 'react'
import { colors } from './theme'
import { fetchData, refreshData, updateValue } from './api'
import type { DashboardData, TabId } from './types'
import { CalendarTab, PredictionsTab, CurrentTab, PolicyTab, DalioTab, LiquidityTab } from './components/tabs'

const tabs: { id: TabId; label: string }[] = [
  { id: 'calendar', label: 'Calendar' },
  { id: 'predictions', label: 'Predictions' },
  { id: 'current', label: 'Current' },
  { id: 'policy', label: 'Policy' },
  { id: 'dalio', label: 'Dalio' },
  { id: 'liquidity', label: 'Liquidity' }
]

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('current')
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string>('Never')

  const loadData = async () => {
    try {
      const result = await fetchData()
      setData(result)
      setLastUpdated(result.lastUpdated ? new Date(result.lastUpdated).toLocaleString() : 'Never')
    } catch (err) {
      console.error('Failed to fetch data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await refreshData()
      await loadData()
    } catch (err) {
      console.error('Failed to refresh:', err)
    } finally {
      setRefreshing(false)
    }
  }

  const handleEdit = async (path: string, value: string) => {
    try {
      const numValue = parseFloat(value)
      await updateValue(path, isNaN(numValue) ? value : numValue)
      await loadData()
    } catch (err) {
      console.error('Failed to save:', err)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (loading) {
    return (
      <div style={{ color: colors.text, textAlign: 'center', padding: '40px' }}>
        Loading dashboard...
      </div>
    )
  }

  if (!data) {
    return (
      <div style={{ color: colors.red, textAlign: 'center', padding: '40px' }}>
        Failed to load data. Make sure the server is running.
      </div>
    )
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'calendar':
        return <CalendarTab calendar={data.calendar} />
      case 'predictions':
        return <PredictionsTab predictions={data.predictions} onEdit={handleEdit} />
      case 'current':
        return <CurrentTab current={data.current} onEdit={handleEdit} />
      case 'policy':
        return <PolicyTab current={data.current} onEdit={handleEdit} />
      case 'dalio':
        return <DalioTab dalio={data.dalio} />
      case 'liquidity':
        return <LiquidityTab liquidity={data.liquidity} />
      default:
        return <CurrentTab current={data.current} onEdit={handleEdit} />
    }
  }

  return (
    <div
      style={{
        background: colors.bg,
        color: colors.text,
        width: '100%',
        maxWidth: '440px',
        margin: '0 auto',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 16px 0',
          background: `linear-gradient(180deg, ${colors.card} 0%, ${colors.bg} 100%)`
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: colors.green,
                boxShadow: `0 0 8px ${colors.green}`
              }}
            />
            <span style={{ fontSize: '16px', fontWeight: 700, color: colors.blue }}>MACRO PULSE</span>
          </div>
          <button className="refresh-btn" onClick={handleRefresh} disabled={refreshing}>
            <span className={refreshing ? 'spinning' : ''}>&#8635;</span> {refreshing ? 'Updating...' : 'Refresh'}
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '12px' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? colors.blue + '20' : 'transparent',
                border: `1px solid ${activeTab === tab.id ? colors.blue : colors.border}`,
                borderRadius: '6px',
                padding: '8px 12px',
                color: activeTab === tab.id ? colors.blue : colors.dim,
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '16px', maxHeight: '600px', overflowY: 'auto' }}>
        {renderTab()}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '12px 16px',
          borderTop: `1px solid ${colors.border}`,
          fontSize: '9px',
          color: colors.dim,
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <span>Sources: BLS, Fed, ISM, Polymarket</span>
        <span>Updated: {lastUpdated}</span>
      </div>
    </div>
  )
}
