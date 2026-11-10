import clsx from 'clsx'
import { PoiIcon } from '@/components/PoiIcon/PoiIcon'
import type { HotspotCategory } from '@/data/hotspots'
import styles from './Callout.module.scss'

type CalloutProps = {
  label: string
  category: HotspotCategory
  selected?: boolean
  onClick?: () => void
}

/**
 * Hotspot estilo callout: etiqueta + línea + punto de anclaje.
 * El punto (parte inferior central) es el que queda sobre la coordenada.
 * Se usa tanto sobre el splat (posición proyectada) como en el mapa (Marker de MapLibre).
 */
export function Callout({ label, category, selected, onClick }: CalloutProps) {
  return (
    <button
      className={clsx(styles.callout, selected && styles.selected)}
      aria-label={label}
      onClick={onClick}
    >
      <span className={styles.label}>
        <PoiIcon category={category} size="sm" />
        <span className={styles.text}>{label}</span>
      </span>
      <span className={styles.stem} />
      <span className={styles.dot} />
    </button>
  )
}
