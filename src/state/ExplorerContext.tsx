import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import {
  buildingHotspot,
  getHotspot,
  hotspots,
  isPoi,
  type Hotspot,
  type PoiCategory,
} from '@/data/hotspots'

export type PoiFilter = PoiCategory | 'todos' | null
export type ViewMode = 'splat' | 'map'

type ExplorerState = {
  selected: Hotspot
  setSelectedHotspotId: (id: string) => void
  /** Vuelve la selección (y la cámara) al edificio. */
  selectBuilding: () => void

  filter: PoiFilter
  setFilter: (filter: PoiFilter) => void
  query: string
  setQuery: (query: string) => void

  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void

  /** Hotspots que se dibujan en el splat / mapa. */
  visibleHotspots: Hotspot[]
  /** POIs para las listas (filtrados por categoría y búsqueda). */
  pois: Hotspot[]
}

const ExplorerContext = createContext<ExplorerState | null>(null)

const matchesQuery = (h: Hotspot, q: string) =>
  h.info.label.toLowerCase().includes(q) || (h.info.address ?? '').toLowerCase().includes(q)

export function ExplorerProvider({ children }: { children: ReactNode }) {
  const [selectedId, setSelectedId] = useState(
    () => hotspots.find((h) => h.selected)?.id ?? buildingHotspot.id,
  )
  const [filter, setFilter] = useState<PoiFilter>(null)
  const [query, setQuery] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('splat')

  const value = useMemo<ExplorerState>(() => {
    const q = query.trim().toLowerCase()
    const allPois = hotspots.filter(isPoi)

    const pois = allPois.filter(
      (h) =>
        (filter === null || filter === 'todos' || h.category === filter) &&
        (q === '' || matchesQuery(h, q)),
    )

    // `visible` del dato = siempre visible. El resto aparece según filtro / búsqueda,
    // y el hotspot seleccionado nunca se oculta.
    const visibleHotspots = hotspots.filter(
      (h) =>
        h.visible ||
        h.id === selectedId ||
        (isPoi(h) && ((filter !== null && pois.includes(h)) || (q !== '' && pois.includes(h)))),
    )

    return {
      selected: getHotspot(selectedId) ?? buildingHotspot,
      setSelectedHotspotId: setSelectedId,
      selectBuilding: () => setSelectedId(buildingHotspot.id),
      filter,
      setFilter,
      query,
      setQuery,
      viewMode,
      setViewMode,
      visibleHotspots,
      pois,
    }
  }, [selectedId, filter, query, viewMode])

  return <ExplorerContext.Provider value={value}>{children}</ExplorerContext.Provider>
}

export function useExplorer() {
  const ctx = useContext(ExplorerContext)
  if (!ctx) throw new Error('useExplorer debe usarse dentro de <ExplorerProvider>')
  return ctx
}
