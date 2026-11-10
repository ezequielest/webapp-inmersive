import { ListItem } from '@/components/ListItem/ListItem'
import { PoiIcon } from '@/components/PoiIcon/PoiIcon'
import { categoryLabels, type Hotspot } from '@/data/hotspots'
import styles from './PoiPanel.module.scss'

type PoiPanelProps = {
  pois: Hotspot[]
  onSelect: (poi: Hotspot) => void
}

export function PoiPanel({ pois, onSelect }: PoiPanelProps) {
  if (pois.length === 0) {
    return <p className={styles.empty}>No hay puntos de interés para este filtro.</p>
  }

  return (
    <ul className={styles.list}>
      {pois.map((poi) => (
        <li key={poi.id}>
          <ListItem
            leading={<PoiIcon category={poi.category} />}
            title={poi.info.label}
            subtitle={poi.info.address || categoryLabels[poi.category]}
            onClick={() => onSelect(poi)}
          />
        </li>
      ))}
    </ul>
  )
}
