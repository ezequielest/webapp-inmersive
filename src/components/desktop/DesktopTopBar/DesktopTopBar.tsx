import { Search } from 'lucide-react'
import clsx from 'clsx'
import { Chip } from '@/components/Chip/Chip'
import { PoiIcon } from '@/components/PoiIcon/PoiIcon'
import { poiCategories } from '@/data/hotspots'
import type { PoiFilter } from '@/state/ExplorerContext'
import styles from './DesktopTopBar.module.scss'

type DesktopTopBarProps = {
  query: string
  onQueryChange: (query: string) => void
  filter: PoiFilter
  onFilterChange: (filter: PoiFilter) => void
  className?: string
}

export function DesktopTopBar({
  query,
  onQueryChange,
  filter,
  onFilterChange,
  className,
}: DesktopTopBarProps) {
  // Tocar el chip activo lo desactiva.
  const toggle = (next: Exclude<PoiFilter, null>) => onFilterChange(filter === next ? null : next)

  return (
    <header className={clsx(styles.topBar, className)}>
      <label className={styles.search}>
        <Search />
        <input
          type="search"
          value={query}
          placeholder="Buscar puntos de interés"
          onChange={(e) => onQueryChange(e.target.value)}
        />
      </label>

      <div className={styles.chips}>
        <Chip active={filter === 'todos'} onClick={() => toggle('todos')}>
          Todos
        </Chip>
        {poiCategories.map((c) => (
          <Chip
            key={c.id}
            active={filter === c.id}
            icon={<PoiIcon category={c.id} size="sm" />}
            onClick={() => toggle(c.id)}
          >
            {c.label}
          </Chip>
        ))}
      </div>

      {/*<div className={styles.actions}>
        <IconButton label="Cuenta" icon={<User />} />
        <IconButton label="Menú" icon={<Menu />} />
      </div>*/}
    </header>
  )
}
