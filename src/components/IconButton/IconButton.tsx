import type { ButtonHTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'
import styles from './IconButton.module.scss'

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  label: string
  icon: ReactNode
  active?: boolean
}

export function IconButton({ label, icon, active, className, ...rest }: IconButtonProps) {
  return (
    <button
      aria-label={label}
      className={clsx(styles.iconButton, active && styles.active, className)}
      {...rest}
    >
      {icon}
    </button>
  )
}
