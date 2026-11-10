import { useEffect, useState } from 'react'
import { CopyButton } from '@/components/CopyButton/CopyButton'
import { formatNavigation, formatVec3 } from './debugFormat'
import type { DebugSnapshot } from './debugTools'
import styles from './DebugPanel.module.scss'

type DebugPanelProps = {
  /** Devuelve los valores actuales del visor (o null si todavía no está listo). */
  getSnapshot: () => DebugSnapshot | null
}

type RowProps = {
  label: string
  value: string
  /** Texto que se copia: se pide al hacer clic para que sea el valor más reciente. */
  getCopyText: () => string
}

function Row({ label, value, getCopyText }: RowProps) {
  return (
    <div className={styles.row}>
      <div className={styles.rowHead}>
        <span className={styles.label}>{label}</span>
        <CopyButton label={`Copiar ${label}`} getText={getCopyText} />
      </div>
      <code className={styles.value}>{value}</code>
    </div>
  )
}

export function DebugPanel({ getSnapshot }: DebugPanelProps) {
  const [snapshot, setSnapshot] = useState<DebugSnapshot | null>(null)

  // Se consulta cada 150 ms en vez de en cada frame: así React no se redibuja 60 veces por segundo.
  // Además solo se actualiza si algo cambió, así que con la cámara quieta no hay redibujado.
  useEffect(() => {
    const id = setInterval(() => {
      const next = getSnapshot()
      setSnapshot((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next))
    }, 150)
    return () => clearInterval(id)
  }, [getSnapshot])

  return (
    <aside className={styles.panel} aria-label="Debug">
      <section className={styles.card}>
        <h2 className={styles.title}>Cubo</h2>
        <Row
          label="initialPoint"
          value={snapshot ? formatVec3(snapshot.cube) : '—'}
          getCopyText={() => formatVec3(getSnapshot()?.cube ?? [])}
        />
        <p className={styles.hint}>Arrastrá las flechas del cubo rosa para moverlo.</p>
      </section>

      <section className={styles.card}>
        <h2 className={styles.title}>Cámara</h2>
        <Row
          label="positionCamera"
          value={snapshot ? formatVec3(snapshot.camera.position) : '—'}
          getCopyText={() => formatVec3(getSnapshot()?.camera.position ?? [])}
        />
        <Row
          label="target"
          value={snapshot ? formatVec3(snapshot.camera.target) : '—'}
          getCopyText={() => formatVec3(getSnapshot()?.camera.target ?? [])}
        />
        {/* Cubo + cámara juntos: el bloque completo para pegar en hotspots.ts */}
        <CopyButton
          variant="block"
          label="Copiar navigation"
          getText={() => {
            const current = getSnapshot()
            return current ? formatNavigation(current) : ''
          }}
        />
      </section>
    </aside>
  )
}
