import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { IconButton } from '@/components/IconButton/IconButton'
import { SegmentedControl } from '@/components/SegmentedControl/SegmentedControl'
import { Thumb } from '@/components/Thumb/Thumb'
import { TopBar } from '@/components/TopBar/TopBar'
import { UnitSummary } from '@/components/UnitSummary/UnitSummary'
import { getUnit } from '@/data/mock'
import styles from './UnitDetailPage.module.scss'

type PlanMode = '3d' | '2d'

const planOptions = [
  { value: '3d', label: 'Plano 3D' },
  { value: '2d', label: 'Plano 2D' },
] as const

export default function UnitDetailPage() {
  const { unitId = '' } = useParams()
  const navigate = useNavigate()
  const [plan, setPlan] = useState<PlanMode>('3d')
  const [favorite, setFavorite] = useState(false)

  const unit = getUnit(unitId)
  if (!unit) return <Navigate to="/unidades" replace />

  return (
    <div className={styles.page}>
      <TopBar
        title={`Unidad ${unit.id}`}
        onBack={() => navigate('/unidades')}
        right={
          <IconButton
            label={favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            icon={<Heart fill={favorite ? 'currentColor' : 'none'} />}
            active={favorite}
            onClick={() => setFavorite((f) => !f)}
          />
        }
      />

      <div className={styles.hero}>
        <Thumb kind="plan" size="hero" className={plan === '2d' ? styles.flat : undefined} />
      </div>

      <section className={styles.panel}>
        <SegmentedControl options={[...planOptions]} value={plan} onChange={setPlan} />
        <UnitSummary unit={unit} />
      </section>
    </div>
  )
}
