import { lazy, Suspense, useRef } from 'react'
import clsx from 'clsx'
import { SegmentedControl } from '@/components/SegmentedControl/SegmentedControl'
import type { Hotspot } from '@/data/hotspots'
import { useExplorer, type ViewMode } from '@/state/ExplorerContext'
import styles from './ExplorerView.module.scss'

// Se cargan bajo demanda: three + spark y maplibre son pesados.
const SparkViewer = lazy(() => import('@/components/SparkViewer/SparkViewer'))
const GeoMap = lazy(() => import('@/components/GeoMap/GeoMap'))

// BASE_URL termina en "/" → queda '/splats/…' en dev y '/closer-demo/splats/…' en producción.
export const SPLAT_URL = `${import.meta.env.BASE_URL}splats/itaim-ii.sog`

const modeOptions = [
  { value: 'splat', label: '3D' },
  { value: 'map', label: 'Mapa' },
] as const

type ExplorerViewProps = {
  /** false = pausa ambos visores (por ejemplo cuando otra pantalla los tapa). */
  active?: boolean
  switchPosition?: 'top' | 'bottom'
  onHotspotClick: (hotspot: Hotspot) => void
}

/** Splat 3D y mapa en la misma coordenada, con un switch para alternar entre ambos. */
export function ExplorerView({
  active = true,
  switchPosition = 'top',
  onHotspotClick,
}: ExplorerViewProps) {
  const { visibleHotspots, selected, viewMode, setViewMode } = useExplorer()

  // El mapa se monta la primera vez que se pide y después queda montado (cambio instantáneo).
  const mapRequested = useRef(false)
  if (viewMode === 'map') mapRequested.current = true

  const fallback = <div className={styles.loading}>Cargando…</div>

  return (
    <div className={styles.view}>
      <div className={clsx(styles.layer, viewMode !== 'splat' && styles.hidden)}>
        <Suspense fallback={fallback}>
          <SparkViewer
            url={SPLAT_URL}
            hotspots={visibleHotspots}
            selectedId={selected.id}
            active={active && viewMode === 'splat'}
            onHotspotClick={onHotspotClick}
          />
        </Suspense>
      </div>

      {mapRequested.current && (
        <div className={clsx(styles.layer, viewMode !== 'map' && styles.hidden)}>
          <Suspense fallback={fallback}>
            <GeoMap
              hotspots={visibleHotspots}
              selectedId={selected.id}
              active={active && viewMode === 'map'}
              onHotspotClick={onHotspotClick}
            />
          </Suspense>
        </div>
      )}

      <div className={clsx(styles.switch, styles[switchPosition])}>
        <SegmentedControl<ViewMode>
          size="sm"
          options={[...modeOptions]}
          value={viewMode}
          onChange={setViewMode}
        />
      </div>
    </div>
  )
}
