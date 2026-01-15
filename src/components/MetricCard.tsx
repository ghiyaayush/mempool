import { useState } from 'react'
import { colors } from '../theme'

interface MetricCardProps {
  label: string
  value: number | string
  unit?: string
  color?: string
  subtitle?: string
  editPath?: string
  onEdit?: (path: string, value: string) => void
}

export function MetricCard({
  label,
  value,
  unit = '',
  color = colors.text,
  subtitle,
  editPath,
  onEdit
}: MetricCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState('')

  const handleClick = () => {
    if (editPath && onEdit) {
      setIsEditing(true)
      setEditValue(value.toString())
    }
  }

  const handleSave = () => {
    if (editPath && onEdit) {
      onEdit(editPath, editValue)
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') setIsEditing(false)
  }

  return (
    <div
      style={{
        background: colors.card,
        border: `1px solid ${isEditing ? colors.blue : colors.border}`,
        borderRadius: '8px',
        padding: '14px',
        flex: 1,
        minWidth: '100px'
      }}
      className={editPath && onEdit && !isEditing ? 'editable' : ''}
      onClick={!isEditing ? handleClick : undefined}
    >
      <div style={{ fontSize: '10px', color: colors.dim, marginBottom: '4px', fontWeight: 600 }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
        {isEditing ? (
          <input
            className="edit-input"
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            autoFocus
          />
        ) : (
          <span style={{ fontSize: '20px', fontWeight: 700, color, fontFamily: 'monospace' }}>
            {typeof value === 'number' ? value.toFixed(2) : value}
          </span>
        )}
        {unit && !isEditing && (
          <span style={{ fontSize: '11px', color: colors.dim }}>{unit}</span>
        )}
      </div>
      {subtitle && (
        <div style={{ fontSize: '9px', color: colors.dim, marginTop: '2px' }}>{subtitle}</div>
      )}
    </div>
  )
}
