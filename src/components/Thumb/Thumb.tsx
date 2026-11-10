import { Building2, Waves, BedDouble, LayoutPanelTop } from 'lucide-react'
import clsx from 'clsx'
import styles from './Thumb.module.scss'

export type ThumbKind = 'plan' | 'building' | 'pool' | 'room'

type ThumbProps = {
  kind: ThumbKind
  size?: 'sm' | 'md' | 'hero'
  className?: string
}

const icons = {
  plan: LayoutPanelTop,
  building: Building2,
  pool: Waves,
  room: BedDouble,
} as const

/** Placeholder de imagen. Reemplazar por <img> cuando existan los assets reales. */
export function Thumb({ kind, size = 'md', className }: ThumbProps) {
  const Icon = icons[kind]
  return (
    <div className={clsx(styles.thumb, styles[size], styles[kind], className)}>
      <Icon />
    </div>
  )
}
