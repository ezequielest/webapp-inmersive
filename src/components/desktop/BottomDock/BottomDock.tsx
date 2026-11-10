import { ArrowRight} from 'lucide-react'
import clsx from 'clsx'
import { PoiIcon } from '@/components/PoiIcon/PoiIcon'
import { Thumb } from '@/components/Thumb/Thumb'
import { categoryLabels, type Hotspot } from '@/data/hotspots'
import { building } from '@/data/mock'
import type { Section } from '@/components/desktop/types'
import styles from './BottomDock.module.scss'

type BottomDockProps = {
  section: Section
  onSectionChange: (section: Section) => void
  pois: Hotspot[]
  selectedId: string
  onPoiSelect: (poi: Hotspot) => void
  className?: string
}

/*const modes = [
  { section: 'general', label: 'Entorno', icon: Compass },
  { section: 'pisos', label: 'Edificio', icon: Building2 },
  { section: 'unidades', label: 'Unidades', icon: DoorOpen },
  { section: 'amenities', label: 'Amenities', icon: Sparkles },
] as const satisfies readonly { section: Section; label: string; icon: unknown }[]*/

export function BottomDock({
  //section,
  onSectionChange,
  pois,
  selectedId,
  onPoiSelect,
  className,
}: BottomDockProps) {
  // 'poi' se considera parte de "Entorno".
  //const activeMode = section === 'poi' ? 'general' : section

  return (
    <footer className={clsx(styles.dock, className)}>
      <section className={clsx(styles.card, styles.summary)}>
        <Thumb kind="building" size="md" className={styles.summaryThumb} />
        <div className={styles.summaryText}>
          <h3>{building.name}</h3>
          <p className={styles.address}>{building.address}</p>
          <p className={styles.blurb}>{building.summary}</p>
          <button className={styles.link} onClick={() => onSectionChange('pisos')}>
            Ver detalles
            <ArrowRight />
          </button>
        </div>
      </section>

      {/*<section className={clsx(styles.card, styles.modes)} aria-label="Modos">
        {modes.map(({ section: s, label, icon: Icon }) => (
          <button
            key={s}
            className={clsx(styles.mode, activeMode === s && styles.modeActive)}
            onClick={() => onSectionChange(s)}
          >
            <Icon />
            {label}
          </button>
        ))}
      </section>*/}

      <section className={clsx(styles.card, styles.pois)}>
        <h3>Puntos de interés cercanos</h3>
        <ul className={styles.poiList}>
          {pois.map((poi) => (
            <li key={poi.id}>
              <button
                className={clsx(styles.poi, poi.id === selectedId && styles.poiActive)}
                onClick={() => onPoiSelect(poi)}
              >
                <span className={styles.poiTile}>
                  <PoiIcon category={poi.category} size="md" />
                </span>
                <strong>{poi.info.label}</strong>
                <span>{categoryLabels[poi.category]}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/*<section className={clsx(styles.card, styles.tour)}>
        <Route className={styles.tourIcon} />
        <h3>Recorrido sugerido</h3>
        <p>Descubrí el entorno y cómo se conecta con la ciudad.</p>
        <button className={styles.tourButton}>
          Iniciar recorrido
          <ArrowRight />
        </button>
      </section>*/}
    </footer>
  )
}
