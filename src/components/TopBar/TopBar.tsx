import type { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'
import { IconButton } from '@/components/IconButton/IconButton'
import styles from './TopBar.module.scss'

type TopBarProps = {
  title: string
  onBack?: () => void
  right?: ReactNode
}

export function TopBar({ title, onBack, right }: TopBarProps) {
  return (
    <header className={styles.topBar}>
      {onBack && (
        <IconButton label="Volver" icon={<ArrowLeft />} onClick={onBack} className={styles.back} />
      )}
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.right}>{right}</div>
    </header>
  )
}
