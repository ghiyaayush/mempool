import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 3000
const DATA_FILE = path.join(__dirname, 'data.json')
const FRED_API_KEY = process.env.FRED_API_KEY

app.use(cors())
app.use(express.json())

// Load data from file
function loadData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))
  } catch (err) {
    console.error('Error loading data:', err)
    return null
  }
}

// Save data to file
function saveData(data) {
  data.lastUpdated = new Date().toISOString()
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
}

// Fetch Treasury yields from Yahoo Finance
async function fetchTreasuryYields() {
  try {
    const symbols = {
      treasury_10y: '^TNX',
      treasury_2y: '^IRX',
      treasury_30y: '^TYX'
    }

    const results = {}
    for (const [key, symbol] of Object.entries(symbols)) {
      try {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`
        const response = await fetch(url)
        const data = await response.json()
        if (data.chart?.result?.[0]?.meta?.regularMarketPrice) {
          results[key] = data.chart.result[0].meta.regularMarketPrice
        }
      } catch (e) {
        console.log(`Failed to fetch ${key}:`, e.message)
      }
    }
    return results
  } catch (err) {
    console.error('Error fetching treasury yields:', err)
    return {}
  }
}

// Fetch VIX and DXY from Yahoo Finance
async function fetchMarketData() {
  try {
    const symbols = {
      vix: '^VIX',
      dxy: 'DX-Y.NYB'
    }

    const results = {}
    for (const [key, symbol] of Object.entries(symbols)) {
      try {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`
        const response = await fetch(url)
        const data = await response.json()
        if (data.chart?.result?.[0]?.meta?.regularMarketPrice) {
          results[key] = data.chart.result[0].meta.regularMarketPrice
        }
      } catch (e) {
        console.log(`Failed to fetch ${key}:`, e.message)
      }
    }
    return results
  } catch (err) {
    console.error('Error fetching market data:', err)
    return {}
  }
}

// Fetch a single FRED series
async function fetchFredSeries(seriesId, limit = 13) {
  if (!FRED_API_KEY) {
    console.log('FRED_API_KEY not set, skipping FRED data')
    return null
  }

  try {
    const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json&sort_order=desc&limit=${limit}`
    const response = await fetch(url)
    const data = await response.json()

    if (data.observations && data.observations.length > 0) {
      return data.observations.map(obs => ({
        date: obs.date,
        value: parseFloat(obs.value)
      })).filter(obs => !isNaN(obs.value))
    }
    return null
  } catch (err) {
    console.error(`Error fetching FRED series ${seriesId}:`, err.message)
    return null
  }
}

// Fetch liquidity data from FRED
async function fetchLiquidityData() {
  if (!FRED_API_KEY) {
    console.log('FRED_API_KEY not set, skipping liquidity data')
    return null
  }

  try {
    // Fetch all three series (13 weeks of data for 12W change calculation)
    const [walcl, tga, rrp] = await Promise.all([
      fetchFredSeries('WALCL', 13),      // Fed Balance Sheet (weekly, millions)
      fetchFredSeries('WTREGEN', 13),    // Treasury General Account (weekly, millions)
      fetchFredSeries('RRPONTSYD', 90)   // Reverse Repo (daily, billions) - need more for weekly avg
    ])

    if (!walcl || !tga || !rrp) {
      console.log('Missing FRED data:', { walcl: !!walcl, tga: !!tga, rrp: !!rrp })
      return null
    }

    // Get latest values
    const fedBalanceSheet = walcl[0].value / 1000000  // Convert millions to trillions
    const tgaValue = tga[0].value / 1000              // Convert millions to billions
    const rrpValue = rrp[0].value                     // Already in billions

    // Calculate net liquidity: Fed - TGA - RRP (in trillions)
    const netLiquidity = fedBalanceSheet - (tgaValue / 1000) - (rrpValue / 1000)

    // Calculate 4-week change (index 0 vs index 4)
    let netLiquidity4wChange = 0
    if (walcl.length >= 5 && tga.length >= 5 && rrp.length >= 28) {
      const fed4w = walcl[4].value / 1000000
      const tga4w = tga[4].value / 1000
      const rrp4w = rrp[27]?.value || rrp[rrp.length - 1].value  // ~4 weeks ago in daily data
      const netLiq4w = fed4w - (tga4w / 1000) - (rrp4w / 1000)
      netLiquidity4wChange = (netLiquidity - netLiq4w) * 1000  // Convert to billions
    }

    // Calculate 12-week change (index 0 vs index 12)
    let netLiquidity12wChange = 0
    if (walcl.length >= 13 && tga.length >= 13 && rrp.length >= 84) {
      const fed12w = walcl[12].value / 1000000
      const tga12w = tga[12].value / 1000
      const rrp12w = rrp[83]?.value || rrp[rrp.length - 1].value  // ~12 weeks ago
      const netLiq12w = fed12w - (tga12w / 1000) - (rrp12w / 1000)
      netLiquidity12wChange = (netLiquidity - netLiq12w) * 1000  // Convert to billions
    }

    return {
      fedBalanceSheet: Math.round(fedBalanceSheet * 100) / 100,
      tga: Math.round(tgaValue),
      rrp: Math.round(rrpValue),
      netLiquidity: Math.round(netLiquidity * 100) / 100,
      netLiquidity4wChange: Math.round(netLiquidity4wChange),
      netLiquidity12wChange: Math.round(netLiquidity12wChange)
    }
  } catch (err) {
    console.error('Error fetching liquidity data:', err)
    return null
  }
}

// API: Get all data
app.get('/api/data', (req, res) => {
  const data = loadData()
  if (data) {
    const transformed = {
      current: {},
      predictions: {},
      calendar: data.calendar,
      dalio: data.dalio,
      liquidity: data.liquidity,
      lastUpdated: data.lastUpdated
    }

    for (const [key, val] of Object.entries(data.current)) {
      const override = data.manualOverrides?.[`current.${key}`]
      transformed.current[key] = override !== undefined ? override : val.value
    }

    for (const [key, val] of Object.entries(data.predictions)) {
      const override = data.manualOverrides?.[`predictions.${key}`]
      transformed.predictions[key] = override !== undefined ? override : val.value
    }

    res.json(transformed)
  } else {
    res.status(500).json({ error: 'Failed to load data' })
  }
})

// API: Update a specific value (manual override)
app.post('/api/update', (req, res) => {
  const { path, value } = req.body
  if (!path || value === undefined) {
    return res.status(400).json({ error: 'Missing path or value' })
  }

  const data = loadData()
  if (!data) {
    return res.status(500).json({ error: 'Failed to load data' })
  }

  data.manualOverrides[path] = value
  saveData(data)

  res.json({ success: true, path, value })
})

// API: Refresh live data from APIs
app.post('/api/refresh', async (req, res) => {
  console.log('Refreshing live data...')
  const data = loadData()

  try {
    const [yields, market, liquidity] = await Promise.all([
      fetchTreasuryYields(),
      fetchMarketData(),
      fetchLiquidityData()
    ])

    for (const [key, value] of Object.entries(yields)) {
      if (data.current[key] && data.current[key].source === 'api') {
        data.current[key].value = value
        data.current[key].updated = new Date().toISOString()
      }
    }

    for (const [key, value] of Object.entries(market)) {
      if (data.current[key] && data.current[key].source === 'api') {
        data.current[key].value = value
        data.current[key].updated = new Date().toISOString()
      }
    }

    // Update liquidity data if fetched successfully
    if (liquidity) {
      data.liquidity = {
        ...data.liquidity,
        ...liquidity,
        lastUpdated: new Date().toISOString()
      }
      // Also update VIX and DXY in liquidity from market data
      if (market.vix) data.liquidity.vix = market.vix
      if (market.dxy) data.liquidity.dxy = market.dxy
    }

    saveData(data)

    const updated = [
      ...Object.keys(yields),
      ...Object.keys(market),
      ...(liquidity ? ['liquidity'] : [])
    ]
    res.json({ success: true, message: 'Data refreshed', updated })
  } catch (err) {
    console.error('Refresh error:', err)
    res.status(500).json({ error: 'Failed to refresh data' })
  }
})

// API: Get raw data file (for debugging)
app.get('/api/raw', (req, res) => {
  const data = loadData()
  res.json(data)
})

app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════════════╗
  ║         MACRO PULSE DASHBOARD SERVER              ║
  ╠═══════════════════════════════════════════════════╣
  ║  API Server:  http://localhost:${PORT}              ║
  ║  API Data:    http://localhost:${PORT}/api/data     ║
  ╚═══════════════════════════════════════════════════╝
  `)
})
