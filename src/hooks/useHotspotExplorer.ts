import { useMemo, useState } from 'react'
import {
  getHotspot,
  homeHotspot,
  hotspots,
  isPoi,
  type Hotspot,
  type PoiCategory,
} from '@/data/hotspots'

/**
 * Estado compartido del explorador (mobile y desktop): filtro por categoría, búsqueda,
 * hotspot seleccionado y cuáles se muestran en el splat / mapa.
 *
 * Visibilidad: se muestran los hotspots con `visible: true`, el seleccionado,
 * los de la categoría activa y los que coinciden con la búsqueda.
 */
export function useHotspotExplorer() {
  const [category, setCategory] = useState<PoiCategory | 'todos'>('todos')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(
    () => hotspots.find((h) => h.selected)?.id ?? null,
  )

  const normalized = query.trim().toLowerCase()

  const { poiList, shownIds } = useMemo(() => {
    const matchesQuery = (h: Hotspot) =>
      normalized !== '' &&
      (h.info.label.toLowerCase().includes(normalized) ||
        (h.info.address ?? '').toLowerCase().includes(normalized))

    const poiList = hotspots.filter(
      (h) =>
        isPoi(h) &&
        (category === 'todos' || h.category === category) &&
        (normalized === '' || matchesQuery(h)),
    )

    const shownIds = new Set<string>()
    for (const h of hotspots) {
      if (
        h.visible ||
        h.id === selectedId ||
        (category !== 'todos' && h.category === category) ||
        matchesQuery(h)
      ) {
        shownIds.add(h.id)
      }
    }
    return { poiList, shownIds }
  }, [category, normalized, selectedId])

  return {
    category,
    setCategory,
    query,
    setQuery,
    selectedId,
    selected: selectedId ? (getHotspot(selectedId) ?? null) : null,
    select: setSelectedId,
    /** Vuelve a la vista del edificio (la cámara vuela de regreso). */
    goHome: () => setSelectedId(homeHotspot.id),
    poiList,
    shownIds,
  }
}
