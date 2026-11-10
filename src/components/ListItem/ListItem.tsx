import type { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'
import clsx from 'clsx'
import styles from './ListItem.module.scss'

type ListItemProps = {
  leading?: ReactNode
  title: string
  subtitle?: string
  trailing?: ReactNode
  /** Muestra un chevron si hay onClick y no se pasó `trailing`. */
  onClick?: () => void
  variant?: 'plain' | 'card'
  selected?: boolean
}

export function ListItem({
  leading,
  title,
  subtitle,
  trailing,
  onClick,
  variant = 'plain',
  selected,
}: ListItemProps) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag
      className={clsx(
        styles.item,
        styles[variant],
        onClick && styles.clickable,
        selected && styles.selected,
      )}
      onClick={onClick}
    >
      {leading}
      <span className={styles.text}>
        <span className={styles.title}>{title}</span>
        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
      </span>
      {trailing ?? (onClick && <ChevronRight className={styles.chevron} />)}
    </Tag>
  )
}
