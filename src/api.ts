import type { DashboardData } from './types'

const API_BASE = '/api'

export async function fetchData(): Promise<DashboardData> {
  const response = await fetch(`${API_BASE}/data`)
  if (!response.ok) throw new Error('Failed to fetch data')
  return response.json()
}

export async function refreshData(): Promise<void> {
  const response = await fetch(`${API_BASE}/refresh`, { method: 'POST' })
  if (!response.ok) throw new Error('Failed to refresh data')
}

export async function updateValue(path: string, value: number | string): Promise<void> {
  const response = await fetch(`${API_BASE}/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path, value })
  })
  if (!response.ok) throw new Error('Failed to update value')
}
