import clsx from 'clsx'
import { floorLabel } from '@/data/mock'
import styles from './BuildingView.module.scss'

type BuildingViewProps = {
  /** Cantidad de pisos sobre PB (PB = 0). */
  floors: number
  selected: number
  onSelect: (floor: number) => void
}

/**
 * Torre pseudo-3D en CSS + selector de pisos. Reemplazable por un visor 3D real
 * (three.js / modelo glb) manteniendo las mismas props.
 */
export function BuildingView({ floors, selected, onSelect }: BuildingViewProps) {
  const levels = Array.from({ length: floors + 1 }, (_, i) => floors - i) // P10 … PB

  return (
    <div className={styles.view}>
      <div className={styles.stage}>
        <div className={styles.tower}>
          {levels.map((floor) => (
            <button
              key={floor}
              aria-label={`Seleccionar ${floorLabel(floor)}`}
              className={clsx(styles.floor, floor === selected && styles.selected)}
              onClick={() => onSelect(floor)}
            >
              <span className={clsx(styles.face, styles.front)} />
              <span className={clsx(styles.face, styles.sideRight)} />
              <span className={clsx(styles.face, styles.sideLeft)} />
            </button>
          ))}
        </div>
      </div>

      <ul className={styles.selector}>
        {levels.map((floor) => (
          <li key={floor}>
            <button
              className={clsx(styles.pill, floor === selected && styles.pillActive)}
              onClick={() => onSelect(floor)}
            >
              {floorLabel(floor)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
