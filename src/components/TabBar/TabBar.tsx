import { NavLink } from 'react-router-dom'
import { Layers, DoorOpen, Map, Sparkles } from 'lucide-react'
import clsx from 'clsx'
import styles from './TabBar.module.scss'

const tabs = [
  { to: '/', label: 'Mapa', icon: Map },
  { to: '/pisos', label: 'Pisos', icon: Layers },
  { to: '/unidades', label: 'Unidades', icon: DoorOpen },
  { to: '/amenities', label: 'Amenities', icon: Sparkles },
] as const

export function TabBar() {
  return (
    <nav aria-label="Navegación principal" className={styles.tabBar}>
      {tabs.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) => clsx(styles.tab, isActive && styles.active)}
        >
          <Icon />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
