import {
  Building2,
  Compass,
  Coffee,
  Cross,
  Fuel,
  Landmark,
  ShoppingCart,
  UtensilsCrossed,
} from 'lucide-react'
import clsx from 'clsx'
import type { HotspotCategory } from '@/data/hotspots'
import styles from './PoiIcon.module.scss'

type PoiIconProps = {
  category: HotspotCategory
  size?: 'sm' | 'md' | 'lg'
}

const icons = {
  closeness: Compass,
  building: Building2,
  superMarket: ShoppingCart,
  cafes: Coffee,
  restaurants: UtensilsCrossed,
  pharmacy: Cross,
  serviceStation: Fuel,
  bank: Landmark,
} as const

export function PoiIcon({ category, size = 'md' }: PoiIconProps) {
  const Icon = icons[category]
  return (
    <span className={clsx(styles.poiIcon, styles[size], styles[category])}>
      <Icon />
    </span>
  )
}
