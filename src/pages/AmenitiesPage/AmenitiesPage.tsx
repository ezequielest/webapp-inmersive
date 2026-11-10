import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import clsx from 'clsx'
import { IconButton } from '@/components/IconButton/IconButton'
import { Thumb } from '@/components/Thumb/Thumb'
import { TopBar } from '@/components/TopBar/TopBar'
import { amenities } from '@/data/mock'
import styles from './AmenitiesPage.module.scss'

export default function AmenitiesPage() {
  const navigate = useNavigate()
  const [selectedId, setSelectedId] = useState(amenities[0].id)
  const selected = amenities.find((a) => a.id === selectedId) ?? amenities[0]

  return (
    <div className={styles.page}>
      <TopBar
        title="Amenities"
        onBack={() => navigate('/')}
        right={<IconButton label="Filtrar" icon={<SlidersHorizontal />} />}
      />

      <div className={styles.hero}>
        <Thumb kind={selected.kind} size="hero" />
      </div>

      <section className={styles.panel}>
        <div className={styles.selected}>
          <Thumb kind={selected.kind} size="sm" />
          <div className={styles.selectedText}>
            <strong>{selected.name}</strong>
            <span>{selected.place}</span>
          </div>
        </div>
        <p className={styles.description}>{selected.description}</p>

        <ul className={styles.carousel}>
          {amenities.map((a) => (
            <li key={a.id}>
              <button
                aria-label={a.name}
                className={clsx(styles.photo, a.id === selectedId && styles.photoActive)}
                onClick={() => setSelectedId(a.id)}
              >
                <Thumb kind={a.kind} size="hero" />
                <span className={styles.photoLabel}>{a.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
