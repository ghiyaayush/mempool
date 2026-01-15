import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 3000
const DATA_FILE = path.join(__dirname, 'data.json')

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

// API: Get all data
app.get('/api/data', (req, res) => {
  const data = loadData()
  if (data) {
    const transformed = {
      current: {},
      predictions: {},
      calendar: data.calendar,
      dalio: data.dalio,
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
    const yields = await fetchTreasuryYields()
    for (const [key, value] of Object.entries(yields)) {
      if (data.current[key] && data.current[key].source === 'api') {
        data.current[key].value = value
        data.current[key].updated = new Date().toISOString()
      }
    }

    const market = await fetchMarketData()
    for (const [key, value] of Object.entries(market)) {
      if (data.current[key] && data.current[key].source === 'api') {
        data.current[key].value = value
        data.current[key].updated = new Date().toISOString()
      }
    }

    saveData(data)
    res.json({ success: true, message: 'Data refreshed', updated: Object.keys({...yields, ...market}) })
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
