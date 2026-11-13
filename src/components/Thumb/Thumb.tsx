import { Building2, Waves, BedDouble, LayoutPanelTop, Dumbbell, Utensils, MonitorActivity, UserGroup } from 'lucide-react'
import clsx from 'clsx'
import styles from './Thumb.module.scss'

export type ThumbKind = 'plan' | 'building' | 'pool' | 'room'

type ThumbProps = {
  kind: ThumbKind
  image: string
  size?: 'sm' | 'md' | 'hero'
  className?: string
}

const icons = {
  plan: LayoutPanelTop,
  building: Building2,
  pool: Waves,
  room: BedDouble,
  sum: UserGroup,
  gym: Dumbbell,
  cowork: MonitorActivity,
  quincho: Utensils
  
} as const

export function Thumb({ kind, size = 'md', image, className }: ThumbProps) {
  const Icon = icons[kind]

  return (
    <div className={clsx(styles.thumb, styles[size], styles[kind], className)}>
      {image ? (
        <img src={image} alt={kind} />
      ) : (
        <Icon />
      )}
    </div>
  )
}
