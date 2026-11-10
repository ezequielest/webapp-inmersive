import type { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'
import styles from './Button.module.scss'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary'
  fullWidth?: boolean
}

export function Button({
  variant = 'primary',
  fullWidth,
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={clsx(styles.button, styles[variant], fullWidth && styles.full, className)}
      {...rest}
    />
  )
}
