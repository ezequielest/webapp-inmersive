import { Cuboid, House, Layers, MapPin, Route, Sparkles, Box } from 'lucide-react'
import clsx from 'clsx'
import type { Section } from '@/components/desktop/types'
import styles from './DesktopSidebar.module.scss'

type DesktopSidebarProps = {
  section: Section
  onSelect: (section: Section) => void
  className?: string
}

// Los ítems sin `section` todavía no tienen contenido (quedan deshabilitados).
const items = [
  { label: 'Vista general', icon: House, section: 'general' },
  { label: 'Puntos de interés', icon: MapPin, section: 'poi' },
  { label: 'Pisos / Unidades', icon: Layers, section: 'pisos' },
  { label: 'Tipologías', icon: Box, section: 'unidades' },
  { label: 'Amenities', icon: Sparkles, section: 'amenities' },
  { label: 'Rutas y recorrido', icon: Route },
  { label: 'Modelo 3D', icon: Cuboid },
] as const satisfies readonly { label: string; icon: unknown; section?: Section }[]

/*function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(id)
  }, [])
  return now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })
}*/

export function DesktopSidebar({ section, onSelect, className }: DesktopSidebarProps) {
  //const time = useClock()

  return (
    <aside className={clsx(styles.sidebar, className)}>
      <div className={styles.logo}>
        <span className={styles.logoMark}>CLOSER</span>
        <span className={styles.logoTag}>Innovación en Real Estate</span>
      </div>

      <nav aria-label="Secciones" className={styles.nav}>
        {items.map((item) => {
          const Icon = item.icon
          const target = 'section' in item ? item.section : undefined
          return (
            <button
              key={item.label}
              disabled={!target}
              className={clsx(styles.navItem, target === section && styles.active)}
              onClick={() => target && onSelect(target)}
            >
              <Icon />
              {item.label}
            </button>
          )
        })}
      </nav>

      {/*<div className={styles.footer}>
        <button className={styles.project} onClick={() => onSelect('pisos')}>
          <Thumb kind="building" size="sm" />
          <span className={styles.projectText}>
            <strong>{building.nickname}</strong>
            <span>{building.address}</span>
          </span>
          <ChevronRight />
        </button>

        <div className={styles.weather}>
          <Sun />
          <span className={styles.weatherText}>
            <strong>18°C</strong>
            <span>Buenos Aires</span>
          </span>
          <time>{time}</time>
        </div>
      </div>*/}
    </aside>
  )
}
