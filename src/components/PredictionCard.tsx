import { useState } from 'react'
import { colors } from '../theme'

interface PredictionCardProps {
  label: string
  prob: number
  volume?: string
  editPath?: string
  onEdit?: (path: string, value: string) => void
}

export function PredictionCard({
  label,
  prob,
  volume,
  editPath,
  onEdit
}: PredictionCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState('')

  const getColor = (p: number) => {
    if (p >= 70) return colors.green
    if (p >= 40) return colors.yellow
    return colors.dim
  }

  const handleClick = () => {
    if (editPath && onEdit) {
      setIsEditing(true)
      setEditValue(prob.toString())
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

  const color = getColor(prob)

  return (
    <div
      style={{
        background: colors.card,
        border: `1px solid ${isEditing ? colors.blue : colors.border}`,
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '8px'
      }}
      className={editPath && onEdit && !isEditing ? 'editable' : ''}
      onClick={!isEditing ? handleClick : undefined}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '12px', color: colors.text, fontWeight: 500, flex: 1 }}>{label}</span>
        {isEditing ? (
          <input
            className="edit-input"
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            autoFocus
            style={{ width: '60px' }}
          />
        ) : (
          <span style={{ fontSize: '16px', fontWeight: 700, color, fontFamily: 'monospace' }}>
            {prob}%
          </span>
        )}
      </div>
      <div style={{ height: '6px', background: colors.border, borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ width: `${prob}%`, height: '100%', background: color, borderRadius: '3px' }} />
      </div>
      {volume && (
        <div style={{ fontSize: '9px', color: colors.dim, marginTop: '6px' }}>{volume} volume</div>
      )}
    </div>
  )
}
