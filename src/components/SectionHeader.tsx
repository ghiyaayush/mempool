import { colors } from '../theme'

interface SectionHeaderProps {
  title: string
}

export function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <div
      style={{
        fontSize: '11px',
        color: colors.dim,
        marginBottom: '10px',
        fontWeight: 700,
        letterSpacing: '1px'
      }}
    >
      {title}
    </div>
  )
}
