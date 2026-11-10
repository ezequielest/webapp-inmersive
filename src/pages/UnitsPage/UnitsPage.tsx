import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import { IconButton } from '@/components/IconButton/IconButton'
import { ListItem } from '@/components/ListItem/ListItem'
import { SegmentedControl } from '@/components/SegmentedControl/SegmentedControl'
import { Thumb } from '@/components/Thumb/Thumb'
import { TopBar } from '@/components/TopBar/TopBar'
import { floorLabel, getTipologia, tipologias, units } from '@/data/mock'
import styles from './UnitsPage.module.scss'

type Tab = 'tipologias' | 'unidades'

const tabs = [
  { value: 'tipologias', label: 'Tipologías' },
  { value: 'unidades', label: 'Unidades' },
] as const

export default function UnitsPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const floorParam = params.get('piso')
  const floor = floorParam === null ? null : Number(floorParam)

  // Si llegamos desde un piso, mostramos directamente sus unidades.
  const [tab, setTab] = useState<Tab>(floor === null ? 'tipologias' : 'unidades')

  const visibleUnits = floor === null ? units : units.filter((u) => u.floor === floor)

  return (
    <div className={styles.page}>
      <TopBar
        title={floor === null ? 'Unidades' : `Unidades · ${floorLabel(floor)}`}
        onBack={() => navigate(floor === null ? '/' : '/pisos')}
        right={<IconButton label="Filtrar" icon={<SlidersHorizontal />} />}
      />

      <div className={styles.hero}>
        <Thumb kind="plan" size="hero" />
      </div>

      <section className={styles.panel}>
        <SegmentedControl options={[...tabs]} value={tab} onChange={setTab} />

        <ul className={styles.list}>
          {tab === 'tipologias'
            ? tipologias.map((t) => (
                <li key={t.id}>
                  <ListItem
                    variant="card"
                    leading={<Thumb kind="plan" size="sm" />}
                    title={t.name}
                    subtitle={`Desde ${t.fromArea} m²`}
                    onClick={() => {
                      const first = units.find((u) => u.tipologiaId === t.id)
                      if (first) navigate(`/unidades/${first.id}`)
                    }}
                  />
                </li>
              ))
            : visibleUnits.map((u) => (
                <li key={u.id}>
                  <ListItem
                    variant="card"
                    leading={<Thumb kind="plan" size="sm" />}
                    title={`Unidad ${u.id}`}
                    subtitle={`${getTipologia(u.tipologiaId)?.name} · ${u.area} m²`}
                    onClick={() => navigate(`/unidades/${u.id}`)}
                  />
                </li>
              ))}
        </ul>
      </section>
    </div>
  )
}
