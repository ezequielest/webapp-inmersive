import { useRef } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'motion/react'
import { ExplorerView } from '@/components/ExplorerView/ExplorerView'
import { PageTransition, type NavDirection } from '@/components/PageTransition/PageTransition'
import type { Hotspot } from '@/data/hotspots'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import DesktopLayout from '@/layouts/DesktopLayout/DesktopLayout'
import AmenitiesPage from '@/pages/AmenitiesPage/AmenitiesPage'
import FloorsPage from '@/pages/FloorsPage/FloorsPage'
import MapPage from '@/pages/MapPage/MapPage'
import UnitDetailPage from '@/pages/UnitDetailPage/UnitDetailPage'
import UnitsPage from '@/pages/UnitsPage/UnitsPage'
import { useExplorer } from '@/state/ExplorerContext'

// Profundidad de cada ruta: define si la navegación es "avanzar" o "volver".
function depthOf(pathname: string) {
  if (pathname === '/') return 0
  return pathname.split('/').filter(Boolean).length
}

function useNavDirection(pathname: string): NavDirection {
  const prev = useRef({ pathname, depth: depthOf(pathname) })
  const direction = useRef<NavDirection>(1)

  if (prev.current.pathname !== pathname) {
    const depth = depthOf(pathname)
    direction.current = depth >= prev.current.depth ? 1 : -1
    prev.current = { pathname, depth }
  }
  return direction.current
}

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const { setSelectedHotspotId } = useExplorer()
  const direction = useNavDirection(location.pathname)
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  // ≥1024px: explorador de una sola pantalla. Menos: app mobile con rutas y transiciones.
  if (isDesktop) return <DesktopLayout />

  const isMap = location.pathname === '/'

  const handleHotspotClick = (hotspot: Hotspot) => {
    setSelectedHotspotId(hotspot.id)
    if (hotspot.category === 'building') navigate('/pisos')
  }

  return (
    <div className="app">
      {/*
        El visor vive fuera de las rutas: así el splat no se vuelve a descargar ni a decodificar
        al navegar. Las demás pantallas lo tapan (fondo opaco) y se pausa mientras no se ve.
      */}
      <ExplorerView active={isMap} onHotspotClick={handleHotspotClick} />

      <AnimatePresence custom={direction} initial={false}>
        <PageTransition key={location.pathname} direction={direction} transparent={isMap}>
          <Routes location={location}>
            <Route path="/" element={<MapPage />} />
            <Route path="/pisos" element={<FloorsPage />} />
            <Route path="/unidades" element={<UnitsPage />} />
            <Route path="/unidades/:unitId" element={<UnitDetailPage />} />
            <Route path="/amenities" element={<AmenitiesPage />} />
            <Route path="*" element={<MapPage />} />
          </Routes>
        </PageTransition>
      </AnimatePresence>
    </div>
  )
}

export default App
