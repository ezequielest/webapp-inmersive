import { useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { BottomDock } from '@/components/desktop/BottomDock/BottomDock'
import { BuildingPanel, type BuildingTab } from '@/components/desktop/BuildingPanel/BuildingPanel'
import { DesktopSidebar } from '@/components/desktop/DesktopSidebar/DesktopSidebar'
import { DesktopTopBar } from '@/components/desktop/DesktopTopBar/DesktopTopBar'
import { PoiPanel } from '@/components/desktop/PoiPanel/PoiPanel'
import { SidePanel } from '@/components/desktop/SidePanel/SidePanel'
import type { Section } from '@/components/desktop/types'
import { ExplorerView } from '@/components/ExplorerView/ExplorerView'
import { PoiDetailCard } from '@/components/PoiDetailCard/PoiDetailCard'
import type { Hotspot } from '@/data/hotspots'
import { useExplorer, type PoiFilter } from '@/state/ExplorerContext'
import styles from './DesktopLayout.module.scss'

export default function DesktopLayout() {
  const { selected, setSelectedHotspotId, selectBuilding, filter, setFilter, query, setQuery, pois } =
    useExplorer()
  const [section, setSection] = useState<Section>('general')
  const [floor, setFloor] = useState(10)

  // Cualquier hotspot que no sea el edificio muestra su descripción en el panel derecho.
  const selectedPoi = selected.category === 'building' ? null : selected
  const panelOpen = selectedPoi !== null || section !== 'general'

  const goTo = (next: Section) => {
    if (selectedPoi) selectBuilding() // vuelve la cámara al edificio
    setSection(next)
  }

  const handleHotspotClick = (hotspot: Hotspot) => {
    if (hotspot.category === 'building') goTo('pisos')
    else select(hotspot.id)
  }

  // Al elegir una categoría o buscar, mostramos la lista de resultados.
  const changeFilter = (next: PoiFilter) => {
    setFilter(next)
    if (next && !selectedPoi) setSection('poi')
  }
  const changeQuery = (next: string) => {
    setQuery(next)
    if (next.trim() !== '' && !selectedPoi) setSection('poi')
  }

  const closePanel = () => {
    if (selectedPoi) selectBuilding()
    else setSection('general')
  }

  const buildingTab: BuildingTab | null =
    section === 'pisos' || section === 'unidades' || section === 'amenities' ? section : null

  return (
    <div className={styles.layout}>
      <DesktopSidebar className={styles.sidebar} section={section} onSelect={goTo} />

      <main className={styles.stage}>
        <ExplorerView switchPosition="bottom" onHotspotClick={handleHotspotClick} />

        <DesktopTopBar
          query={query}
          onQueryChange={changeQuery}
          filter={filter}
          onFilterChange={changeFilter}
        />

        <AnimatePresence>
          {panelOpen && (
            <SidePanel
              key="panel"
              title={
                selectedPoi ? selectedPoi.info.label : section === 'poi' ? 'Puntos de interés' : undefined
              }
              onClose={closePanel}
            >
              {selectedPoi ? (
                <PoiDetailCard hotspot={selectedPoi} />
              ) : section === 'poi' ? (
                <PoiPanel pois={pois} onSelect={(poi) => setSelectedHotspotId(poi.id)} />
              ) : buildingTab ? (
                <BuildingPanel
                  tab={buildingTab}
                  onTabChange={setSection}
                  floor={floor}
                  onFloorChange={setFloor}
                />
              ) : null}
            </SidePanel>
          )}
        </AnimatePresence>
      </main>

      <BottomDock
        className={styles.dock}
        section={section}
        onSectionChange={goTo}
        pois={pois}
        selectedId={selected.id}
        onPoiSelect={(poi) => setSelectedHotspotId(poi.id)}
      />
    </div>
  )
}
