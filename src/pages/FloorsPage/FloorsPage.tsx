import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BuildingView } from '@/components/BuildingView/BuildingView'
import { ListItem } from '@/components/ListItem/ListItem'
import { SegmentedControl } from '@/components/SegmentedControl/SegmentedControl'
import { Thumb } from '@/components/Thumb/Thumb'
import { TopBar } from '@/components/TopBar/TopBar'
import { building, floorLabel, unitsByFloor } from '@/data/mock'
import styles from './FloorsPage.module.scss'

type ViewMode = '3d' | 'lista'

const viewOptions = [
  { value: '3d', label: '3D' },
  { value: 'lista', label: 'Lista' },
] as const

export default function FloorsPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<ViewMode>('3d')
  const [floor, setFloor] = useState(9)

  const count = unitsByFloor(floor).length

  return (
    <div className={styles.page}>
      <TopBar
        title="Pisos"
        onBack={() => navigate('/')}
        right={
          <SegmentedControl
            size="sm"
            options={[...viewOptions]}
            value={mode}
            onChange={setMode}
          />
        }
      />

      {mode === '3d' ? (
        <BuildingView floors={building.floors} selected={floor} onSelect={setFloor} />
      ) : (
        <ul className={styles.list}>
          {Array.from({ length: building.floors + 1 }, (_, i) => building.floors - i).map((f) => (
            <li key={f}>
              <ListItem
                variant="card"
                leading={<Thumb kind="plan" size="sm" />}
                title={f === 0 ? 'Planta baja' : `Piso ${f}`}
                subtitle={`${unitsByFloor(f).length} unidades`}
                onClick={() => {
                  setFloor(f)
                  navigate(`/unidades?piso=${f}`)
                }}
              />
            </li>
          ))}
        </ul>
      )}

      <div className={styles.footer}>
        <ListItem
          variant="card"
          leading={<Thumb kind="plan" size="sm" />}
          title={floor === 0 ? 'Planta baja' : `Piso ${floor}`}
          subtitle={`${count} unidades · ${floorLabel(floor)}`}
          onClick={() => navigate(`/unidades?piso=${floor}`)}
        />
      </div>
    </div>
  )
}
