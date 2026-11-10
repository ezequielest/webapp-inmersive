import { useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import clsx from 'clsx'
import { Button } from '@/components/Button/Button'
import { ListItem } from '@/components/ListItem/ListItem'
import { SegmentedControl } from '@/components/SegmentedControl/SegmentedControl'
import { Thumb } from '@/components/Thumb/Thumb'
import { UnitSummary } from '@/components/UnitSummary/UnitSummary'
import {
  amenities,
  building,
  floorLabel,
  getTipologia,
  getUnit,
  tipologias,
  units,
  unitsByFloor,
} from '@/data/mock'
import styles from './BuildingPanel.module.scss'

export type BuildingTab = 'pisos' | 'unidades' | 'amenities'

type BuildingPanelProps = {
  tab: BuildingTab
  onTabChange: (tab: BuildingTab) => void
  floor: number
  onFloorChange: (floor: number) => void
}

type UnitsView = 'tipologias' | 'unidades'

const tabs: { value: BuildingTab; label: string }[] = [
  { value: 'pisos', label: 'Pisos' },
  { value: 'unidades', label: 'Unidades' },
  { value: 'amenities', label: 'Amenities' },
]

const unitsViewOptions = [
  { value: 'tipologias', label: 'Tipologías' },
  { value: 'unidades', label: 'Unidades' },
] as const

const floors = Array.from({ length: building.floors + 1 }, (_, i) => building.floors - i)

export function BuildingPanel({ tab, onTabChange, floor, onFloorChange }: BuildingPanelProps) {
  const [unitsView, setUnitsView] = useState<UnitsView>('tipologias')
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null)
  const [selectedAmenityId, setSelectedAmenityId] = useState(amenities[0].id)

  const selectedUnit = selectedUnitId ? getUnit(selectedUnitId) : undefined
  const selectedAmenity = amenities.find((a) => a.id === selectedAmenityId) ?? amenities[0]

  const changeTab = (next: BuildingTab) => {
    setSelectedUnitId(null)
    onTabChange(next)
  }

  return (
    <div className={styles.panel}>
      <header className={styles.header}>
        <Thumb kind="building" size="md" />
        <div className={styles.headerText}>
          <h2>{building.name}</h2>
          <p>{building.address}</p>
          <span className={styles.status}>{building.status}</span>
        </div>
      </header>

      <div role="tablist" className={styles.tabs}>
        {tabs.map((t) => (
          <button
            key={t.value}
            role="tab"
            aria-selected={tab === t.value}
            className={clsx(styles.tab, tab === t.value && styles.tabActive)}
            onClick={() => changeTab(t.value)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'pisos' && (
        <>
          <h3 className={styles.sectionTitle}>Seleccioná un piso</h3>
          <ul className={styles.list}>
            {floors.map((f) => (
              <li key={f}>
                <ListItem
                  variant="card"
                  selected={f === floor}
                  leading={<span className={styles.badge}>{f === 0 ? 'PB' : f}</span>}
                  title={f === 0 ? 'Planta baja' : `Piso ${f}`}
                  subtitle={`Disponibles: ${unitsByFloor(f).length} unidades`}
                  onClick={() => onFloorChange(f)}
                />
              </li>
            ))}
          </ul>
          <Button
            fullWidth
            className={styles.cta}
            onClick={() => {
              setUnitsView('unidades')
              changeTab('unidades')
            }}
          >
            Ver unidades del piso
            <ArrowRight />
          </Button>
        </>
      )}

      {tab === 'unidades' &&
        (selectedUnit ? (
          <div className={styles.detail}>
            <button className={styles.back} onClick={() => setSelectedUnitId(null)}>
              <ArrowLeft />
              Unidad {selectedUnit.id}
            </button>
            <Thumb kind="plan" size="hero" className={styles.detailHero} />
            <UnitSummary unit={selectedUnit} />
          </div>
        ) : (
          <>
            <SegmentedControl
              options={[...unitsViewOptions]}
              value={unitsView}
              onChange={setUnitsView}
            />
            <h3 className={styles.sectionTitle}>
              {unitsView === 'tipologias' ? 'Tipologías' : `Unidades · ${floorLabel(floor)}`}
            </h3>
            <ul className={styles.list}>
              {unitsView === 'tipologias'
                ? tipologias.map((t) => (
                    <li key={t.id}>
                      <ListItem
                        variant="card"
                        leading={<Thumb kind="plan" size="sm" />}
                        title={t.name}
                        subtitle={`Desde ${t.fromArea} m²`}
                        onClick={() => {
                          const first = units.find((u) => u.tipologiaId === t.id)
                          if (first) setSelectedUnitId(first.id)
                        }}
                      />
                    </li>
                  ))
                : unitsByFloor(floor).map((u) => (
                    <li key={u.id}>
                      <ListItem
                        variant="card"
                        leading={<Thumb kind="plan" size="sm" />}
                        title={`Unidad ${u.id}`}
                        subtitle={`${getTipologia(u.tipologiaId)?.name} · ${u.area} m²`}
                        onClick={() => setSelectedUnitId(u.id)}
                      />
                    </li>
                  ))}
            </ul>
          </>
        ))}

      {tab === 'amenities' && (
        <>
          <h3 className={styles.sectionTitle}>Amenities del edificio</h3>
          <ul className={styles.list}>
            {amenities.map((a) => (
              <li key={a.id}>
                <ListItem
                  variant="card"
                  selected={a.id === selectedAmenityId}
                  leading={<Thumb kind={a.kind} size="sm" />}
                  title={a.name}
                  subtitle={a.place}
                  onClick={() => setSelectedAmenityId(a.id)}
                />
              </li>
            ))}
          </ul>
          <p className={styles.amenityDescription}>{selectedAmenity.description}</p>
        </>
      )}
    </div>
  )
}
