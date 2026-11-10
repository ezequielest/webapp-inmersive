import type { ReactNode } from 'react'
import clsx from 'clsx'
import styles from './Chip.module.scss'

type ChipProps = {
  active?: boolean
  icon?: ReactNode
  onClick?: () => void
  children: ReactNode
}

export function Chip({ active, icon, onClick, children }: ChipProps) {
  return (
    <button
      aria-pressed={active}
      className={clsx(styles.chip, active && styles.active)}
      onClick={onClick}
    >
      {icon}
      {children}
    </button>
  )
}
