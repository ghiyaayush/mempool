export const colors = {
  bg: '#0D1117',
  card: '#161B22',
  border: '#30363D',
  text: '#E6EDF3',
  dim: '#8B949E',
  green: '#3FB950',
  red: '#F85149',
  yellow: '#D29922',
  blue: '#58A6FF',
  purple: '#A371F7',
  orange: '#F0883E'
} as const

export type ColorKey = keyof typeof colors
