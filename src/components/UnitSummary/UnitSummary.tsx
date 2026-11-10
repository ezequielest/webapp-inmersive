import { Bath, BedDouble, Square } from 'lucide-react'
import { Button } from '@/components/Button/Button'
import { getTipologia, type Unit } from '@/data/mock'
import styles from './UnitSummary.module.scss'

type UnitSummaryProps = {
  unit: Unit
}

/** Título, características y CTA de una unidad. Compartido entre mobile y desktop. */
export function UnitSummary({ unit }: UnitSummaryProps) {
  const tipologia = getTipologia(unit.tipologiaId)

  return (
    <div className={styles.summary}>
      <div className={styles.heading}>
        <h2>{tipologia?.name}</h2>
        <p>{unit.area} m² totales</p>
      </div>

      <ul className={styles.specs}>
        <li>
          <BedDouble />
          {unit.dormitorios} dormitorios
        </li>
        <li>
          <Bath />
          {unit.banos} baños
        </li>
        {unit.balcon && (
          <li>
            <Square />
            Balcón
          </li>
        )}
      </ul>

      <Button fullWidth>Consultar</Button>
    </div>
  )
}
