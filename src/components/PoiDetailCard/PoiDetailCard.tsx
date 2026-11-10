import { Box, Map, MapPin } from 'lucide-react'
import { Button } from '@/components/Button/Button'
import { PoiIcon } from '@/components/PoiIcon/PoiIcon'
import { categoryLabels, type Hotspot } from '@/data/hotspots'
import { useExplorer } from '@/state/ExplorerContext'
import styles from './PoiDetailCard.module.scss'

type PoiDetailCardProps = {
  hotspot: Hotspot
}

/** Descripción de un hotspot. Se usa dentro de un BottomSheet (mobile) o del panel lateral (desktop). */
export function PoiDetailCard({ hotspot }: PoiDetailCardProps) {
  const { viewMode, setViewMode } = useExplorer()
  const { label, address, description } = hotspot.info
  const showingMap = viewMode === 'map'

  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <PoiIcon category={hotspot.category} size="md" />
        <div className={styles.headText}>
          <strong>{label}</strong>
          <span>{categoryLabels[hotspot.category]}</span>
        </div>
      </div>

      <p className={styles.description}>
        {description || 'Todavía no hay una descripción cargada para este punto.'}
      </p>

      {address && (
        <ul className={styles.info}>
          <li>
            <MapPin />
            {address}
          </li>
        </ul>
      )}

      <Button
        variant="secondary"
        fullWidth
        className={styles.action}
        onClick={() => setViewMode(showingMap ? 'splat' : 'map')}
      >
        {showingMap ? <Box /> : <Map />}
        {showingMap ? 'Ver en 3D' : 'Ver en el mapa'}
      </Button>
    </div>
  )
}
