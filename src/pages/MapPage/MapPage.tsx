import { useNavigate, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronRight, Menu, MapPin, Search } from 'lucide-react'
import { BottomSheet } from '@/components/BottomSheet/BottomSheet'
import { Chip } from '@/components/Chip/Chip'
import { IconButton } from '@/components/IconButton/IconButton'
import { ListItem } from '@/components/ListItem/ListItem'
import { PoiDetailCard } from '@/components/PoiDetailCard/PoiDetailCard'
import { PoiIcon } from '@/components/PoiIcon/PoiIcon'
import { TabBar } from '@/components/TabBar/TabBar'
import { Thumb } from '@/components/Thumb/Thumb'
import { building } from '@/data/mock'
import { categoryLabels, poiCategories } from '@/data/hotspots'
import { useExplorer } from '@/state/ExplorerContext'
import styles from './MapPage.module.scss'

/**
 * Overlay de UI sobre el visor (splat / mapa). El visor vive en <App /> para no
 * recargar el splat cada vez que se navega.
 */
export default function MapPage() {
  const navigate = useNavigate()
  // El estado del sheet vive en la URL (?poi=1) para poder enlazarlo / volver con "atrás".
  const [params, setParams] = useSearchParams()
  const poiOpen = params.has('poi')

  const { selected, setSelectedHotspotId, selectBuilding, filter, setFilter, pois } = useExplorer()
  const selectedPoi = selected.category === 'building' ? null : selected

  const setPoiOpen = (open: boolean) => setParams(open ? { poi: '1' } : {}, { replace: true })

  return (
    <div className={styles.page}>
      <div className={styles.topActions}>
        <IconButton label="Menú" icon={<Menu />} />
        <div className={styles.topRight}>
          <IconButton label="Buscar" icon={<Search />} />
          <IconButton
            label="Puntos de interés"
            icon={<MapPin />}
            active={poiOpen}
            onClick={() => setPoiOpen(!poiOpen)}
          />
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {selectedPoi ? (
          <BottomSheet key="detail" title={selectedPoi.info.label} onClose={selectBuilding}>
            <PoiDetailCard hotspot={selectedPoi} />
          </BottomSheet>
        ) : poiOpen ? (
          <BottomSheet key="poi" title="Puntos de interés" onClose={() => setPoiOpen(false)}>
            <div className={styles.chips}>
              <Chip active={filter === 'todos'} onClick={() => setFilter(filter === 'todos' ? null : 'todos')}>
                Todos
              </Chip>
              {poiCategories.map((c) => (
                <Chip
                  key={c.id}
                  active={filter === c.id}
                  icon={<PoiIcon category={c.id} size="sm" />}
                  onClick={() => setFilter(filter === c.id ? null : c.id)}
                >
                  {c.label}
                </Chip>
              ))}
            </div>
            <ul>
              {pois.map((poi) => (
                <li key={poi.id}>
                  <ListItem
                    leading={<PoiIcon category={poi.category} />}
                    title={poi.info.label}
                    subtitle={poi.info.address || categoryLabels[poi.category]}
                    onClick={() => setSelectedHotspotId(poi.id)}
                  />
                </li>
              ))}
            </ul>
          </BottomSheet>
        ) : (
          <motion.button
            key="card"
            className={styles.projectCard}
            onClick={() => navigate('/pisos')}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
          >
            <Thumb kind="building" size="sm" />
            <span className={styles.projectText}>
              <strong>{building.nickname}</strong>
              <span>{building.address}</span>
            </span>
            <ChevronRight />
          </motion.button>
        )}
      </AnimatePresence>

      {!poiOpen && !selectedPoi && <TabBar />}
    </div>
  )
}
